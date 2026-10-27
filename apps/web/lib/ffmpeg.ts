import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

let ffmpeg: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

export const resetFfmpeg = async (): Promise<void> => {
  if (ffmpeg) {
    try {
      ffmpeg.terminate();
    } catch {}
  }
  ffmpeg = null;
  loadPromise = null;
};

export const loadFfmpeg = async (): Promise<FFmpeg> => {
  if (ffmpeg && ffmpeg.loaded) return ffmpeg;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const instance = new FFmpeg();

    try {
      // Attempt loading from local /ffmpeg/ assets first if present
      const test = await fetch("/ffmpeg/ffmpeg-core.js", { method: "HEAD" });
      if (test.ok) {
        await instance.load({
          coreURL: await toBlobURL("/ffmpeg/ffmpeg-core.js", "text/javascript"),
          wasmURL: await toBlobURL("/ffmpeg/ffmpeg-core.wasm", "application/wasm"),
        });
        ffmpeg = instance;
        return ffmpeg;
      }
    } catch (err) {
      console.warn("Local FFmpeg core not found, falling back to CDN:", err);
    }

    try {
      // Fallback to CDN
      const cdnURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
      await instance.load({
        coreURL: await toBlobURL(`${cdnURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${cdnURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      ffmpeg = instance;
      return ffmpeg;
    } catch (err) {
      ffmpeg = null;
      loadPromise = null;
      throw err;
    }
  })();

  try {
    return await loadPromise;
  } finally {
    loadPromise = null;
  }
};

export const convertFile = async (
  ffmpeg: FFmpeg,
  file: File,
  toFormat: string,
  onProgress: (progress: number) => void
): Promise<string> => {
  const { name } = file;
  const ext = name.split(".").pop()?.toLowerCase() || "";
  
  // Use safe names for the virtual file system
  const inputName = `input_${Math.random().toString(36).substring(7)}.${ext}`;
  const outputName = `output_${Math.random().toString(36).substring(7)}.${toFormat}`;

  try {
    // Write the file to ffmpeg's virtual file system
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    // Listen to progress and logs
    ffmpeg.on("progress", ({ progress }) => {
      if (typeof progress === "number" && !isNaN(progress)) {
        onProgress(Math.min(0.98, Math.max(0.02, progress)));
      }
    });
    
    ffmpeg.on("log", ({ message }) => {
      console.log("[FFmpeg Log]:", message);
    });

    // Execute the FFmpeg command
    const args = ["-i", inputName];

    if (toFormat === "mp4") {
      args.push("-c:v", "libx264", "-preset", "fast", "-crf", "22", "-c:a", "aac");
    } else if (toFormat === "gif") {
      // Optimized 2-pass palette filter, looping, and safe memory scaling
      args.push(
        "-vf",
        "fps=12,scale=min(480\\,iw):-2:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=diff:max_colors=256[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5",
        "-loop",
        "0",
        "-an",
        "-t",
        "15"
      );
    }

    args.push(outputName);

    const exitCode = await ffmpeg.exec(args);
    
    if (exitCode !== 0) {
      throw new Error(`FFmpeg exited with code ${exitCode}. Check console for details. (Unsupported format?)`);
    }

    // Read the resulting file
    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data as any], { type: getMimeType(toFormat) });
    
    return URL.createObjectURL(blob);
  } finally {
    // Clean up virtual filesystem memory
    try {
      await ffmpeg.deleteFile(inputName);
    } catch {}
    try {
      await ffmpeg.deleteFile(outputName);
    } catch {}
  }
};

const getMimeType = (ext: string): string => {
  const types: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
    bmp: "image/bmp",
    mp4: "video/mp4",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    aac: "audio/aac",
  };
  return types[ext] || "application/octet-stream";
};
