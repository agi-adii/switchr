"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GlassPillTabs } from "@/components/ui/glass-pill-tabs";
import {
  FileImage,
  FileText,
  Music,
  Video,
  FileCode,
  Archive,
  ArrowRight,
  Sparkles,
  Minimize2,
  Layers,
  Lock,
  Unlock,
  History,
  Search,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { PSEO_PAIRS } from "@/lib/pseo-registry";

const smoothEase = [0.16, 1, 0.3, 1] as const;

type SuiteCategory = "all" | "image" | "pdf" | "media" | "data" | "archive";

interface SuiteToolItem {
  id: string;
  title: string;
  desc: string;
  href: string;
  icon: any;
  accent: string;
  buttonText: string;
  formats: string[];
  category: SuiteCategory;
  badge?: string;
}

const ALL_SUITE_TOOLS: SuiteToolItem[] = [
  {
    id: "image-converter",
    title: "Image Converter",
    desc: "Convert WebP, PNG, JPG, AVIF, SVG, BMP, GIF, and HEIC photos with custom compression and resolution.",
    href: "/convert/images",
    icon: FileImage,
    accent: "text-blue-400 bg-blue-500/15 border border-blue-400/25",
    buttonText: "Open Image Converter",
    formats: ["JPG", "PNG", "WEBP", "AVIF"],
    category: "image",
  },
  {
    id: "ai-enhancer",
    title: "AI Photo Enhancer",
    desc: "Neural super-resolution, dynamic range calibration, exposure, 14 tone sliders, and 2x/4x clarity upscale.",
    href: "/tools/enhance",
    icon: Sparkles,
    accent: "text-purple-400 bg-purple-500/15 border border-purple-400/25",
    buttonText: "Launch AI Enhancer",
    formats: ["AI 4K", "Real-ESRGAN", "Sliders"],
    category: "image",
    badge: "AI",
  },
  {
    id: "compressor",
    title: "Smart File Compressor",
    desc: "Reduce heavy photo and PDF file sizes client-side with smart adaptive quantization and real-time measurement.",
    href: "/compress",
    icon: Minimize2,
    accent: "text-emerald-400 bg-emerald-500/15 border border-emerald-400/25",
    buttonText: "Open File Compressor",
    formats: ["Images", "PDF Docs", "Quality"],
    category: "image",
  },
  {
    id: "images-to-pdf",
    title: "Multi-Image to PDF",
    desc: "Compile multiple photos, gallery screenshots, and iPhone HEIC files into a single printable PDF document.",
    href: "/pdf-tools?tab=images",
    icon: Layers,
    accent: "text-sky-400 bg-sky-500/15 border border-sky-400/25",
    buttonText: "Create PDF from Images",
    formats: ["Photos → PDF", "HEIC", "Reorder"],
    category: "pdf",
  },
  {
    id: "pdf-to-image",
    title: "PDF to Image Extractor",
    desc: "Extract individual high-resolution PNG, JPG, or WebP pages from multi-page PDFs, or download all as a ZIP.",
    href: "/pdf-tools?tab=pdfToImage",
    icon: FileImage,
    accent: "text-red-400 bg-red-500/15 border border-red-400/25",
    buttonText: "Extract PDF Pages",
    formats: ["PDF → PNG", "PDF → JPG", "ZIP Export"],
    category: "pdf",
  },
  {
    id: "protect-pdf",
    title: "Password Protect PDF",
    desc: "Encrypt confidential PDF documents with 128-bit AES encryption, user/owner passwords, and print permissions.",
    href: "/pdf-tools?tab=protect",
    icon: Lock,
    accent: "text-amber-400 bg-amber-500/15 border border-amber-400/25",
    buttonText: "Protect PDF Document",
    formats: ["128-bit AES", "Password", "Encrypt"],
    category: "pdf",
  },
  {
    id: "unlock-pdf",
    title: "Unlock PDF Document",
    desc: "Decrypt password-protected PDFs and remove printing or copying restrictions right in browser memory.",
    href: "/pdf-tools?tab=unlock",
    icon: Unlock,
    accent: "text-teal-400 bg-teal-500/15 border border-teal-400/25",
    buttonText: "Unlock PDF File",
    formats: ["Decrypt", "Remove Lock", "Export"],
    category: "pdf",
  },
  {
    id: "text-to-pdf",
    title: "Text to PDF Formatter",
    desc: "Format plain text, notes, code snippets, or markdown outlines into a clean, paginated, and printable PDF document.",
    href: "/pdf-tools?tab=text",
    icon: FileText,
    accent: "text-violet-400 bg-violet-500/15 border border-violet-400/25",
    buttonText: "Format Text to PDF",
    formats: ["Text → PDF", "Paginated", "Doc"],
    category: "pdf",
  },
  {
    id: "document-converter",
    title: "Document Converter",
    desc: "Convert PowerPoint PPT/PPTX slides into clean PDFs, editable DOCX files, plain text, or formatted HTML.",
    href: "/convert/documents",
    icon: FileText,
    accent: "text-orange-400 bg-orange-500/15 border border-orange-400/25",
    buttonText: "Open Document Converter",
    formats: ["PPTX → PDF", "PPT → DOCX", "HTML"],
    category: "data",
  },
  {
    id: "audio-converter",
    title: "Audio Converter",
    desc: "Transcode audio tracks between MP3, WAV, AAC, M4A, OGG with custom bitrates (up to 320k) and sample rates.",
    href: "/convert/audio",
    icon: Music,
    accent: "text-green-400 bg-green-500/15 border border-green-400/25",
    buttonText: "Open Audio Converter",
    formats: ["MP3", "WAV", "AAC", "320k"],
    category: "media",
  },
  {
    id: "video-converter",
    title: "Video Converter",
    desc: "Transcode video files between MP4, WebM, MOV, and MKV client-side using native multi-threaded WebAssembly.",
    href: "/convert/video",
    icon: Video,
    accent: "text-fuchsia-400 bg-fuchsia-500/15 border border-fuchsia-400/25",
    buttonText: "Open Video Converter",
    formats: ["MP4", "WEBM", "MOV", "MKV"],
    category: "media",
  },
  {
    id: "video-to-mp3",
    title: "Video to MP3 Extractor",
    desc: "Extract high-bitrate audio tracks and vocal sound directly from video recordings and clips in seconds.",
    href: "/convert/video",
    icon: Music,
    accent: "text-cyan-400 bg-cyan-500/15 border border-cyan-400/25",
    buttonText: "Extract Video to MP3",
    formats: ["MP4 → MP3", "Fast Track", "Audio"],
    category: "media",
  },
  {
    id: "video-to-gif",
    title: "Video to GIF Maker",
    desc: "Transform MP4, MOV, and WebM video recordings or clips into lightweight, looping animated GIF images.",
    href: "/convert/video",
    icon: Video,
    accent: "text-pink-400 bg-pink-500/15 border border-pink-400/25",
    buttonText: "Create Animated GIF",
    formats: ["Video → GIF", "Looping", "Animation"],
    category: "media",
  },
  {
    id: "data-studio",
    title: "Data Studio Converter",
    desc: "Convert structured datasets between JSON, CSV, and XML with interactive live table preview and schema parsing.",
    href: "/convert/data",
    icon: FileCode,
    accent: "text-yellow-400 bg-yellow-500/15 border border-yellow-400/25",
    buttonText: "Open Data Studio",
    formats: ["JSON ↔ CSV", "XML → JSON", "Live Table"],
    category: "data",
  },
  {
    id: "zip-studio",
    title: "ZIP Archive Studio",
    desc: "Package multiple files into clean ZIP bundles, or inspect and unpack archive files in browser memory.",
    href: "/tools/archive",
    icon: Archive,
    accent: "text-indigo-400 bg-indigo-500/15 border border-indigo-400/25",
    buttonText: "Open Archive Studio",
    formats: ["Create ZIP", "Extract ZIP", "Unpack"],
    category: "archive",
  },
  {
    id: "history",
    title: "Conversion History",
    desc: "Review all your recent client-side conversions and re-download generated files without server storage.",
    href: "/history",
    icon: History,
    accent: "text-zinc-300 bg-zinc-500/15 border border-zinc-400/25",
    buttonText: "View Activity History",
    formats: ["Local RAM", "Re-Download", "Zero Log"],
    category: "archive",
  },
];

/* ── 1-Click Targeted Conversions & PDF Features Master Directory ── */
export interface ConversionCardItem {
  id: string;
  title: string;
  category: "PDF" | "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT" | "DATA" | "ARCHIVE";
  filterCategory: "all" | "pdf" | "image" | "video" | "audio" | "document" | "data";
  subtitle: string;
  href: string;
}

const ALL_CONVERSIONS_LIST: ConversionCardItem[] = [
  /* ── 1. Dedicated PSEO Pairs (Preserves exact first 16 cards from user reference) ── */
  ...PSEO_PAIRS.map((pair) => ({
    id: `pseo-${pair.slug}`,
    title: `${pair.fromFormat} → ${pair.toFormat}`,
    category: ((pair.category as string) === "data" ? "DATA" : pair.category.toUpperCase()) as any,
    filterCategory: ((pair.category as string) === "data" ? "data" : pair.category) as any,
    subtitle: pair.subtitle,
    href: `/convert/${pair.slug}`,
  })),

  /* ── 2. All PDF Suite Features & Operations ── */
  {
    id: "pdf-multi-image",
    title: "Multi-Image → PDF",
    category: "PDF",
    filterCategory: "pdf",
    subtitle: "Compile multiple photos, gallery screenshots, and iPhone HEIC files into a single printable PDF document.",
    href: "/pdf-tools?tab=images",
  },
  {
    id: "pdf-extract-images",
    title: "PDF → Image Extractor",
    category: "PDF",
    filterCategory: "pdf",
    subtitle: "Extract individual high-resolution PNG, JPG, or WebP pages from multi-page PDFs with batch ZIP download.",
    href: "/pdf-tools?tab=pdfToImage",
  },
  {
    id: "pdf-protect-encrypt",
    title: "Protect PDF (128-bit AES)",
    category: "PDF",
    filterCategory: "pdf",
    subtitle: "Encrypt and password-protect confidential PDF documents with custom print and copy permissions.",
    href: "/pdf-tools?tab=protect",
  },
  {
    id: "pdf-unlock-decrypt",
    title: "Unlock PDF (Decrypt)",
    category: "PDF",
    filterCategory: "pdf",
    subtitle: "Remove password restrictions and decrypt protected PDF files directly inside your browser memory.",
    href: "/pdf-tools?tab=unlock",
  },
  {
    id: "pdf-text-formatter",
    title: "Text → PDF Formatter",
    category: "PDF",
    filterCategory: "pdf",
    subtitle: "Format plain text, notes, code snippets, or markdown drafts into clean, paginated PDF documents.",
    href: "/pdf-tools?tab=text",
  },
  {
    id: "pdf-compressor-engine",
    title: "PDF Compressor",
    category: "PDF",
    filterCategory: "pdf",
    subtitle: "Shrink heavy PDF documents down to email-friendly file sizes with calibrated quality and real-time size reduction.",
    href: "/compress",
  },
  {
    id: "pdf-merger-tool",
    title: "Merge PDF Documents",
    category: "PDF",
    filterCategory: "pdf",
    subtitle: "Combine two or more PDF documents into a single organized file with full page order preservation.",
    href: "/convert/merge-pdf",
  },
  {
    id: "pdf-to-webp-export",
    title: "PDF → WebP Pages",
    category: "PDF",
    filterCategory: "pdf",
    subtitle: "Render multi-page PDF documents into modern, highly compressed WebP images with transparent background support.",
    href: "/convert/documents",
  },
  {
    id: "pdf-to-txt-extract",
    title: "PDF → Text Outline",
    category: "PDF",
    filterCategory: "pdf",
    subtitle: "Extract readable text content, raw paragraphs, and plain text outlines from PDF documents.",
    href: "/convert/documents",
  },
  {
    id: "pdf-to-html-doc",
    title: "PDF → HTML Document",
    category: "PDF",
    filterCategory: "pdf",
    subtitle: "Render presentation and document pages into readable, responsive HTML web pages.",
    href: "/convert/documents",
  },
  {
    id: "pdf-csv-to-pdf",
    title: "CSV → PDF Document",
    category: "PDF",
    filterCategory: "pdf",
    subtitle: "Render tabular CSV spreadsheet rows into a paginated printable PDF document.",
    href: "/convert/data",
  },

  /* ── 3. Image Conversions & Studio Tools ── */
  {
    id: "img-jpg-to-webp",
    title: "JPG → WebP",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Convert standard JPEG photos into modern high-efficiency WebP images with superior compression.",
    href: "/convert/images",
  },
  {
    id: "img-jpg-to-png",
    title: "JPG → PNG",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Convert JPEG photos into lossless PNG format with transparent background capability.",
    href: "/convert/images",
  },
  {
    id: "img-jpg-to-avif",
    title: "JPG → AVIF",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Convert standard JPEG photos into next-generation AVIF images with up to 50% smaller size.",
    href: "/convert/images",
  },
  {
    id: "img-png-to-webp",
    title: "PNG → WebP",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Compress heavy PNG images into lightweight WebP format while preserving crystal-clear detail.",
    href: "/convert/images",
  },
  {
    id: "img-png-to-avif",
    title: "PNG → AVIF",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Transcode transparent PNG graphics into modern AVIF format with state-of-the-art compression.",
    href: "/convert/images",
  },
  {
    id: "img-webp-to-jpg",
    title: "WebP → JPG",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Convert modern WebP images into standard JPEG format for legacy applications and print workflows.",
    href: "/convert/images",
  },
  {
    id: "img-webp-to-avif",
    title: "WebP → AVIF",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Upgrade WebP graphics to high-efficiency AV1 Image Format for next-gen web speed.",
    href: "/convert/images",
  },
  {
    id: "img-avif-to-png",
    title: "AVIF → PNG",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Convert modern AVIF images into universally supported lossless PNG format with alpha support.",
    href: "/convert/images",
  },
  {
    id: "img-avif-to-jpg",
    title: "AVIF → JPG",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Convert AVIF graphics into universally compatible JPG photos for legacy software.",
    href: "/convert/images",
  },
  {
    id: "img-avif-to-webp",
    title: "AVIF → WebP",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Convert modern AVIF files into broadly supported Google WebP image format.",
    href: "/convert/images",
  },
  {
    id: "img-heic-to-webp",
    title: "HEIC → WebP",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Convert Apple iPhone HEIC and HEIF photos into lightweight WebP images for the web.",
    href: "/convert/images",
  },
  {
    id: "img-svg-to-png",
    title: "SVG → PNG",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Rasterize scalable vector graphics (SVG) into high-resolution lossless PNG images with alpha channel.",
    href: "/convert/images",
  },
  {
    id: "img-svg-to-jpg",
    title: "SVG → JPG",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Rasterize SVG vector illustrations and logos into universally viewable JPG photos.",
    href: "/convert/images",
  },
  {
    id: "img-svg-to-webp",
    title: "SVG → WebP",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Convert vector SVG graphics into modern, high-compression WebP images.",
    href: "/convert/images",
  },
  {
    id: "img-svg-to-pdf",
    title: "SVG → PDF",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Convert vector SVG graphics into clean, high-resolution vector PDF documents.",
    href: "/convert/images",
  },
  {
    id: "img-gif-to-png",
    title: "GIF → PNG",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Extract clean, high-resolution PNG stills from animated GIF files without visual degradation.",
    href: "/convert/images",
  },
  {
    id: "img-gif-to-jpg",
    title: "GIF → JPG",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Convert GIF animation frames into standard JPEG pictures with custom quality presets.",
    href: "/convert/images",
  },
  {
    id: "img-gif-to-webp",
    title: "GIF → WebP",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Convert bulky animated GIF files into modern, lightweight animated WebP images.",
    href: "/convert/images",
  },
  {
    id: "img-bmp-to-png",
    title: "BMP → PNG",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Compress uncompressed Windows bitmap (BMP) files into lossless, high-efficiency PNG graphics.",
    href: "/convert/images",
  },
  {
    id: "img-bmp-to-jpg",
    title: "BMP → JPG",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Convert heavy BMP bitmaps into compact, universally compatible JPEG photos.",
    href: "/convert/images",
  },
  {
    id: "img-bmp-to-webp",
    title: "BMP → WebP",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Convert Windows bitmap BMP graphics into modern high-efficiency WebP images.",
    href: "/convert/images",
  },
  {
    id: "img-ai-enhancer",
    title: "AI Photo Enhancer",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Neural super-resolution, dynamic range calibration, exposure, 14 tone sliders, and 2x/4x upscale.",
    href: "/tools/enhance",
  },
  {
    id: "img-compressor",
    title: "Image Compressor",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Reduce photo and graphic file sizes client-side with smart adaptive quantization and preview.",
    href: "/compress",
  },

  /* ── 4. Video Conversions & Tools ── */
  {
    id: "vid-webm-to-mp4",
    title: "WebM → MP4",
    category: "VIDEO",
    filterCategory: "video",
    subtitle: "Transcode open WebM video clips into universally playable H.264 MP4 videos directly in your browser.",
    href: "/convert/video",
  },
  {
    id: "vid-mov-to-webm",
    title: "MOV → WebM",
    category: "VIDEO",
    filterCategory: "video",
    subtitle: "Convert Apple QuickTime MOV clips into open WebM format with VP9 video encoding.",
    href: "/convert/video",
  },
  {
    id: "vid-mov-to-mp3",
    title: "MOV → MP3",
    category: "VIDEO",
    filterCategory: "video",
    subtitle: "Extract audio tracks and voice recordings from Apple QuickTime MOV videos into MP3 files.",
    href: "/convert/video",
  },
  {
    id: "vid-mov-to-gif",
    title: "MOV → GIF",
    category: "VIDEO",
    filterCategory: "video",
    subtitle: "Turn Apple QuickTime MOV screen recordings into lightweight animated GIFs.",
    href: "/convert/video",
  },
  {
    id: "vid-mkv-to-mp4",
    title: "MKV → MP4",
    category: "VIDEO",
    filterCategory: "video",
    subtitle: "Transcode Matroska MKV containers into standard MP4 for seamless playback on mobile devices.",
    href: "/convert/video",
  },
  {
    id: "vid-mkv-to-webm",
    title: "MKV → WebM",
    category: "VIDEO",
    filterCategory: "video",
    subtitle: "Convert heavy MKV video files into modern streaming-ready WebM formats.",
    href: "/convert/video",
  },
  {
    id: "vid-mkv-to-mp3",
    title: "MKV → MP3",
    category: "VIDEO",
    filterCategory: "video",
    subtitle: "Extract crystal-clear audio tracks and soundtracks from high-definition MKV movie files.",
    href: "/convert/video",
  },
  {
    id: "vid-mkv-to-gif",
    title: "MKV → GIF",
    category: "VIDEO",
    filterCategory: "video",
    subtitle: "Extract memorable video scenes from MKV files into looping GIF animations.",
    href: "/convert/video",
  },
  {
    id: "vid-avi-to-mp4",
    title: "AVI → MP4",
    category: "VIDEO",
    filterCategory: "video",
    subtitle: "Convert legacy AVI video files into modern, streaming-ready MP4 format.",
    href: "/convert/video",
  },
  {
    id: "vid-avi-to-webm",
    title: "AVI → WebM",
    category: "VIDEO",
    filterCategory: "video",
    subtitle: "Transcode legacy AVI clips into lightweight, web-native WebM video.",
    href: "/convert/video",
  },
  {
    id: "vid-avi-to-mp3",
    title: "AVI → MP3",
    category: "VIDEO",
    filterCategory: "video",
    subtitle: "Extract audio stems and music from legacy AVI video files into standalone MP3 format.",
    href: "/convert/video",
  },
  {
    id: "vid-avi-to-gif",
    title: "AVI → GIF",
    category: "VIDEO",
    filterCategory: "video",
    subtitle: "Turn vintage AVI movie clips into modern shareable looping animated GIFs.",
    href: "/convert/video",
  },
  {
    id: "vid-mp4-to-gif",
    title: "MP4 → GIF",
    category: "VIDEO",
    filterCategory: "video",
    subtitle: "Convert H.264 MP4 videos into high-fps animated GIF clips for chat and social media.",
    href: "/convert/video-to-gif",
  },

  /* ── 5. Audio Conversions ── */
  {
    id: "aud-mp3-to-wav",
    title: "MP3 → WAV",
    category: "AUDIO",
    filterCategory: "audio",
    subtitle: "Decode compressed MP3 files into uncompressed PCM WAV audio for digital audio workstations.",
    href: "/convert/audio",
  },
  {
    id: "aud-mp3-to-aac",
    title: "MP3 → AAC",
    category: "AUDIO",
    filterCategory: "audio",
    subtitle: "Convert MP3 audio tracks into Advanced Audio Coding (AAC) format for Apple devices and streaming.",
    href: "/convert/audio",
  },
  {
    id: "aud-mp3-to-m4a",
    title: "MP3 → M4A",
    category: "AUDIO",
    filterCategory: "audio",
    subtitle: "Transcode MP3 audio into MPEG-4 M4A format with crystal-clear AAC compression.",
    href: "/convert/audio",
  },
  {
    id: "aud-mp3-to-ogg",
    title: "MP3 → OGG",
    category: "AUDIO",
    filterCategory: "audio",
    subtitle: "Convert standard MP3 files into open-source Ogg Vorbis audio tracks for gaming and web.",
    href: "/convert/audio",
  },
  {
    id: "aud-wav-to-aac",
    title: "WAV → AAC",
    category: "AUDIO",
    filterCategory: "audio",
    subtitle: "Encode high-resolution studio WAV masters into compact, efficient AAC audio files.",
    href: "/convert/audio",
  },
  {
    id: "aud-wav-to-m4a",
    title: "WAV → M4A",
    category: "AUDIO",
    filterCategory: "audio",
    subtitle: "Compress studio PCM WAV recordings into lightweight Apple M4A container audio.",
    href: "/convert/audio",
  },
  {
    id: "aud-wav-to-ogg",
    title: "WAV → OGG",
    category: "AUDIO",
    filterCategory: "audio",
    subtitle: "Encode uncompressed WAV stems into royalty-free Ogg Vorbis compressed audio.",
    href: "/convert/audio",
  },
  {
    id: "aud-aac-to-mp3",
    title: "AAC → MP3",
    category: "AUDIO",
    filterCategory: "audio",
    subtitle: "Convert Apple AAC and M4A audio files into universally playable MP3 tracks.",
    href: "/convert/audio",
  },
  {
    id: "aud-aac-to-wav",
    title: "AAC → WAV",
    category: "AUDIO",
    filterCategory: "audio",
    subtitle: "Decode AAC and M4A tracks into uncompressed studio-standard WAV audio streams.",
    href: "/convert/audio",
  },
  {
    id: "aud-m4a-to-mp3",
    title: "M4A → MP3",
    category: "AUDIO",
    filterCategory: "audio",
    subtitle: "Convert Apple voice memos and iTunes M4A tracks into standard MP3 songs.",
    href: "/convert/audio",
  },
  {
    id: "aud-m4a-to-wav",
    title: "M4A → WAV",
    category: "AUDIO",
    filterCategory: "audio",
    subtitle: "Decode voice memos and M4A files into uncompressed 16-bit PCM WAV tracks.",
    href: "/convert/audio",
  },
  {
    id: "aud-ogg-to-mp3",
    title: "OGG → MP3",
    category: "AUDIO",
    filterCategory: "audio",
    subtitle: "Transcode Ogg Vorbis audio tracks into universally compatible MP3 format.",
    href: "/convert/audio",
  },
  {
    id: "aud-ogg-to-wav",
    title: "OGG → WAV",
    category: "AUDIO",
    filterCategory: "audio",
    subtitle: "Decompress Ogg Vorbis tracks into lossless PCM WAV format for editing.",
    href: "/convert/audio",
  },
  {
    id: "aud-flac-to-mp3",
    title: "FLAC → MP3",
    category: "AUDIO",
    filterCategory: "audio",
    subtitle: "Compress studio lossless FLAC recordings into high-bitrate 320kbps MP3 tracks.",
    href: "/convert/audio",
  },
  {
    id: "aud-flac-to-wav",
    title: "FLAC → WAV",
    category: "AUDIO",
    filterCategory: "audio",
    subtitle: "Decode FLAC audio into uncompressed studio WAV format with zero quality loss.",
    href: "/convert/audio",
  },

  /* ── 6. Document Conversions ── */
  {
    id: "doc-docx-to-txt",
    title: "DOCX → TXT",
    category: "DOCUMENT",
    filterCategory: "document",
    subtitle: "Extract clean, unformatted plain text content from Microsoft Word DOCX documents.",
    href: "/convert/documents",
  },
  {
    id: "doc-docx-to-html",
    title: "DOCX → HTML",
    category: "DOCUMENT",
    filterCategory: "document",
    subtitle: "Convert formatted Microsoft Word documents into clean, responsive HTML web pages.",
    href: "/convert/documents",
  },
  {
    id: "doc-pptx-to-txt",
    title: "PPTX → TXT",
    category: "DOCUMENT",
    filterCategory: "document",
    subtitle: "Extract presentation slide text outlines and speaker presenter notes into plain text.",
    href: "/convert/documents",
  },
  {
    id: "doc-pptx-to-html",
    title: "PPTX → HTML",
    category: "DOCUMENT",
    filterCategory: "document",
    subtitle: "Export PowerPoint slides into an interactive, readable HTML presentation outline.",
    href: "/convert/documents",
  },
  {
    id: "doc-ppt-to-txt",
    title: "PPT → TXT",
    category: "DOCUMENT",
    filterCategory: "document",
    subtitle: "Extract slide text outlines and presenter notes from legacy PowerPoint presentations.",
    href: "/convert/documents",
  },
  {
    id: "doc-txt-to-html",
    title: "TXT → HTML",
    category: "DOCUMENT",
    filterCategory: "document",
    subtitle: "Convert raw text files and markdown notes into formatted, readable HTML web pages.",
    href: "/convert/documents",
  },
  {
    id: "doc-txt-to-docx",
    title: "TXT → DOCX",
    category: "DOCUMENT",
    filterCategory: "document",
    subtitle: "Wrap raw text or markdown outlines into an editable Microsoft Word DOCX document.",
    href: "/convert/documents",
  },
  {
    id: "doc-html-to-pdf",
    title: "HTML → PDF",
    category: "DOCUMENT",
    filterCategory: "document",
    subtitle: "Render HTML web documents and text files into standard, print-ready PDF files.",
    href: "/convert/documents",
  },
  {
    id: "doc-html-to-txt",
    title: "HTML → TXT",
    category: "DOCUMENT",
    filterCategory: "document",
    subtitle: "Strip HTML formatting tags and extract plain text from web documents.",
    href: "/convert/documents",
  },
  {
    id: "doc-html-to-docx",
    title: "HTML → DOCX",
    category: "DOCUMENT",
    filterCategory: "document",
    subtitle: "Convert responsive HTML pages into styled, editable Microsoft Word DOCX files.",
    href: "/convert/documents",
  },

  /* ── 7. Data & Structured Conversions ── */
  {
    id: "dat-json-to-xml",
    title: "JSON → XML",
    category: "DATA",
    filterCategory: "data",
    subtitle: "Convert JSON objects and arrays into structured, hierarchical XML markup.",
    href: "/convert/data",
  },
  {
    id: "dat-xml-to-json",
    title: "XML → JSON",
    category: "DATA",
    filterCategory: "data",
    subtitle: "Parse structured XML documents and tag hierarchies into clean, navigable JSON objects.",
    href: "/convert/data",
  },
  {
    id: "dat-csv-to-xml",
    title: "CSV → XML",
    category: "DATA",
    filterCategory: "data",
    subtitle: "Transform CSV spreadsheet rows and columns into structured XML record documents.",
    href: "/convert/data",
  },
  {
    id: "dat-xml-to-csv",
    title: "XML → CSV",
    category: "DATA",
    filterCategory: "data",
    subtitle: "Flatten hierarchical XML data records into clean tabular CSV spreadsheets.",
    href: "/convert/data",
  },
  {
    id: "dat-csv-to-html",
    title: "CSV → HTML",
    category: "DATA",
    filterCategory: "data",
    subtitle: "Convert CSV datasets into styled, responsive HTML tables for web presentations.",
    href: "/convert/data",
  },
  {
    id: "dat-json-to-txt",
    title: "JSON → TXT",
    category: "DATA",
    filterCategory: "data",
    subtitle: "Convert JSON arrays and dictionaries into formatted readable text.",
    href: "/convert/data",
  },
  {
    id: "dat-xml-to-html",
    title: "XML → HTML",
    category: "DATA",
    filterCategory: "data",
    subtitle: "Render XML tag trees into formatted, human-readable HTML markup tables.",
    href: "/convert/data",
  },

  /* ── 8. Archive & Packaging Tools ── */
  {
    id: "arc-create-zip",
    title: "Create ZIP Bundle",
    category: "ARCHIVE",
    filterCategory: "data",
    subtitle: "Package multiple files, photos, and documents into a clean compressed ZIP archive.",
    href: "/tools/archive",
  },
  {
    id: "arc-extract-zip",
    title: "Extract ZIP Archive",
    category: "ARCHIVE",
    filterCategory: "data",
    subtitle: "Unpack, inspect, and extract ZIP archive contents directly in browser memory.",
    href: "/tools/archive",
  },

  /* ── 9. Developer & System Utilities ── */
  {
    id: "dev-png-to-ico",
    title: "PNG → ICO Favicon",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Convert PNG logos and graphics into multi-resolution Windows ICO favicon files for websites.",
    href: "/convert/images",
  },
  {
    id: "dev-jpg-to-ico",
    title: "JPG → ICO Favicon",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Turn photos and JPEG images into clean, crisp website favicon ICO icons.",
    href: "/convert/images",
  },
  {
    id: "dev-svg-to-ico",
    title: "SVG → ICO Icon",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Rasterize vector SVG artwork directly into standard multi-size desktop ICO icons.",
    href: "/convert/images",
  },
  {
    id: "dev-ico-to-png",
    title: "ICO → PNG",
    category: "IMAGE",
    filterCategory: "image",
    subtitle: "Extract transparent, high-resolution PNG images from Windows ICO favicon bundles.",
    href: "/convert/images",
  },
  {
    id: "dev-base64-encode",
    title: "Image → Base64 URI",
    category: "DATA",
    filterCategory: "data",
    subtitle: "Encode PNG, JPG, and SVG graphics into inline data:image Base64 strings for CSS and HTML.",
    href: "/convert/data",
  },
  {
    id: "dev-base64-decode",
    title: "Base64 → Image File",
    category: "DATA",
    filterCategory: "data",
    subtitle: "Decode raw Base64 data strings back into downloadable PNG and JPG image files.",
    href: "/convert/data",
  },
  {
    id: "dev-json-to-yaml",
    title: "JSON → YAML",
    category: "DATA",
    filterCategory: "data",
    subtitle: "Convert JSON configuration files and data payloads into clean, readable YAML schemas.",
    href: "/convert/data",
  },
  {
    id: "dev-yaml-to-json",
    title: "YAML → JSON",
    category: "DATA",
    filterCategory: "data",
    subtitle: "Parse Kubernetes, Docker, and CI/CD YAML manifests into structured JSON payloads.",
    href: "/convert/data",
  },
  {
    id: "dev-json-to-tsv",
    title: "JSON → TSV",
    category: "DATA",
    filterCategory: "data",
    subtitle: "Transform JSON data rows into tab-separated values for research and spreadsheets.",
    href: "/convert/data",
  },
  {
    id: "dev-tsv-to-json",
    title: "TSV → JSON",
    category: "DATA",
    filterCategory: "data",
    subtitle: "Convert tab-separated data files into clean, nested JSON objects.",
    href: "/convert/data",
  },
  {
    id: "dev-csv-to-tsv",
    title: "CSV → TSV",
    category: "DATA",
    filterCategory: "data",
    subtitle: "Convert comma-separated tables into tab-delimited sheets without quoting issues.",
    href: "/convert/data",
  },
  {
    id: "dev-tsv-to-csv",
    title: "TSV → CSV",
    category: "DATA",
    filterCategory: "data",
    subtitle: "Transcode tab-delimited files into standard universal CSV spreadsheets.",
    href: "/convert/data",
  },
  {
    id: "dev-csv-to-sql",
    title: "CSV → SQL Inserts",
    category: "DATA",
    filterCategory: "data",
    subtitle: "Generate clean SQL INSERT INTO statements directly from CSV spreadsheet rows.",
    href: "/convert/data",
  },
  {
    id: "dev-json-to-sql",
    title: "JSON → SQL Inserts",
    category: "DATA",
    filterCategory: "data",
    subtitle: "Transform JSON record arrays into ready-to-run database SQL INSERT scripts.",
    href: "/convert/data",
  },
  {
    id: "dev-xml-formatter",
    title: "XML Beautifier",
    category: "DATA",
    filterCategory: "data",
    subtitle: "Format, indent, and validate messy XML tags into clean hierarchical trees.",
    href: "/convert/data",
  },
  {
    id: "dev-json-validator",
    title: "JSON Formatter",
    category: "DATA",
    filterCategory: "data",
    subtitle: "Format, beautify, and validate JSON syntax with instant error highlighting.",
    href: "/convert/data",
  },

  /* ── 10. Extended Media & Document Conversions ── */
  {
    id: "vid-mp4-to-mov",
    title: "MP4 → MOV",
    category: "VIDEO",
    filterCategory: "video",
    subtitle: "Convert MP4 videos into Apple QuickTime MOV format for Final Cut Pro and Mac editing.",
    href: "/convert/video",
  },
  {
    id: "vid-webm-to-mov",
    title: "WebM → MOV",
    category: "VIDEO",
    filterCategory: "video",
    subtitle: "Transcode open WebM screen captures into standard Apple QuickTime MOV clips.",
    href: "/convert/video",
  },
  {
    id: "vid-mkv-to-mov",
    title: "MKV → MOV",
    category: "VIDEO",
    filterCategory: "video",
    subtitle: "Transcode Matroska MKV containers into Apple QuickTime MOV format.",
    href: "/convert/video",
  },
  {
    id: "vid-flv-to-mp4",
    title: "FLV → MP4",
    category: "VIDEO",
    filterCategory: "video",
    subtitle: "Convert legacy Flash FLV video streams into modern H.264 MP4 videos.",
    href: "/convert/video",
  },
  {
    id: "vid-wmv-to-mp4",
    title: "WMV → MP4",
    category: "VIDEO",
    filterCategory: "video",
    subtitle: "Convert Windows Media Video (WMV) clips into universally playable MP4 videos.",
    href: "/convert/video",
  },
  {
    id: "vid-3gp-to-mp4",
    title: "3GP → MP4",
    category: "VIDEO",
    filterCategory: "video",
    subtitle: "Transcode legacy mobile 3GP recordings into high-compatibility MP4 format.",
    href: "/convert/video",
  },
  {
    id: "aud-flac-to-aac",
    title: "FLAC → AAC",
    category: "AUDIO",
    filterCategory: "audio",
    subtitle: "Convert lossless studio FLAC tracks into compact, high-efficiency AAC audio.",
    href: "/convert/audio",
  },
  {
    id: "aud-flac-to-ogg",
    title: "FLAC → OGG",
    category: "AUDIO",
    filterCategory: "audio",
    subtitle: "Encode high-fidelity FLAC audio into open-standard Ogg Vorbis files.",
    href: "/convert/audio",
  },
  {
    id: "aud-wma-to-mp3",
    title: "WMA → MP3",
    category: "AUDIO",
    filterCategory: "audio",
    subtitle: "Convert legacy Windows Media Audio (WMA) tracks into universal MP3 format.",
    href: "/convert/audio",
  },
  {
    id: "aud-aiff-to-mp3",
    title: "AIFF → MP3",
    category: "AUDIO",
    filterCategory: "audio",
    subtitle: "Decode Apple AIFF studio sound tracks into compact 320kbps MP3 audio.",
    href: "/convert/audio",
  },
  {
    id: "doc-markdown-to-pdf",
    title: "Markdown → PDF",
    category: "PDF",
    filterCategory: "pdf",
    subtitle: "Format GitHub-flavored markdown outlines and notes into clean, paginated PDF documents.",
    href: "/pdf-tools?tab=text",
  },
  {
    id: "doc-code-to-pdf",
    title: "Code Snippet → PDF",
    category: "PDF",
    filterCategory: "pdf",
    subtitle: "Render programming code blocks and scripts into beautifully formatted printable PDFs.",
    href: "/pdf-tools?tab=text",
  },
  {
    id: "doc-json-to-pdf",
    title: "JSON → PDF Document",
    category: "PDF",
    filterCategory: "pdf",
    subtitle: "Format structured JSON datasets and configuration trees into readable PDF reports.",
    href: "/convert/data",
  },
  {
    id: "doc-xml-to-pdf",
    title: "XML → PDF Document",
    category: "PDF",
    filterCategory: "pdf",
    subtitle: "Render structured XML data records and document tags into a clean printable PDF.",
    href: "/convert/data",
  },
  {
    id: "arc-folder-to-zip",
    title: "Folder to ZIP Packager",
    category: "ARCHIVE",
    filterCategory: "data",
    subtitle: "Bundle an entire multi-level folder structure into a clean, portable ZIP archive.",
    href: "/tools/archive",
  },
  {
    id: "arc-inspect-zip",
    title: "Inspect Archive Contents",
    category: "ARCHIVE",
    filterCategory: "data",
    subtitle: "Browse files and subdirectories inside a ZIP archive without extracting them to disk.",
    href: "/tools/archive",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: smoothEase },
  },
};

