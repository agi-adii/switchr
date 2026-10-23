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

  // Write the file to ffmpeg's virtual file system
  await ffmpeg.writeFile(inputName, await fetchFile(file));

  // Listen to progress and logs
  ffmpeg.on("progress", ({ progress }) => {
    onProgress(progress);
  });
  
  ffmpeg.on("log", ({ message }) => {
    console.log("[FFmpeg Log]:", message);
  });

  // Execute the FFmpeg command
  let args = ["-i", inputName];

  if (toFormat === "mp4") {
    args.push("-c:v", "libx264", "-preset", "fast", "-crf", "22", "-c:a", "aac");
  }

  args.push(outputName);

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
