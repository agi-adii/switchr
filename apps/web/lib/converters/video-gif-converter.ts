import { loadFfmpeg, resetFfmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { GIFEncoder, quantize, applyPalette } from "gifenc";

export interface VideoToGifOptions {
  preset?: "high" | "balanced" | "small";
  fps?: number;
  maxWidth?: number;
  maxDuration?: number;
  startTime?: number;
  loop?: boolean;
  dither?: "bayer" | "floyd_steinberg" | "none";
  forceCanvas?: boolean;
}

export interface VideoToGifResult {
  url: string;
  blob: Blob;
  newSize: number;
  width?: number;
  height?: number;
  duration?: number;
}

interface ResolvedOptions {
  fps: number;
  maxWidth: number;
  maxColors: number;
  maxDuration: number;
  startTime: number;
  loop: boolean;
  dither: "bayer" | "floyd_steinberg" | "none";
}

function resolveOptions(opts?: VideoToGifOptions): ResolvedOptions {
  const preset = opts?.preset || "balanced";

  let defaultFps = 12;
  let defaultWidth = 480;
  let defaultColors = 256;
  let defaultDither: "bayer" | "floyd_steinberg" | "none" = "bayer";
  let defaultDuration = 15;

  if (preset === "high") {
    defaultFps = 15;
    defaultWidth = 640;
    defaultColors = 256;
    defaultDither = "floyd_steinberg";
    defaultDuration = 15;
  } else if (preset === "small") {
    defaultFps = 10;
    defaultWidth = 360;
    defaultColors = 128;
    defaultDither = "bayer";
    defaultDuration = 12;
  }

  return {
    fps: opts?.fps ?? defaultFps,
    maxWidth: opts?.maxWidth ?? defaultWidth,
    maxColors: defaultColors,
    maxDuration: opts?.maxDuration ?? defaultDuration,
    startTime: Math.max(0, opts?.startTime ?? 0),
    loop: opts?.loop ?? true,
    dither: opts?.dither ?? defaultDither,
  };
}

/**
 * Universal Video to GIF converter:
 * 1. Tries FFmpeg WebAssembly with 2-pass palettegen + paletteuse for pristine color fidelity.
 * 2. If FFmpeg fails (WASM OOM, unsupported codec, or load failure), automatically falls back to
 *    HTML5 <video> + <canvas> + gifenc for 100% universal client-side reliability.
 */
export async function convertVideoToGif(
  file: File,
  options?: VideoToGifOptions,
  onProgress?: (progress: number) => void
): Promise<VideoToGifResult> {
  const resolved = resolveOptions(options);

  if (!options?.forceCanvas) {
    try {
      return await convertVideoToGifFfmpeg(file, resolved, onProgress);
    } catch (ffmpegErr: any) {
      console.warn(
        "[VideoToGif]: FFmpeg WASM failed, falling back to Browser Canvas engine:",
        ffmpegErr?.message || ffmpegErr
      );
      await resetFfmpeg();
    }
  }

  // Automatic Fallback to Browser Canvas + gifenc
  return await convertVideoToGifCanvas(file, resolved, onProgress);
}

/**
 * High-quality FFmpeg WASM conversion with 2-pass palette generation.
 */
async function convertVideoToGifFfmpeg(
  file: File,
  options: ResolvedOptions,
  onProgress?: (p: number) => void
): Promise<VideoToGifResult> {
  const ffmpeg = await loadFfmpeg();
  const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
  const id = Math.random().toString(36).substring(7);
  const inputName = `input_${id}.${ext}`;
  const outputName = `output_${id}.gif`;

  try {
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    ffmpeg.on("progress", ({ progress }) => {
      if (onProgress && typeof progress === "number" && !isNaN(progress)) {
        onProgress(Math.min(0.95, Math.max(0.05, progress)));
      }
    });

    const scaleFilter = `scale=min(${options.maxWidth}\\,iw):-2:flags=lanczos`;
    const fpsFilter = `fps=${options.fps}`;
    const paletteFilter = `[s0]palettegen=stats_mode=diff:max_colors=${options.maxColors}[p]`;
    const useFilter =
      options.dither === "floyd_steinberg"
        ? `[s1][p]paletteuse=dither=floyd_steinberg`
        : `[s1][p]paletteuse=dither=bayer:bayer_scale=5`;

    const complexFilter = `${fpsFilter},${scaleFilter},split[s0][s1];${paletteFilter};${useFilter}`;

    const args: string[] = [];
    if (options.startTime > 0) {
      args.push("-ss", options.startTime.toString());
    }
    args.push("-i", inputName);

    if (options.maxDuration > 0) {
      args.push("-t", options.maxDuration.toString());
    }

    args.push(
      "-vf",
      complexFilter,
      "-loop",
      options.loop ? "0" : "-1",
      "-an",
      outputName
    );

    const exitCode = await ffmpeg.exec(args);

    if (exitCode !== 0) {
      throw new Error(`FFmpeg exited with code ${exitCode}`);
    }

    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data as any], { type: "image/gif" });
    const url = URL.createObjectURL(blob);

    if (onProgress) onProgress(1);

    return {
      url,
      blob,
      newSize: blob.size,
    };
  } finally {
    try {
      await ffmpeg.deleteFile(inputName);
    } catch {}
    try {
      await ffmpeg.deleteFile(outputName);
    } catch {}
  }
}

