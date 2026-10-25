import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

let ffmpeg: FFmpeg | null = null;

export const loadFfmpeg = async (): Promise<FFmpeg> => {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();

  try {
    // Attempt loading from local /ffmpeg/ assets first if present
    const test = await fetch("/ffmpeg/ffmpeg-core.js", { method: "HEAD" });
    if (test.ok) {
      await ffmpeg.load({
        coreURL: await toBlobURL("/ffmpeg/ffmpeg-core.js", "text/javascript"),
        wasmURL: await toBlobURL("/ffmpeg/ffmpeg-core.wasm", "application/wasm"),
      });
      return ffmpeg;
    }
  } catch (err) {
    console.warn("Local FFmpeg core not found, falling back to CDN:", err);
  }

  // Fallback to CDN
  const cdnURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${cdnURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${cdnURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  return ffmpeg;
};

export interface FFmpegConvertOptions {
  preset?: string; // "original" | "high" | "balanced" | "small" | "mobile"
  bitrate?: string; // e.g. "320k", "256k", "192k"
  sampleRate?: string; // e.g. "44100", "48000"
}

export const convertFile = async (
  ffmpeg: FFmpeg,
  file: File,
  toFormat: string,
  onProgress: (progress: number) => void,
  options?: FFmpegConvertOptions
): Promise<string> => {
  const { name } = file;
  const ext = name.split(".").pop()?.toLowerCase() || "";
  
  // Use safe names for the virtual file system
  const inputName = `input_${Math.random().toString(36).substring(7)}.${ext}`;
  const outputName = `output_${Math.random().toString(36).substring(7)}.${toFormat}`;

  // Write the file to ffmpeg's virtual file system
  await ffmpeg.writeFile(inputName, await fetchFile(file));

  // Listen to progress and logs
  ffmpeg.on("progress", ({ progress }) => {
    onProgress(progress);
  });
  
  ffmpeg.on("log", ({ message }) => {
    console.log("[FFmpeg Log]:", message);
  });

  // Build format-specific FFmpeg arguments ensuring maximum original quality
  const args = buildFFmpegArgs(inputName, outputName, ext, toFormat, options);

  const exitCode = await ffmpeg.exec(args);
  
  if (exitCode !== 0) {
    throw new Error(`FFmpeg exited with code ${exitCode}. Check console for details. (Unsupported format?)`);
  }

  try {
    // Read the resulting file
    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data as any], { type: getMimeType(toFormat) });
    
    // Clean up memory
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);

    return URL.createObjectURL(blob);
  } catch (e) {
    console.error("Failed to read output file", e);
    throw new Error("Conversion failed to produce output file.");
  }
};

/**
 * Build optimized FFmpeg arguments preserving maximum original quality without loss.
 */
