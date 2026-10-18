import { Router, Request, Response } from "express";

export const registryRouter = Router();

// Full supported format registry metadata
const REGISTRY_DATA: Record<string, any> = {
  jpg: { name: "JPEG Image", category: "image", targets: ["webp", "png", "pdf", "avif", "bmp", "gif", "ico"] },
  jpeg: { name: "JPEG Image", category: "image", targets: ["webp", "png", "pdf", "avif", "bmp", "gif", "ico"] },
  png: { name: "PNG Image", category: "image", targets: ["webp", "jpg", "pdf", "avif", "bmp", "ico"] },
  webp: { name: "WebP Image", category: "image", targets: ["png", "jpg", "pdf", "avif", "gif"] },
  avif: { name: "AVIF Image", category: "image", targets: ["png", "jpg", "webp", "pdf"] },
  svg: { name: "SVG Vector", category: "image", targets: ["png", "webp", "jpg", "pdf"] },
  gif: { name: "GIF Image", category: "image", targets: ["png", "webp", "jpg", "mp4"] },
  bmp: { name: "Bitmap Image", category: "image", targets: ["png", "jpg", "webp", "pdf"] },
  ico: { name: "Icon Format", category: "image", targets: ["png", "webp", "jpg"] },
  tiff: { name: "TIFF Image", category: "image", targets: ["png", "jpg", "webp", "pdf"] },

  // Audio
  mp3: { name: "MP3 Audio", category: "audio", targets: ["wav", "aac", "flac", "ogg", "m4a", "opus"] },
  wav: { name: "WAV Audio", category: "audio", targets: ["mp3", "aac", "flac", "ogg", "opus"] },
  aac: { name: "AAC Audio", category: "audio", targets: ["mp3", "wav", "flac", "ogg", "m4a"] },
  flac: { name: "FLAC Audio", category: "audio", targets: ["mp3", "wav", "aac", "ogg"] },
  ogg: { name: "OGG Audio", category: "audio", targets: ["mp3", "wav", "aac", "opus"] },
  m4a: { name: "M4A Audio", category: "audio", targets: ["mp3", "wav", "aac", "flac"] },
  opus: { name: "Opus Audio", category: "audio", targets: ["mp3", "wav", "ogg", "aac"] },
  wma: { name: "WMA Audio", category: "audio", targets: ["mp3", "wav", "aac", "flac"] },

  // Video
  mp4: { name: "MP4 Video", category: "video", targets: ["webm", "mkv", "mov", "gif", "mp3", "avi"] },
  webm: { name: "WebM Video", category: "video", targets: ["mp4", "mkv", "mov", "gif", "mp3"] },
  mkv: { name: "MKV Video", category: "video", targets: ["mp4", "webm", "mov", "mp3"] },
  mov: { name: "QuickTime Video", category: "video", targets: ["mp4", "webm", "mkv", "gif", "mp3"] },
  avi: { name: "AVI Video", category: "video", targets: ["mp4", "webm", "mkv", "mp3"] },
  wmv: { name: "WMV Video", category: "video", targets: ["mp4", "webm", "mp3"] },
  flv: { name: "FLV Video", category: "video", targets: ["mp4", "webm", "mp3"] },

  // Documents
  pdf: { name: "PDF Document", category: "document", targets: ["png", "jpg", "webp", "txt"] },
  docx: { name: "Word Document", category: "document", targets: ["pdf", "txt", "html"] },
  pptx: { name: "PowerPoint Presentation", category: "document", targets: ["pdf", "docx", "txt", "html"] },
  txt: { name: "Plain Text", category: "document", targets: ["pdf", "html"] },
  html: { name: "HTML Document", category: "document", targets: ["pdf", "txt"] },
  md: { name: "Markdown Document", category: "document", targets: ["html", "pdf", "txt"] },
  epub: { name: "EPUB E-Book", category: "document", targets: ["pdf", "txt", "html"] },

  // Data & Code
  json: { name: "JSON Data", category: "data", targets: ["csv", "tsv", "yaml", "xml"] },
  csv: { name: "CSV Spreadsheet", category: "data", targets: ["json", "tsv", "yaml"] },
  tsv: { name: "TSV Spreadsheet", category: "data", targets: ["csv", "json"] },
  xml: { name: "XML Markup", category: "data", targets: ["json", "yaml"] },
  yaml: { name: "YAML Document", category: "data", targets: ["json", "csv", "xml"] },

  // Subtitles
  srt: { name: "SubRip Subtitle", category: "subtitle", targets: ["vtt", "ass"] },
  vtt: { name: "WebVTT Subtitle", category: "subtitle", targets: ["srt", "ass"] },
  ass: { name: "Advanced SubStation Alpha", category: "subtitle", targets: ["srt", "vtt"] },

  // Fonts
  ttf: { name: "TrueType Font", category: "font", targets: ["woff", "otf"] },
  otf: { name: "OpenType Font", category: "font", targets: ["woff", "ttf"] },
  woff: { name: "Web Open Font", category: "font", targets: ["ttf", "otf"] },
};

registryRouter.get("/", (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: Object.keys(REGISTRY_DATA).length,
    registry: REGISTRY_DATA,
  });
});

registryRouter.get("/:ext", (req: Request, res: Response) => {
  const ext = req.params.ext.toLowerCase();
  const meta = REGISTRY_DATA[ext];
  if (!meta) {
    return res.status(404).json({ success: false, error: `Format ${ext} not found in registry` });
  }
  res.json({ success: true, format: meta });
});
