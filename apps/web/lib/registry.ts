export type FileCategory = "image" | "audio" | "video" | "document" | "data" | "archive";

export interface ConversionRule {
  target: string;
  engine: "canvas" | "jspdf" | "ffmpeg" | "data" | "archive";
  description: string;
  recommended?: boolean;
}

export interface SmartAction {
  id: string;
  label: string;
  icon?: string;
  toFormat: string;
  badge?: string;
  description: string;
  engine: "canvas" | "jspdf" | "ffmpeg" | "data" | "archive";
}

export interface FormatMetadata {
  extension: string;
  name: string;
  category: FileCategory;
  mimeType: string;
  conversions: ConversionRule[];
  smartActions?: SmartAction[];
}

export const CONVERSION_REGISTRY: Record<string, FormatMetadata> = {
  // IMAGES
  jpg: {
    extension: "jpg",
    name: "JPEG Image",
    category: "image",
    mimeType: "image/jpeg",
    conversions: [
      { target: "webp", engine: "canvas", description: "Modern web format with high compression", recommended: true },
      { target: "png", engine: "canvas", description: "Lossless image with transparency support", recommended: true },
      { target: "pdf", engine: "jspdf", description: "Standard printable PDF document", recommended: true },
      { target: "bmp", engine: "canvas", description: "Uncompressed bitmap" },
    ],
    smartActions: [
      { id: "web-opt", label: "Optimize for Web", toFormat: "webp", badge: "Fastest", description: "Convert to high-efficiency WebP", engine: "canvas" },
      { id: "make-pdf", label: "Make PDF", toFormat: "pdf", badge: "Document", description: "Wrap image in high-res PDF", engine: "jspdf" },
      { id: "to-png", label: "Lossless PNG", toFormat: "png", badge: "Quality", description: "Convert to PNG format", engine: "canvas" },
      { id: "compress", label: "Compress Size", toFormat: "jpg", badge: "-60%", description: "Compress JPEG image quality", engine: "canvas" },
    ],
  },
  jpeg: {
    extension: "jpeg",
    name: "JPEG Image",
    category: "image",
    mimeType: "image/jpeg",
    conversions: [
      { target: "webp", engine: "canvas", description: "Modern web format with high compression", recommended: true },
      { target: "png", engine: "canvas", description: "Lossless image with transparency support", recommended: true },
      { target: "pdf", engine: "jspdf", description: "Standard printable PDF document", recommended: true },
      { target: "bmp", engine: "canvas", description: "Uncompressed bitmap" },
    ],
    smartActions: [
      { id: "web-opt", label: "Optimize for Web", toFormat: "webp", badge: "Fastest", description: "Convert to high-efficiency WebP", engine: "canvas" },
      { id: "make-pdf", label: "Make PDF", toFormat: "pdf", badge: "Document", description: "Wrap image in high-res PDF", engine: "jspdf" },
      { id: "to-png", label: "Lossless PNG", toFormat: "png", badge: "Quality", description: "Convert to PNG format", engine: "canvas" },
    ],
  },
  png: {
    extension: "png",
    name: "PNG Image",
    category: "image",
    mimeType: "image/png",
    conversions: [
      { target: "webp", engine: "canvas", description: "High compression modern format", recommended: true },
      { target: "jpg", engine: "canvas", description: "Smaller file size photo format", recommended: true },
      { target: "pdf", engine: "jspdf", description: "Printable PDF document", recommended: true },
      { target: "bmp", engine: "canvas", description: "Uncompressed bitmap" },
    ],
    smartActions: [
      { id: "web-opt", label: "Optimize for Web", toFormat: "webp", badge: "Recommended", description: "Convert to high-efficiency WebP", engine: "canvas" },
      { id: "to-jpg", label: "Convert to JPG", toFormat: "jpg", badge: "Smaller", description: "Reduce size with JPG", engine: "canvas" },
      { id: "make-pdf", label: "Make PDF", toFormat: "pdf", badge: "Doc", description: "Wrap PNG into PDF", engine: "jspdf" },
    ],
  },
  webp: {
    extension: "webp",
    name: "WebP Image",
    category: "image",
    mimeType: "image/webp",
    conversions: [
      { target: "png", engine: "canvas", description: "Lossless compatibility PNG", recommended: true },
      { target: "jpg", engine: "canvas", description: "Standard JPEG", recommended: true },
      { target: "pdf", engine: "jspdf", description: "PDF Document" },
    ],
    smartActions: [
      { id: "to-png", label: "Universal PNG", toFormat: "png", badge: "Compatible", description: "Universal compatibility", engine: "canvas" },
      { id: "to-jpg", label: "Convert to JPG", toFormat: "jpg", badge: "Standard", description: "Standard JPEG photo", engine: "canvas" },
      { id: "make-pdf", label: "Make PDF", toFormat: "pdf", badge: "Doc", description: "Export as PDF", engine: "jspdf" },
    ],
  },
  svg: {
    extension: "svg",
    name: "SVG Vector",
    category: "image",
    mimeType: "image/svg+xml",
    conversions: [
      { target: "png", engine: "canvas", description: "Rasterize vector to high-res PNG", recommended: true },
      { target: "jpg", engine: "canvas", description: "Rasterize vector to JPG" },
      { target: "pdf", engine: "jspdf", description: "Vector PDF document" },
    ],
    smartActions: [
      { id: "to-png", label: "Rasterize to PNG", toFormat: "png", badge: "High-Res", description: "Convert vector into clean PNG", engine: "canvas" },
      { id: "to-pdf", label: "Export PDF", toFormat: "pdf", badge: "Printable", description: "Save vector drawing to PDF", engine: "jspdf" },
    ],
  },
  gif: {
    extension: "gif",
    name: "GIF Animation/Image",
    category: "image",
    mimeType: "image/gif",
    conversions: [
      { target: "png", engine: "canvas", description: "First frame to high-res PNG", recommended: true },
      { target: "jpg", engine: "canvas", description: "Convert to standard JPG" },
      { target: "webp", engine: "canvas", description: "Modern lightweight image" },
    ],
    smartActions: [
      { id: "to-png", label: "Convert to PNG", toFormat: "png", badge: "Clean", description: "Extract static frame as PNG", engine: "canvas" },
      { id: "to-webp", label: "Convert to WebP", toFormat: "webp", badge: "Modern", description: "Convert to WebP", engine: "canvas" },
    ],
  },
  bmp: {
    extension: "bmp",
    name: "Bitmap Image",
    category: "image",
    mimeType: "image/bmp",
    conversions: [
      { target: "png", engine: "canvas", description: "Lossless compressed PNG", recommended: true },
      { target: "webp", engine: "canvas", description: "Modern web image", recommended: true },
      { target: "jpg", engine: "canvas", description: "Compressed photo format" },
      { target: "pdf", engine: "jspdf", description: "PDF Document" },
    ],
  },

  // AUDIO
  mp3: {
    extension: "mp3",
    name: "MP3 Audio",
    category: "audio",
    mimeType: "audio/mpeg",
    conversions: [
      { target: "wav", engine: "ffmpeg", description: "Uncompressed PCM audio", recommended: true },
      { target: "aac", engine: "ffmpeg", description: "Advanced Audio Coding" },
    ],
    smartActions: [
      { id: "to-wav", label: "Uncompressed WAV", toFormat: "wav", badge: "Studio", description: "Convert to raw WAV waveform", engine: "ffmpeg" },
      { id: "to-aac", label: "Convert to AAC", toFormat: "aac", badge: "Modern", description: "Stream-ready AAC audio", engine: "ffmpeg" },
    ],
  },
  wav: {
    extension: "wav",
    name: "WAV Audio",
    category: "audio",
    mimeType: "audio/wav",
    conversions: [
      { target: "mp3", engine: "ffmpeg", description: "Compact MP3 audio", recommended: true },
      { target: "aac", engine: "ffmpeg", description: "Efficient AAC audio" },
    ],
    smartActions: [
      { id: "to-mp3", label: "Compress to MP3", toFormat: "mp3", badge: "Small Size", description: "Encode to portable MP3 file", engine: "ffmpeg" },
    ],
  },
  aac: {
    extension: "aac",
    name: "AAC Audio",
    category: "audio",
    mimeType: "audio/aac",
    conversions: [
      { target: "mp3", engine: "ffmpeg", description: "Standard MP3", recommended: true },
      { target: "wav", engine: "ffmpeg", description: "Uncompressed WAV audio" },
    ],
  },

  // VIDEO
  mp4: {
    extension: "mp4",
    name: "MP4 Video",
    category: "video",
    mimeType: "video/mp4",
    conversions: [
      { target: "webm", engine: "ffmpeg", description: "Open web video format", recommended: true },
      { target: "mov", engine: "ffmpeg", description: "Apple QuickTime format" },
      { target: "mp3", engine: "ffmpeg", description: "Extract audio track", recommended: true },
      { target: "wav", engine: "ffmpeg", description: "Extract uncompressed audio" },
      { target: "gif", engine: "ffmpeg", description: "Animated GIF clip" },
    ],
    smartActions: [
      { id: "extract-audio", label: "Extract Audio (MP3)", toFormat: "mp3", badge: "Audio Only", description: "Rip sound track to high-bitrate MP3", engine: "ffmpeg" },
      { id: "to-webm", label: "Convert to WebM", toFormat: "webm", badge: "Web Ready", description: "Modern VP9/WebM format", engine: "ffmpeg" },
      { id: "to-gif", label: "Make GIF Animation", toFormat: "gif", badge: "Clip", description: "Turn short clip into animated GIF", engine: "ffmpeg" },
    ],
  },
  mov: {
    extension: "mov",
    name: "QuickTime Video",
    category: "video",
    mimeType: "video/quicktime",
    conversions: [
      { target: "mp4", engine: "ffmpeg", description: "Universal H.264 MP4", recommended: true },
      { target: "webm", engine: "ffmpeg", description: "WebM video" },
      { target: "mp3", engine: "ffmpeg", description: "Extract audio" },
    ],
    smartActions: [
      { id: "to-mp4", label: "Convert to MP4", toFormat: "mp4", badge: "Universal", description: "Play anywhere on Windows/Android/Web", engine: "ffmpeg" },
      { id: "extract-audio", label: "Extract Audio", toFormat: "mp3", badge: "MP3", description: "Extract soundtrack to MP3", engine: "ffmpeg" },
    ],
  },
  webm: {
    extension: "webm",
    name: "WebM Video",
    category: "video",
    mimeType: "video/webm",
    conversions: [
      { target: "mp4", engine: "ffmpeg", description: "Universal MP4 video", recommended: true },
      { target: "mp3", engine: "ffmpeg", description: "Extract MP3 sound" },
    ],
  },
  mkv: {
    extension: "mkv",
    name: "Matroska Video",
    category: "video",
    mimeType: "video/x-matroska",
    conversions: [
      { target: "mp4", engine: "ffmpeg", description: "Standard MP4 video", recommended: true },
      { target: "mp3", engine: "ffmpeg", description: "Extract audio track" },
    ],
  },
  avi: {
    extension: "avi",
    name: "AVI Video",
    category: "video",
    mimeType: "video/x-msvideo",
    conversions: [
      { target: "mp4", engine: "ffmpeg", description: "Modern MP4 video", recommended: true },
      { target: "webm", engine: "ffmpeg", description: "Web-ready video" },
      { target: "mp3", engine: "ffmpeg", description: "Extract MP3" },
    ],
  },

  // DATA
  json: {
    extension: "json",
    name: "JSON Data",
    category: "data",
    mimeType: "application/json",
    conversions: [
      { target: "csv", engine: "data", description: "Comma-separated spreadsheet data", recommended: true },
      { target: "xml", engine: "data", description: "Structured XML tags" },
      { target: "txt", engine: "data", description: "Formatted readable text" },
    ],
    smartActions: [
      { id: "to-csv", label: "Convert to CSV", toFormat: "csv", badge: "Excel Ready", description: "Flatten object array to spreadsheet CSV", engine: "data" },
      { id: "to-xml", label: "Convert to XML", toFormat: "xml", badge: "Markup", description: "Convert JSON hierarchy to XML tags", engine: "data" },
    ],
  },
  csv: {
    extension: "csv",
    name: "CSV Spreadsheet",
    category: "data",
    mimeType: "text/csv",
    conversions: [
      { target: "json", engine: "data", description: "Structured JSON array of objects", recommended: true },
      { target: "xml", engine: "data", description: "Structured XML records" },
      { target: "html", engine: "data", description: "HTML table preview" },
      { target: "pdf", engine: "jspdf", description: "Printable PDF table document" },
    ],
    smartActions: [
      { id: "to-json", label: "Convert to JSON", toFormat: "json", badge: "API Ready", description: "Parse rows into JSON data objects", engine: "data" },
      { id: "to-html", label: "Generate HTML Table", toFormat: "html", badge: "Web", description: "Create styled HTML table", engine: "data" },
      { id: "to-pdf", label: "Export PDF Table", toFormat: "pdf", badge: "Document", description: "Render rows into PDF document", engine: "jspdf" },
    ],
  },
  xml: {
    extension: "xml",
    name: "XML Document",
    category: "data",
    mimeType: "application/xml",
    conversions: [
      { target: "json", engine: "data", description: "Parse XML to clean JSON object", recommended: true },
      { target: "csv", engine: "data", description: "Flatten XML records to CSV" },
    ],
    smartActions: [
      { id: "to-json", label: "Convert to JSON", toFormat: "json", badge: "Modern", description: "Convert XML structure into JSON", engine: "data" },
    ],
  },

  // DOCUMENTS
  txt: {
    extension: "txt",
    name: "Plain Text",
    category: "document",
    mimeType: "text/plain",
    conversions: [
      { target: "pdf", engine: "jspdf", description: "Formatted PDF document", recommended: true },
      { target: "html", engine: "data", description: "HTML webpage with text" },
      { target: "json", engine: "data", description: "Wrap text in JSON string" },
    ],
    smartActions: [
      { id: "to-pdf", label: "Export as PDF", toFormat: "pdf", badge: "Printable", description: "Convert text file into clean PDF", engine: "jspdf" },
    ],
  },
  html: {
    extension: "html",
    name: "HTML Page",
    category: "document",
    mimeType: "text/html",
    conversions: [
      { target: "pdf", engine: "jspdf", description: "Print-ready PDF document", recommended: true },
      { target: "txt", engine: "data", description: "Extract plain text content" },
    ],
  },
};

export const SUPPORTED_EXTENSIONS = Object.keys(CONVERSION_REGISTRY);

export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

export function getFormatMetadata(ext: string): FormatMetadata | undefined {
  return CONVERSION_REGISTRY[ext.toLowerCase()];
}

export function getAvailableTargets(ext: string): string[] {
  const meta = getFormatMetadata(ext);
  if (!meta) return [];
  return meta.conversions.map((c) => c.target);
}

export function getConversionEngine(fromExt: string, toExt: string): ConversionRule["engine"] {
  const meta = getFormatMetadata(fromExt);
  if (!meta) return "canvas";
  const rule = meta.conversions.find((c) => c.target === toExt);
  return rule ? rule.engine : "canvas";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