function buildFFmpegArgs(
  inputName: string,
  outputName: string,
  fromExt: string,
  toFormat: string,
  options?: FFmpegConvertOptions
): string[] {
  const args = ["-i", inputName];

  // Resolve target quality parameters (default to Maximum/Original Quality: 320k audio, CRF 16 video)
  const audioBitrate = options?.bitrate || "320k";
  let videoCrf = "16"; // Visually lossless, indistinguishable from original source

  if (options?.preset === "high") {
    videoCrf = "18";
  } else if (options?.preset === "balanced") {
    videoCrf = "22";
  } else if (options?.preset === "small") {
    videoCrf = "28";
  } else if (options?.preset === "mobile") {
    videoCrf = "26";
  }

  // ─── Video output formats ──────────────────────────────
  if (toFormat === "mp4") {
    args.push("-c:v", "libx264", "-preset", "fast", "-crf", videoCrf, "-c:a", "aac", "-b:a", audioBitrate);
  } else if (toFormat === "webm") {
    args.push("-c:v", "libvpx-vp9", "-crf", videoCrf === "16" ? "18" : videoCrf, "-b:v", "0", "-c:a", "libopus", "-b:a", "256k");
  } else if (toFormat === "avi") {
    args.push("-c:v", "mpeg4", "-q:v", "2", "-c:a", "mp3", "-b:a", audioBitrate);
  } else if (toFormat === "mkv") {
    args.push("-c:v", "libx264", "-preset", "fast", "-crf", videoCrf, "-c:a", "aac", "-b:a", audioBitrate);
  } else if (toFormat === "mov") {
    args.push("-c:v", "libx264", "-preset", "fast", "-crf", videoCrf, "-c:a", "aac", "-b:a", audioBitrate);
  } else if (toFormat === "flv") {
    args.push("-c:v", "flv1", "-c:a", "mp3", "-b:a", audioBitrate);
  } else if (toFormat === "3gp") {
    args.push("-c:v", "h263", "-s", "352x288", "-c:a", "aac", "-b:a", "128k", "-ar", "16000", "-ac", "1");
  } else if (toFormat === "ts") {
    args.push("-c:v", "libx264", "-crf", videoCrf, "-c:a", "aac", "-b:a", audioBitrate, "-f", "mpegts");
  }

  // ─── Audio extraction from video ───────────────────────
  else if (isVideoFormat(fromExt) && isAudioFormat(toFormat)) {
    args.push("-vn"); // No video

    if (toFormat === "mp3") {
      args.push("-c:a", "libmp3lame", "-b:a", audioBitrate);
    } else if (toFormat === "wav") {
      args.push("-c:a", "pcm_s16le");
    } else if (toFormat === "aac") {
      args.push("-c:a", "aac", "-b:a", audioBitrate);
    } else if (toFormat === "ogg") {
      args.push("-c:a", "libvorbis", "-q:a", "8");
    } else if (toFormat === "flac") {
      args.push("-c:a", "flac");
    } else if (toFormat === "m4a") {
      args.push("-c:a", "aac", "-b:a", audioBitrate);
    } else if (toFormat === "opus") {
      args.push("-c:a", "libopus", "-b:a", "256k");
    }
  }

  // ─── Video to GIF ─────────────────────────────────────
  else if (toFormat === "gif") {
    args.push(
      "-vf", "fps=15,scale=720:-1:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=full[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5",
      "-t", "15"
    );
  }

  // ─── Audio output formats ─────────────────────────────
  else if (toFormat === "mp3") {
    args.push("-c:a", "libmp3lame", "-b:a", audioBitrate);
  } else if (toFormat === "wav") {
    args.push("-c:a", "pcm_s16le");
  } else if (toFormat === "aac") {
    args.push("-c:a", "aac", "-b:a", audioBitrate);
  } else if (toFormat === "ogg") {
    args.push("-c:a", "libvorbis", "-q:a", "8");
  } else if (toFormat === "flac") {
    args.push("-c:a", "flac");
  } else if (toFormat === "m4a") {
    args.push("-c:a", "aac", "-b:a", audioBitrate);
  } else if (toFormat === "opus") {
    args.push("-c:a", "libopus", "-b:a", "256k");
  } else if (toFormat === "aiff") {
    args.push("-c:a", "pcm_s16be");
  }

  // ─── Optional Sample Rate ─────────────────────────────
  if (options?.sampleRate) {
    args.push("-ar", options.sampleRate);
  }

  // ─── Image output via FFmpeg ──────────────────────────
  else if (toFormat === "png" || toFormat === "jpg" || toFormat === "jpeg" || toFormat === "webp" || toFormat === "bmp") {
    if (isImageFormat(fromExt)) {
      if (toFormat === "jpg" || toFormat === "jpeg") {
        args.push("-q:v", "1");
      } else if (toFormat === "webp") {
        args.push("-lossless", "1");
      }
    }
  }

  args.push(outputName);
  return args;
}

function isVideoFormat(ext: string): boolean {
  return [
    "mp4", "mov", "webm", "mkv", "avi", "wmv", "flv",
    "3gp", "mpeg", "mpg", "m4v", "ts", "mts", "m2ts",
    "vob", "ogv", "mxf", "asf",
  ].includes(ext);
}

function isAudioFormat(ext: string): boolean {
  return [
    "mp3", "wav", "aac", "m4a", "flac", "ogg", "opus",
    "wma", "aiff", "amr", "alac", "caf", "au", "ac3",
  ].includes(ext);
}

function isImageFormat(ext: string): boolean {
  return [
    "tiff", "tif", "tga", "dds", "exr", "hdr",
    "pnm", "pbm", "pgm", "ppm", "jp2", "jxl",
  ].includes(ext);
}

const getMimeType = (ext: string): string => {
  const types: Record<string, string> = {
    // Images
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
    bmp: "image/bmp",
    avif: "image/avif",
    ico: "image/x-icon",
    svg: "image/svg+xml",
    tiff: "image/tiff",
    tif: "image/tiff",

    // Video
    mp4: "video/mp4",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    webm: "video/webm",
    mkv: "video/x-matroska",
    wmv: "video/x-ms-wmv",
    flv: "video/x-flv",
    "3gp": "video/3gpp",
    mpeg: "video/mpeg",
    mpg: "video/mpeg",
    m4v: "video/x-m4v",
    ts: "video/mp2t",
    mts: "video/mp2t",
    m2ts: "video/mp2t",
    vob: "video/mpeg",
    ogv: "video/ogg",

    // Audio
    mp3: "audio/mpeg",
    wav: "audio/wav",
    aac: "audio/aac",
    m4a: "audio/mp4",
    flac: "audio/flac",
    ogg: "audio/ogg",
    opus: "audio/opus",
    wma: "audio/x-ms-wma",
    aiff: "audio/aiff",
    amr: "audio/amr",
    ac3: "audio/ac3",
    au: "audio/basic",
    caf: "audio/x-caf",
  };
  return types[ext] || "application/octet-stream";
};
