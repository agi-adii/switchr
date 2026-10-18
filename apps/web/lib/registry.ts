export type FileCategory = "image" | "audio" | "video" | "document" | "data" | "archive" | "font" | "subtitle" | "developer";

export interface ConversionRule {
  target: string;
  engine: "canvas" | "jspdf" | "ffmpeg" | "data" | "archive" | "text" | "subtitle" | "font";
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
  engine: "canvas" | "jspdf" | "ffmpeg" | "data" | "archive" | "text" | "subtitle" | "font";
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
  // ════════════════════════════════════════════════════════════
  // IMAGES
  // ════════════════════════════════════════════════════════════
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
      { target: "avif", engine: "canvas", description: "Next-gen AVIF image (browser support required)" },
      { target: "gif", engine: "canvas", description: "GIF image (first frame)" },
      { target: "ico", engine: "canvas", description: "Icon format for websites and apps" },
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
      { target: "avif", engine: "canvas", description: "Next-gen AVIF image" },
      { target: "gif", engine: "canvas", description: "GIF image" },
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
      { target: "avif", engine: "canvas", description: "Next-gen AVIF image" },
      { target: "gif", engine: "canvas", description: "GIF image" },
      { target: "ico", engine: "canvas", description: "Icon format" },
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
      { target: "bmp", engine: "canvas", description: "Uncompressed bitmap" },
      { target: "gif", engine: "canvas", description: "GIF image" },
      { target: "avif", engine: "canvas", description: "AVIF image" },
    ],
    smartActions: [
      { id: "to-png", label: "Universal PNG", toFormat: "png", badge: "Compatible", description: "Universal compatibility", engine: "canvas" },
      { id: "to-jpg", label: "Convert to JPG", toFormat: "jpg", badge: "Standard", description: "Standard JPEG photo", engine: "canvas" },
      { id: "make-pdf", label: "Make PDF", toFormat: "pdf", badge: "Doc", description: "Export as PDF", engine: "jspdf" },
    ],
  },
  avif: {
    extension: "avif",
    name: "AVIF Image",
    category: "image",
    mimeType: "image/avif",
    conversions: [
      { target: "png", engine: "canvas", description: "Lossless PNG for compatibility", recommended: true },
      { target: "jpg", engine: "canvas", description: "Standard JPEG photo", recommended: true },
      { target: "webp", engine: "canvas", description: "Modern WebP format" },
      { target: "pdf", engine: "jspdf", description: "PDF document" },
    ],
    smartActions: [
      { id: "to-png", label: "Convert to PNG", toFormat: "png", badge: "Compatible", description: "Universal PNG compatibility", engine: "canvas" },
      { id: "to-jpg", label: "Convert to JPG", toFormat: "jpg", badge: "Standard", description: "Standard JPEG photo", engine: "canvas" },
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
      { target: "webp", engine: "canvas", description: "Rasterize to WebP" },
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
      { target: "pdf", engine: "jspdf", description: "PDF document" },
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
  ico: {
    extension: "ico",
    name: "Icon Image",
    category: "image",
    mimeType: "image/x-icon",
    conversions: [
      { target: "png", engine: "canvas", description: "Convert icon to PNG", recommended: true },
      { target: "jpg", engine: "canvas", description: "Convert icon to JPG" },
    ],
  },
  tiff: {
    extension: "tiff",
    name: "TIFF Image",
    category: "image",
    mimeType: "image/tiff",
    conversions: [
      { target: "png", engine: "ffmpeg", description: "Convert TIFF to PNG", recommended: true },
      { target: "jpg", engine: "ffmpeg", description: "Convert TIFF to JPG" },
      { target: "webp", engine: "ffmpeg", description: "Convert TIFF to WebP" },
      { target: "pdf", engine: "jspdf", description: "Convert TIFF to PDF" },
    ],
  },
  tif: {
    extension: "tif",
    name: "TIFF Image",
    category: "image",
    mimeType: "image/tiff",
    conversions: [
      { target: "png", engine: "ffmpeg", description: "Convert TIFF to PNG", recommended: true },
      { target: "jpg", engine: "ffmpeg", description: "Convert TIFF to JPG" },
    ],
  },
  heic: {
    extension: "heic",
    name: "Apple High Efficiency Image (HEIC)",
    category: "image",
    mimeType: "image/heic",
    conversions: [
      { target: "pdf", engine: "jspdf", description: "Convert Apple HEIC directly to PDF document", recommended: true },
      { target: "jpg", engine: "canvas", description: "Universal standard JPEG image", recommended: true },
      { target: "png", engine: "canvas", description: "Lossless transparent PNG", recommended: true },
      { target: "webp", engine: "canvas", description: "Ultra-compact modern WebP" },
    ],
    smartActions: [
      { id: "heic-pdf", label: "Convert to PDF", toFormat: "pdf", badge: "Direct", description: "Turn Apple HEIC photo into printable PDF document", engine: "jspdf" },
      { id: "to-jpg", label: "Convert to JPG", toFormat: "jpg", badge: "Universal", description: "Compatible with Windows and Android devices", engine: "canvas" },
      { id: "to-png", label: "Lossless PNG", toFormat: "png", badge: "Quality", description: "Lossless uncompressed image", engine: "canvas" },
    ],
  },
  heif: {
    extension: "heif",
    name: "High Efficiency Image File (HEIF)",
    category: "image",
    mimeType: "image/heif",
    conversions: [
      { target: "pdf", engine: "jspdf", description: "Convert HEIF photo directly to PDF document", recommended: true },
      { target: "jpg", engine: "canvas", description: "Universal standard JPEG image", recommended: true },
      { target: "png", engine: "canvas", description: "Lossless transparent PNG" },
      { target: "webp", engine: "canvas", description: "Ultra-compact modern WebP" },
    ],
    smartActions: [
      { id: "heif-pdf", label: "Convert to PDF", toFormat: "pdf", badge: "Direct", description: "Turn HEIF photo into printable PDF document", engine: "jspdf" },
      { id: "to-jpg", label: "Convert to JPG", toFormat: "jpg", badge: "Universal", description: "Compatible with all viewers", engine: "canvas" },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // AUDIO
  // ════════════════════════════════════════════════════════════
  mp3: {
    extension: "mp3",
    name: "MP3 Audio",
    category: "audio",
    mimeType: "audio/mpeg",
    conversions: [
      { target: "wav", engine: "ffmpeg", description: "Uncompressed PCM audio", recommended: true },
      { target: "aac", engine: "ffmpeg", description: "Advanced Audio Coding" },
      { target: "ogg", engine: "ffmpeg", description: "Ogg Vorbis audio" },
      { target: "flac", engine: "ffmpeg", description: "Lossless FLAC audio" },
      { target: "m4a", engine: "ffmpeg", description: "AAC in M4A container" },
      { target: "opus", engine: "ffmpeg", description: "High-quality Opus audio" },
    ],
    smartActions: [
      { id: "to-wav", label: "Uncompressed WAV", toFormat: "wav", badge: "Studio", description: "Convert to raw WAV waveform", engine: "ffmpeg" },
      { id: "to-aac", label: "Convert to AAC", toFormat: "aac", badge: "Modern", description: "Stream-ready AAC audio", engine: "ffmpeg" },
      { id: "to-flac", label: "Lossless FLAC", toFormat: "flac", badge: "Hi-Fi", description: "High-fidelity lossless audio", engine: "ffmpeg" },
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
      { target: "ogg", engine: "ffmpeg", description: "Ogg Vorbis audio" },
      { target: "flac", engine: "ffmpeg", description: "Lossless FLAC audio", recommended: true },
      { target: "m4a", engine: "ffmpeg", description: "M4A AAC audio" },
      { target: "opus", engine: "ffmpeg", description: "Opus audio" },
    ],
    smartActions: [
      { id: "to-mp3", label: "Compress to MP3", toFormat: "mp3", badge: "Small Size", description: "Encode to portable MP3 file", engine: "ffmpeg" },
      { id: "to-flac", label: "Lossless FLAC", toFormat: "flac", badge: "Hi-Fi", description: "Compress without quality loss", engine: "ffmpeg" },
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
      { target: "ogg", engine: "ffmpeg", description: "Ogg Vorbis" },
      { target: "flac", engine: "ffmpeg", description: "Lossless FLAC" },
    ],
  },
  m4a: {
    extension: "m4a",
    name: "M4A Audio (AAC)",
    category: "audio",
    mimeType: "audio/mp4",
    conversions: [
      { target: "mp3", engine: "ffmpeg", description: "Universal MP3", recommended: true },
      { target: "wav", engine: "ffmpeg", description: "Uncompressed WAV", recommended: true },
      { target: "aac", engine: "ffmpeg", description: "Raw AAC stream" },
      { target: "ogg", engine: "ffmpeg", description: "Ogg Vorbis audio" },
      { target: "flac", engine: "ffmpeg", description: "Lossless FLAC" },
    ],
    smartActions: [
      { id: "to-mp3", label: "Convert to MP3", toFormat: "mp3", badge: "Universal", description: "Play anywhere MP3 format", engine: "ffmpeg" },
    ],
  },
  flac: {
    extension: "flac",
    name: "FLAC Lossless Audio",
    category: "audio",
    mimeType: "audio/flac",
    conversions: [
      { target: "mp3", engine: "ffmpeg", description: "Portable MP3 format", recommended: true },
      { target: "wav", engine: "ffmpeg", description: "Uncompressed WAV", recommended: true },
      { target: "aac", engine: "ffmpeg", description: "AAC audio" },
      { target: "ogg", engine: "ffmpeg", description: "Ogg Vorbis" },
      { target: "m4a", engine: "ffmpeg", description: "M4A AAC container" },
    ],
    smartActions: [
      { id: "to-mp3", label: "Convert to MP3", toFormat: "mp3", badge: "Portable", description: "Lossy but smaller MP3", engine: "ffmpeg" },
      { id: "to-wav", label: "Convert to WAV", toFormat: "wav", badge: "PCM", description: "Uncompressed PCM audio", engine: "ffmpeg" },
    ],
  },
  ogg: {
    extension: "ogg",
    name: "OGG Vorbis Audio",
    category: "audio",
    mimeType: "audio/ogg",
    conversions: [
      { target: "mp3", engine: "ffmpeg", description: "Universal MP3 format", recommended: true },
      { target: "wav", engine: "ffmpeg", description: "Uncompressed WAV" },
      { target: "aac", engine: "ffmpeg", description: "AAC audio" },
      { target: "flac", engine: "ffmpeg", description: "Lossless FLAC" },
    ],
  },
  opus: {
    extension: "opus",
    name: "Opus Audio",
    category: "audio",
    mimeType: "audio/opus",
    conversions: [
      { target: "mp3", engine: "ffmpeg", description: "Universal MP3", recommended: true },
      { target: "wav", engine: "ffmpeg", description: "Uncompressed WAV" },
      { target: "ogg", engine: "ffmpeg", description: "Ogg container" },
      { target: "aac", engine: "ffmpeg", description: "AAC audio" },
    ],
  },
  wma: {
    extension: "wma",
    name: "Windows Media Audio",
    category: "audio",
    mimeType: "audio/x-ms-wma",
    conversions: [
      { target: "mp3", engine: "ffmpeg", description: "Universal MP3", recommended: true },
      { target: "wav", engine: "ffmpeg", description: "Uncompressed WAV" },
      { target: "aac", engine: "ffmpeg", description: "AAC audio" },
    ],
  },
  aiff: {
    extension: "aiff",
    name: "AIFF Audio",
    category: "audio",
    mimeType: "audio/aiff",
    conversions: [
      { target: "mp3", engine: "ffmpeg", description: "Compact MP3", recommended: true },
      { target: "wav", engine: "ffmpeg", description: "PCM WAV audio", recommended: true },
      { target: "flac", engine: "ffmpeg", description: "Lossless FLAC" },
    ],
  },
  amr: {
    extension: "amr",
    name: "AMR Audio",
    category: "audio",
    mimeType: "audio/amr",
    conversions: [
      { target: "mp3", engine: "ffmpeg", description: "MP3 audio", recommended: true },
      { target: "wav", engine: "ffmpeg", description: "WAV audio" },
    ],
  },
  ac3: {
    extension: "ac3",
    name: "Dolby AC3 Audio",
    category: "audio",
    mimeType: "audio/ac3",
    conversions: [
      { target: "mp3", engine: "ffmpeg", description: "MP3 audio", recommended: true },
      { target: "wav", engine: "ffmpeg", description: "WAV audio" },
      { target: "aac", engine: "ffmpeg", description: "AAC audio" },
    ],
  },
  au: {
    extension: "au",
    name: "Sun AU Audio",
    category: "audio",
    mimeType: "audio/basic",
    conversions: [
      { target: "mp3", engine: "ffmpeg", description: "MP3 audio", recommended: true },
      { target: "wav", engine: "ffmpeg", description: "WAV audio" },
    ],
  },
  caf: {
    extension: "caf",
    name: "Core Audio Format",
    category: "audio",
    mimeType: "audio/x-caf",
    conversions: [
      { target: "mp3", engine: "ffmpeg", description: "MP3 audio", recommended: true },
      { target: "wav", engine: "ffmpeg", description: "WAV audio" },
      { target: "aac", engine: "ffmpeg", description: "AAC audio" },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // VIDEO
  // ════════════════════════════════════════════════════════════
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
      { target: "avi", engine: "ffmpeg", description: "AVI video" },
      { target: "mkv", engine: "ffmpeg", description: "Matroska video container" },
      { target: "flv", engine: "ffmpeg", description: "Flash video" },
      { target: "3gp", engine: "ffmpeg", description: "Mobile 3GP video" },
      { target: "ts", engine: "ffmpeg", description: "MPEG Transport Stream" },
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
      { target: "gif", engine: "ffmpeg", description: "Animated GIF" },
      { target: "avi", engine: "ffmpeg", description: "AVI video" },
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
      { target: "gif", engine: "ffmpeg", description: "Animated GIF" },
      { target: "mov", engine: "ffmpeg", description: "QuickTime MOV" },
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
      { target: "webm", engine: "ffmpeg", description: "WebM video" },
      { target: "avi", engine: "ffmpeg", description: "AVI video" },
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
      { target: "mov", engine: "ffmpeg", description: "QuickTime video" },
    ],
  },
  wmv: {
    extension: "wmv",
    name: "Windows Media Video",
    category: "video",
    mimeType: "video/x-ms-wmv",
    conversions: [
      { target: "mp4", engine: "ffmpeg", description: "Universal MP4", recommended: true },
      { target: "webm", engine: "ffmpeg", description: "WebM video" },
      { target: "mp3", engine: "ffmpeg", description: "Extract audio" },
    ],
  },
  flv: {
    extension: "flv",
    name: "Flash Video",
    category: "video",
    mimeType: "video/x-flv",
    conversions: [
      { target: "mp4", engine: "ffmpeg", description: "Modern MP4", recommended: true },
      { target: "webm", engine: "ffmpeg", description: "WebM video" },
      { target: "mp3", engine: "ffmpeg", description: "Extract audio" },
    ],
  },
  "3gp": {
    extension: "3gp",
    name: "3GP Mobile Video",
    category: "video",
    mimeType: "video/3gpp",
    conversions: [
      { target: "mp4", engine: "ffmpeg", description: "Standard MP4", recommended: true },
      { target: "mp3", engine: "ffmpeg", description: "Extract audio" },
    ],
  },
  mpeg: {
    extension: "mpeg",
    name: "MPEG Video",
    category: "video",
    mimeType: "video/mpeg",
    conversions: [
      { target: "mp4", engine: "ffmpeg", description: "Modern MP4 video", recommended: true },
      { target: "webm", engine: "ffmpeg", description: "WebM video" },
      { target: "mp3", engine: "ffmpeg", description: "Extract audio" },
    ],
  },
  mpg: {
    extension: "mpg",
    name: "MPEG Video",
    category: "video",
    mimeType: "video/mpeg",
    conversions: [
      { target: "mp4", engine: "ffmpeg", description: "Modern MP4", recommended: true },
      { target: "webm", engine: "ffmpeg", description: "WebM video" },
    ],
  },
  m4v: {
    extension: "m4v",
    name: "M4V Video",
    category: "video",
    mimeType: "video/x-m4v",
    conversions: [
      { target: "mp4", engine: "ffmpeg", description: "Standard MP4", recommended: true },
      { target: "webm", engine: "ffmpeg", description: "WebM video" },
      { target: "mp3", engine: "ffmpeg", description: "Extract audio" },
    ],
  },
  ts: {
    extension: "ts",
    name: "MPEG Transport Stream",
    category: "video",
    mimeType: "video/mp2t",
    conversions: [
      { target: "mp4", engine: "ffmpeg", description: "MP4 video", recommended: true },
      { target: "mkv", engine: "ffmpeg", description: "Matroska video" },
    ],
  },
  mts: {
    extension: "mts",
    name: "AVCHD Video",
    category: "video",
    mimeType: "video/mp2t",
    conversions: [
      { target: "mp4", engine: "ffmpeg", description: "MP4 video", recommended: true },
    ],
  },
  m2ts: {
    extension: "m2ts",
    name: "Blu-ray MPEG2-TS",
    category: "video",
    mimeType: "video/mp2t",
    conversions: [
      { target: "mp4", engine: "ffmpeg", description: "MP4 video", recommended: true },
      { target: "mkv", engine: "ffmpeg", description: "MKV video" },
    ],
  },
  vob: {
    extension: "vob",
    name: "DVD Video Object",
    category: "video",
    mimeType: "video/mpeg",
    conversions: [
      { target: "mp4", engine: "ffmpeg", description: "MP4 video", recommended: true },
    ],
  },
  ogv: {
    extension: "ogv",
    name: "OGV Video",
    category: "video",
    mimeType: "video/ogg",
    conversions: [
      { target: "mp4", engine: "ffmpeg", description: "MP4 video", recommended: true },
      { target: "webm", engine: "ffmpeg", description: "WebM video" },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // DATA & DEVELOPER FORMATS
  // ════════════════════════════════════════════════════════════
  json: {
    extension: "json",
    name: "JSON Data",
    category: "data",
    mimeType: "application/json",
    conversions: [
      { target: "csv", engine: "data", description: "Comma-separated spreadsheet data", recommended: true },
      { target: "xml", engine: "data", description: "Structured XML tags" },
      { target: "yaml", engine: "data", description: "Human-readable YAML", recommended: true },
      { target: "tsv", engine: "data", description: "Tab-separated values" },
      { target: "txt", engine: "data", description: "Formatted readable text" },
    ],
    smartActions: [
      { id: "to-csv", label: "Convert to CSV", toFormat: "csv", badge: "Excel Ready", description: "Flatten object array to spreadsheet CSV", engine: "data" },
      { id: "to-yaml", label: "Convert to YAML", toFormat: "yaml", badge: "Readable", description: "Human-readable YAML format", engine: "data" },
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
      { target: "yaml", engine: "data", description: "YAML data format" },
      { target: "tsv", engine: "data", description: "Tab-separated values" },
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
      { target: "yaml", engine: "data", description: "YAML format" },
    ],
    smartActions: [
      { id: "to-json", label: "Convert to JSON", toFormat: "json", badge: "Modern", description: "Convert XML structure into JSON", engine: "data" },
    ],
  },
  yaml: {
    extension: "yaml",
    name: "YAML Data",
    category: "data",
    mimeType: "text/yaml",
    conversions: [
      { target: "json", engine: "data", description: "Structured JSON format", recommended: true },
      { target: "csv", engine: "data", description: "Spreadsheet CSV" },
      { target: "xml", engine: "data", description: "XML markup" },
      { target: "toml", engine: "data", description: "TOML config format" },
    ],
    smartActions: [
      { id: "to-json", label: "Convert to JSON", toFormat: "json", badge: "Universal", description: "Convert YAML to JSON", engine: "data" },
    ],
  },
  yml: {
    extension: "yml",
    name: "YAML Data",
    category: "data",
    mimeType: "text/yaml",
    conversions: [
      { target: "json", engine: "data", description: "JSON format", recommended: true },
      { target: "csv", engine: "data", description: "CSV spreadsheet" },
      { target: "xml", engine: "data", description: "XML markup" },
    ],
  },
  tsv: {
    extension: "tsv",
    name: "Tab-Separated Values",
    category: "data",
    mimeType: "text/tab-separated-values",
    conversions: [
      { target: "csv", engine: "data", description: "Comma-separated CSV", recommended: true },
      { target: "json", engine: "data", description: "JSON array" },
    ],
  },
  toml: {
    extension: "toml",
    name: "TOML Config",
    category: "data",
    mimeType: "application/toml",
    conversions: [
      { target: "json", engine: "data", description: "JSON format", recommended: true },
      { target: "yaml", engine: "data", description: "YAML format" },
    ],
  },
  md: {
    extension: "md",
    name: "Markdown Document",
    category: "developer",
    mimeType: "text/markdown",
    conversions: [
      { target: "html", engine: "text", description: "Rendered HTML page", recommended: true },
      { target: "pdf", engine: "jspdf", description: "PDF document" },
      { target: "txt", engine: "text", description: "Plain text" },
    ],
    smartActions: [
      { id: "to-html", label: "Render HTML", toFormat: "html", badge: "Web", description: "Convert Markdown to styled HTML", engine: "text" },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // DOCUMENTS
  // ════════════════════════════════════════════════════════════
  pptx: {
    extension: "pptx",
    name: "PowerPoint Presentation (PPTX)",
    category: "document",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    conversions: [
      { target: "pdf", engine: "jspdf", description: "Convert slides to high-resolution landscape PDF presentation", recommended: true },
      { target: "docx", engine: "jspdf", description: "Export slides to structured Microsoft Word document", recommended: true },
      { target: "txt", engine: "data", description: "Extract slide text outline and presenter notes" },
      { target: "html", engine: "data", description: "Interactive HTML slide outline" },
    ],
    smartActions: [
      { id: "pptx-pdf", label: "Convert to PDF", toFormat: "pdf", badge: "Presentation", description: "Multi-slide landscape PDF document", engine: "jspdf" },
      { id: "pptx-docx", label: "Convert to DOCX", toFormat: "docx", badge: "Word Doc", description: "Turn slides into formatted Word document", engine: "jspdf" },
      { id: "pptx-txt", label: "Extract Outline", toFormat: "txt", badge: "Text Only", description: "Extract slide text and speaker notes", engine: "data" },
    ],
  },
  ppt: {
    extension: "ppt",
    name: "Legacy PowerPoint (PPT)",
    category: "document",
    mimeType: "application/vnd.ms-powerpoint",
    conversions: [
      { target: "pdf", engine: "jspdf", description: "Convert PowerPoint slides to landscape PDF document", recommended: true },
      { target: "docx", engine: "jspdf", description: "Convert slides to formatted Microsoft Word document", recommended: true },
      { target: "txt", engine: "data", description: "Extract slide text outline and notes" },
    ],
    smartActions: [
      { id: "ppt-pdf", label: "Convert to PDF", toFormat: "pdf", badge: "Presentation", description: "Export presentation slides as PDF", engine: "jspdf" },
      { id: "ppt-docx", label: "Convert to DOCX", toFormat: "docx", badge: "Word Doc", description: "Extract presentation into Word document", engine: "jspdf" },
      { id: "ppt-txt", label: "Extract Outline", toFormat: "txt", badge: "Text Only", description: "Extract slide text", engine: "data" },
    ],
  },
  docx: {
    extension: "docx",
    name: "Microsoft Word Document (DOCX)",
    category: "document",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    conversions: [
      { target: "pdf", engine: "jspdf", description: "Convert Word document to clean printable PDF", recommended: true },
      { target: "txt", engine: "data", description: "Extract plain text content" },
      { target: "html", engine: "data", description: "Web-ready HTML page" },
    ],
    smartActions: [
      { id: "docx-pdf", label: "Convert to PDF", toFormat: "pdf", badge: "Print-Ready", description: "Convert formatted Word document to PDF", engine: "jspdf" },
      { id: "docx-txt", label: "Extract Text", toFormat: "txt", badge: "Clean Text", description: "Extract text from Word document", engine: "data" },
    ],
  },
  txt: {
    extension: "txt",
    name: "Plain Text",
    category: "document",
    mimeType: "text/plain",
    conversions: [
      { target: "pdf", engine: "jspdf", description: "Formatted PDF document", recommended: true },
      { target: "html", engine: "data", description: "HTML webpage with text" },
      { target: "json", engine: "data", description: "Wrap text in JSON string" },
      { target: "md", engine: "text", description: "Markdown document" },
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
      { target: "md", engine: "text", description: "Markdown document" },
    ],
  },
  rtf: {
    extension: "rtf",
    name: "Rich Text Format",
    category: "document",
    mimeType: "application/rtf",
    conversions: [
      { target: "pdf", engine: "jspdf", description: "PDF document", recommended: true },
      { target: "txt", engine: "data", description: "Plain text" },
      { target: "html", engine: "data", description: "HTML page" },
    ],
  },
  odt: {
    extension: "odt",
    name: "OpenDocument Text",
    category: "document",
    mimeType: "application/vnd.oasis.opendocument.text",
    conversions: [
      { target: "pdf", engine: "jspdf", description: "PDF document", recommended: true },
      { target: "txt", engine: "data", description: "Plain text" },
    ],
  },
  pdf: {
    extension: "pdf",
    name: "PDF Document",
    category: "document",
    mimeType: "application/pdf",
    conversions: [
      { target: "png", engine: "canvas", description: "Convert PDF pages to lossless PNG images", recommended: true },
      { target: "jpg", engine: "canvas", description: "Convert PDF pages to standard JPG photos", recommended: true },
      { target: "webp", engine: "canvas", description: "Convert PDF pages to compressed WebP images" },
      { target: "txt", engine: "data", description: "Extract plain text content" },
      { target: "svg", engine: "canvas", description: "Convert PDF pages to SVG" },
    ],
    smartActions: [
      { id: "to-png", label: "PDF to PNG", toFormat: "png", badge: "High Quality", description: "Convert pages to crisp PNG", engine: "canvas" },
      { id: "to-jpg", label: "PDF to JPG", toFormat: "jpg", badge: "Standard", description: "Extract pages to JPG photos", engine: "canvas" },
      { id: "to-webp", label: "PDF to WebP", toFormat: "webp", badge: "Web Ready", description: "Convert pages to lightweight WebP", engine: "canvas" },
      { id: "protect-pdf", label: "Protect PDF", toFormat: "pdf", badge: "Security", description: "Password protect & encrypt PDF", engine: "jspdf" },
      { id: "unlock-pdf", label: "Unlock PDF", toFormat: "pdf", badge: "Unlock", description: "Remove PDF password protection", engine: "jspdf" },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // SUBTITLES
  // ════════════════════════════════════════════════════════════
  srt: {
    extension: "srt",
    name: "SubRip Subtitle",
    category: "subtitle",
    mimeType: "text/plain",
    conversions: [
      { target: "vtt", engine: "subtitle", description: "WebVTT for web players", recommended: true },
      { target: "ass", engine: "subtitle", description: "Advanced SubStation Alpha" },
    ],
    smartActions: [
      { id: "to-vtt", label: "Convert to VTT", toFormat: "vtt", badge: "Web", description: "Web-compatible subtitle format", engine: "subtitle" },
    ],
  },
  vtt: {
    extension: "vtt",
    name: "WebVTT Subtitle",
    category: "subtitle",
    mimeType: "text/vtt",
    conversions: [
      { target: "srt", engine: "subtitle", description: "Universal SRT format", recommended: true },
      { target: "ass", engine: "subtitle", description: "Advanced SubStation Alpha" },
    ],
    smartActions: [
      { id: "to-srt", label: "Convert to SRT", toFormat: "srt", badge: "Universal", description: "Universal subtitle format", engine: "subtitle" },
    ],
  },
  ass: {
    extension: "ass",
    name: "ASS Subtitle",
    category: "subtitle",
    mimeType: "text/plain",
    conversions: [
      { target: "srt", engine: "subtitle", description: "Universal SRT", recommended: true },
      { target: "vtt", engine: "subtitle", description: "WebVTT format" },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // ARCHIVE
  // ════════════════════════════════════════════════════════════
  zip: {
    extension: "zip",
    name: "ZIP Archive",
    category: "archive",
    mimeType: "application/zip",
    conversions: [
      { target: "extract", engine: "archive", description: "Extract all files from archive", recommended: true },
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