/**
 * Universal browser-native fallback using HTML5 <video> + <canvas> + gifenc.
 * Works natively in all browsers without WASM or external dependencies.
 */
async function convertVideoToGifCanvas(
  file: File,
  options: ResolvedOptions,
  onProgress?: (p: number) => void
): Promise<VideoToGifResult> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);

    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.crossOrigin = "anonymous";
    video.src = objectUrl;

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      video.pause();
      video.src = "";
      video.load();
    };

    video.onerror = () => {
      cleanup();
      reject(
        new Error(
          "Unable to decode video. Please ensure the file is a valid MP4, WebM, or MOV video clip."
        )
      );
    };

    video.onloadedmetadata = async () => {
      try {
        const naturalWidth = video.videoWidth || 480;
        const naturalHeight = video.videoHeight || 360;
        const naturalDuration = video.duration || 10;

        let width = Math.min(options.maxWidth, naturalWidth);
        let height = Math.round((naturalHeight * width) / naturalWidth);

        // Ensure even dimensions
        if (width % 2 !== 0) width -= 1;
        if (height % 2 !== 0) height -= 1;
        width = Math.max(16, width);
        height = Math.max(16, height);

        const availableDuration = Math.max(0.5, naturalDuration - options.startTime);
        const encodeDuration = Math.min(options.maxDuration, availableDuration);
        const totalFrames = Math.max(2, Math.floor(encodeDuration * options.fps));
        const frameInterval = encodeDuration / totalFrames;
        const delayMs = Math.round(1000 / options.fps);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (!ctx) {
          throw new Error("Could not acquire 2D canvas context for video encoding.");
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        const gif = GIFEncoder();

        for (let i = 0; i < totalFrames; i++) {
          const targetTime = options.startTime + i * frameInterval;
          video.currentTime = targetTime;

          await new Promise<void>((res) => {
            let resolved = false;
            const onSeeked = () => {
              if (resolved) return;
              resolved = true;
              video.removeEventListener("seeked", onSeeked);
              res();
            };
            video.addEventListener("seeked", onSeeked, { once: true });
            // Safety timeout if seeked is delayed
            setTimeout(() => {
              if (resolved) return;
              resolved = true;
              video.removeEventListener("seeked", onSeeked);
              res();
            }, 600);
          });

          ctx.drawImage(video, 0, 0, width, height);
          const imgData = ctx.getImageData(0, 0, width, height);

          // Fast high-quality palette quantization
          const palette = quantize(imgData.data, options.maxColors, {
            format: "rgba4444",
          });
          const index = applyPalette(imgData.data, palette);

          gif.writeFrame(index, width, height, {
            palette,
            delay: delayMs,
            repeat: options.loop ? 0 : -1,
          });

          if (onProgress) {
            onProgress(Math.min(0.98, (i + 1) / totalFrames));
          }
        }

        gif.finish();
        const bytes = gif.bytes();
        const blob = new Blob([bytes as any], { type: "image/gif" });
        const url = URL.createObjectURL(blob);

        cleanup();
        if (onProgress) onProgress(1);

        resolve({
          url,
          blob,
          newSize: blob.size,
          width,
          height,
          duration: encodeDuration,
        });
      } catch (err: any) {
        cleanup();
        reject(err);
      }
    };
  });
}