export default function ConvertHubPage() {
  const [selectedSuiteCategory, setSelectedSuiteCategory] = useState<SuiteCategory>("all");
  const [selectedConvCategory, setSelectedConvCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredSuiteTools =
    selectedSuiteCategory === "all"
      ? ALL_SUITE_TOOLS
      : ALL_SUITE_TOOLS.filter((t) => t.category === selectedSuiteCategory);

  const filteredConversions = useMemo(() => {
    return ALL_CONVERSIONS_LIST.filter((conv) => {
      const matchesCategory =
        selectedConvCategory === "all" ||
        conv.filterCategory === selectedConvCategory ||
        conv.category.toLowerCase() === selectedConvCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        conv.title.toLowerCase().includes(q) ||
        conv.subtitle.toLowerCase().includes(q) ||
        conv.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedConvCategory, searchQuery]);

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-16">
      {/* ── Top Section: Master Conversion Suites ── */}
      <div>
        <Breadcrumbs items={[{ label: "Convert" }]} />

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: smoothEase }}
          className="text-center space-y-3 mb-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold mb-1 backdrop-blur-md shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Dedicated Conversion Suites</span>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Select What You Want to Convert
          </h1>
          <p className="text-xs sm:text-sm text-white/70 max-w-2xl mx-auto leading-relaxed">
            Choose a dedicated suite below, or jump directly into our comprehensive index of targeted 1-click file converters and PDF utilities.
          </p>

          {/* Category Filter Pills for Master Suites */}
          <div className="pt-4 flex justify-center">
            <GlassPillTabs<SuiteCategory>
              activeTab={selectedSuiteCategory}
              onChange={(id) => setSelectedSuiteCategory(id)}
              layoutId="convertSuiteTab"
              tabs={[
                { id: "all", label: `All Suites (${ALL_SUITE_TOOLS.length})` },
                { id: "image", label: "Image & AI" },
                { id: "pdf", label: "PDF Suite" },
                { id: "media", label: "Audio & Video" },
                { id: "data", label: "Data & Docs" },
                { id: "archive", label: "ZIP & System" },
              ]}
            />
          </div>
        </motion.div>

        {/* Master Suites Cards Grid */}
        <motion.div
          key={selectedSuiteCategory}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredSuiteTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                variants={cardVariants}
                whileHover={{ y: -5, transition: { type: "spring", stiffness: 320, damping: 18 } }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-white/40 hover:bg-white/15 hover:shadow-xl hover:shadow-white/5 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Specular highlight bar */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <motion.div
                      whileHover={{ scale: 1.12, rotate: 6 }}
                      transition={{ type: "spring", stiffness: 280, damping: 14 }}
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs ${tool.accent}`}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>

                    <div className="flex flex-wrap gap-1 items-center justify-end">
                      {tool.badge && (
                        <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-purple-500/25 border border-purple-400/40 text-purple-200">
                          {tool.badge}
                        </span>
                      )}
                      {tool.formats.slice(0, 3).map((f) => (
                        <span
                          key={f}
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/15 border border-white/15 text-white/80"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-white transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-white/65 mt-1.5 leading-relaxed line-clamp-3">
                      {tool.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-white/15">
                  <Link
                    href={tool.href}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/15 hover:bg-primary hover:text-primary-foreground text-white rounded-xl text-xs font-bold transition-all group/btn shadow-xs cursor-pointer"
                  >
                    <span>{tool.buttonText}</span>
                    <motion.span
                      className="inline-flex"
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ── Bottom Section: All 1-Click Targeted Conversions & PDF Features Master Directory ── */}
      <section className="pt-8 border-t border-white/15 space-y-8" id="all-conversions">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white/90 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Targeted 1-Click Converters</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Popular Conversions
          </h2>
          <p className="text-xs sm:text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
            Direct dedicated tools for high-frequency conversions with instant presets, zero server upload, and rich settings.
          </p>
        </div>

        {/* Filter Controls & Instant Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {[
              { id: "all", label: `All (${ALL_CONVERSIONS_LIST.length})` },
              { id: "pdf", label: "PDF Suite" },
              { id: "image", label: "Images" },
              { id: "video", label: "Video" },
              { id: "audio", label: "Audio" },
              { id: "document", label: "Documents" },
              { id: "data", label: "Data & ZIP" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedConvCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedConvCategory === cat.id
                    ? "bg-white text-zinc-950 shadow-md font-extrabold"
                    : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white border border-white/15"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-white/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversions..."
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 transition-colors backdrop-blur-md"
            />
          </div>
        </div>

        {/* Conversions 4-Column Grid: Exact same card styling as in the image */}
        <motion.div
          key={`${selectedConvCategory}-${searchQuery}`}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredConversions.map((conv) => (
            <motion.div key={conv.id} variants={cardVariants}>
              <Link
                href={conv.href}
                className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all group flex flex-col justify-between space-y-2.5 shadow-xs h-full"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white group-hover:text-amber-200 transition-colors truncate">
                    {conv.title}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/15 border border-white/20 text-white/80 uppercase shrink-0">
                    {conv.category}
                  </span>
                </div>
                <p className="text-[11px] text-white/65 line-clamp-2 leading-snug">
                  {conv.subtitle}
                </p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-white/90 group-hover:text-white">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filteredConversions.length === 0 && (
          <div className="p-8 text-center bg-white/5 border border-white/15 rounded-3xl text-xs text-white/70 space-y-2">
            <p className="font-bold text-sm text-white">No conversion tools found for &quot;{searchQuery}&quot;</p>
            <p>Try searching for a format like PDF, JPG, MP4, WebP, or Clear Filter.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedConvCategory("all");
              }}
              className="mt-2 px-4 py-1.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
