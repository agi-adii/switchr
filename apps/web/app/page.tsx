"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import {
  UploadCloud,
  FileImage,
  FileText,
  Music,
  Video,
  FileCode,
  Archive,
  Minimize2,
  Layers,
  ArrowRight,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Lock,
  Globe,
  CheckCircle2,
  Upload,
  Settings2,
  Download,
  RefreshCw,
  Cpu,
  SlidersHorizontal,
  Maximize2,
} from "lucide-react";
import Image from "next/image";
import { getFileExtension, getFormatMetadata } from "@/lib/registry";
import { toast } from "sonner";

import { FormatTransformationShowcase } from "@/components/format-transformation-showcase";
import { PrivacyArchitectureGraphic } from "@/components/privacy-architecture-graphic";

const smoothEase = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: smoothEase },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: smoothEase },
  }),
};

function getRouteForExtension(ext: string): string {
  const lower = ext.toLowerCase();
  if (["jpg", "jpeg", "png", "webp", "avif", "svg", "gif", "ico", "bmp", "tiff"].includes(lower)) {
    return "/convert/images";
  }
  if (["pdf"].includes(lower)) {
    return "/pdf-tools";
  }
  if (["docx", "doc", "txt", "html", "rtf", "md", "xlsx", "pptx"].includes(lower)) {
    return "/convert/documents";
  }
  if (["mp3", "wav", "aac", "flac", "ogg", "m4a"].includes(lower)) {
    return "/convert/audio";
  }
  if (["mp4", "webm", "mov", "mkv", "avi"].includes(lower)) {
    return "/convert/video";
  }
  if (["json", "csv", "xml", "yaml", "toml"].includes(lower)) {
    return "/convert/data";
  }
  if (["zip", "7z", "tar"].includes(lower)) {
    return "/tools/archive";
  }
  return "/convert";
}

export default function HomePage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const handleFile = (file: File) => {
    const ext = getFileExtension(file.name);
    const meta = getFormatMetadata(ext);

    toast.success(`Detected ${meta?.name || ext.toUpperCase()} file`);

    switch (meta?.category) {
      case "image":
        router.push("/convert/images");
        break;
      case "document":
        router.push("/convert/documents");
        break;
      case "audio":
        router.push("/convert/audio");
        break;
      case "video":
        router.push("/convert/video");
        break;
      case "data":
        router.push("/convert/data");
        break;
      case "archive":
        router.push("/tools/archive");
        break;
      default:
        if (ext === "pdf") {
          router.push("/pdf-tools");
        } else {
          router.push("/convert");
        }
        break;
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const triggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const CONVERT_CATEGORIES = [
    { title: "Images", desc: "JPG, PNG, WEBP, AVIF", href: "/convert/images", icon: FileImage, color: "text-blue-500 bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Documents", desc: "DOCX, TXT, HTML, RTF", href: "/convert/documents", icon: FileText, color: "text-amber-500 bg-amber-500/10", border: "border-amber-500/20" },
    { title: "PDF Suite", desc: "PDF to Image, Merge & Text", href: "/pdf-tools", icon: FileText, color: "text-red-500 bg-red-500/10", border: "border-red-500/20" },
    { title: "Audio", desc: "MP3, WAV, AAC, FLAC", href: "/convert/audio", icon: Music, color: "text-emerald-500 bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "Video", desc: "MP4, WebM, MOV, GIF", href: "/convert/video", icon: Video, color: "text-violet-500 bg-violet-500/10", border: "border-violet-500/20" },
    { title: "Data", desc: "JSON, CSV, XML, Tables", href: "/convert/data", icon: FileCode, color: "text-cyan-500 bg-cyan-500/10", border: "border-cyan-500/20" },
    { title: "Archives", desc: "Create & Extract ZIP", href: "/tools/archive", icon: Archive, color: "text-indigo-500 bg-indigo-500/10", border: "border-indigo-500/20" },
  ];

  const QUICK_SHORTCUTS = [
    { label: "Photos & Images", href: "/convert/images", icon: FileImage, color: "text-blue-400 bg-blue-500/10" },
    { label: "AI Photo Enhancer", href: "/tools/enhance", icon: Sparkles, color: "text-purple-400 bg-purple-500/10", isNew: true },
    { label: "PDF Tools", href: "/pdf-tools", icon: FileText, color: "text-red-400 bg-red-500/10" },
    { label: "Documents", href: "/convert/documents", icon: FileText, color: "text-amber-400 bg-amber-500/10" },
    { label: "Audio & Music", href: "/convert/audio", icon: Music, color: "text-emerald-400 bg-emerald-500/10" },
    { label: "Video Clips", href: "/convert/video", icon: Video, color: "text-violet-400 bg-violet-500/10" },
    { label: "File Compressor", href: "/compress", icon: Minimize2, color: "text-teal-400 bg-teal-500/10" },
    { label: "ZIP Archives", href: "/tools/archive", icon: Archive, color: "text-indigo-400 bg-indigo-500/10" },
  ];

  const FEATURED_TOOLS = [
    { title: "AI Photo Enhancer", desc: "Calibrate exposure, shadows & upscale to 4K", href: "/tools/enhance", icon: Sparkles, color: "text-purple-400 bg-purple-500/10", badge: "NEW" },
    { title: "PDF to Image", desc: "Extract crisp PNG, JPG or WebP pages", href: "/pdf-tools?tab=pdf-to-image", icon: FileImage, color: "text-blue-400 bg-blue-500/10", badge: "HOT" },
    { title: "File Compressor", desc: "Reduce filesize up to 90% without loss", href: "/compress", icon: Minimize2, color: "text-emerald-400 bg-emerald-500/10" },
    { title: "Merge PDF", desc: "Combine multiple PDF documents seamlessly", href: "/pdf-tools", icon: Layers, color: "text-red-400 bg-red-500/10" },
    { title: "Image Converter", desc: "Convert WebP, AVIF, PNG, JPG, SVG", href: "/convert/images", icon: Maximize2, color: "text-cyan-400 bg-cyan-500/10" },
    { title: "Video to MP3", desc: "Extract high-bitrate audio from video clips", href: "/convert/video", icon: Music, color: "text-violet-400 bg-violet-500/10" },
    { title: "ZIP Studio", desc: "Create and inspect ZIP bundles in browser", href: "/tools/archive", icon: Archive, color: "text-indigo-400 bg-indigo-500/10" },
    { title: "JSON / CSV Data", desc: "Convert datasets with live preview tables", href: "/convert/data", icon: FileCode, color: "text-amber-400 bg-amber-500/10" },
  ];

  const MARQUEE_TAGS = [
    "WEBP", "AVIF", "PNG", "JPG", "PDF", "DOCX", "MP3", "WAV",
    "MP4", "WebM", "CSV", "JSON", "XML", "ZIP", "GIF", "SVG",
    "MOV", "AAC", "FLAC", "OGG", "HEIC", "ICO", "BMP", "TIFF",
    "XLSX", "HTML", "TXT", "7Z"
  ];

  return (
    <div className="homepage-shell w-full max-w-6xl mx-auto py-8 md:py-14 px-4 sm:px-6 space-y-16 md:space-y-24 overflow-hidden">
      
      {/* ── 1. Hero Section ── */}
      <section className="relative flex flex-col items-center justify-center text-center py-6 md:py-12 min-h-[460px]">
        {/* Ambient background glow centered */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[340px] bg-primary/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="relative z-10 max-w-3xl flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: smoothEase }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-extrabold tracking-wide mb-5 border border-primary/20 shadow-sm"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2.5 }}
              className="inline-flex"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </motion.span>
            <span>Next-Generation Private File Utility</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: smoothEase }}
            className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-[-0.05em] leading-[1.05] text-foreground text-center"
          >
            Transform files, <br />
            <span className="bg-gradient-to-r from-pink-500 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
              100% in your browser.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: smoothEase }}
            className="mt-5 text-sm sm:text-base leading-7 text-muted-foreground max-w-2xl text-center mx-auto"
          >
            Switchr converts, compresses, and enhances your files with near-instant WebAssembly speed. Zero server uploads, zero quotas, and total confidentiality.
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: smoothEase }}
            className="mt-7 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/convert"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Start converting</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              href="/tools/enhance"
              className="inline-flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3.5 text-sm font-bold text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-sm group"
            >
              <Sparkles className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
              <span>AI Photo Enhancer</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 font-extrabold">NEW</span>
            </Link>

            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/70 px-4 py-3.5 text-sm font-bold text-foreground hover:border-primary/40 hover:bg-muted/60 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <span>Explore tools (30+)</span>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32, ease: smoothEase }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-semibold text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Private (0 Server Bytes)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              No Account Required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-sky-500" />
              Works Offline
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Interactive Stats Bar ── */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        variants={containerVariants}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3.5"
      >
        {([
          { label: "File Formats",  value: "200+", href: "/convert", desc: "Images, video, audio & docs", icon: FileCode,     color: "text-violet-500", bg: "bg-violet-500/10", border: "hover:border-violet-500/40" },
          { label: "Offline Tools", value: "30+",  href: "/tools",   desc: "Enhance, compress & merge",    icon: Settings2,    color: "text-blue-500",   bg: "bg-blue-500/10",   border: "hover:border-blue-500/40"   },
          { label: "Always Free",   value: "100%", href: "/about",   desc: "No caps, paywalls or quotas",  icon: CheckCircle2, color: "text-emerald-500",bg: "bg-emerald-500/10",border: "hover:border-emerald-500/40"},
          { label: "Zero Tracking", value: "0%",   href: "/about",   desc: "Files stay on your machine",   icon: ShieldCheck,  color: "text-amber-500",  bg: "bg-amber-500/10",  border: "hover:border-amber-500/40"  },
        ] as const).map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 400 } }}
            >
              <Link
                href={stat.href}
                className={`stat-card relative flex flex-col items-center justify-center p-5 rounded-2xl border border-border/70 bg-card/75 backdrop-blur-sm text-center overflow-hidden gap-1 transition-all ${stat.border} hover:shadow-lg block group`}
              >
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-1 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-2xl font-black tracking-tight text-foreground">{stat.value}</span>
                <span className="text-xs font-bold text-foreground">{stat.label}</span>
                <span className="text-[10px] text-muted-foreground">{stat.desc}</span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── 3. Quick Launch Shortcut Bar ── */}
      <div ref={dropzoneRef} className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        {/* Quick Launch Shortcut Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {QUICK_SHORTCUTS.map((shortcut) => {
            const Icon = shortcut.icon;
            return (
              <Link
                key={shortcut.label}
                href={shortcut.href}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/70 bg-card/70 hover:bg-muted/70 hover:border-primary/40 text-xs font-bold text-foreground transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center ${shortcut.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{shortcut.label}</span>
                {shortcut.isNew && (
                  <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-400 text-[9px] font-black uppercase">
                    NEW
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── 4. Flagship Tools Bento Grid ── */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={containerVariants}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 border-b border-border/70 pb-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Powerful Utilities</p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Flagship Superpowers</h2>
          </div>
          <Link
            href="/tools"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group"
          >
            <span>View all 30+ tools</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Bento Card 1: AI Photo Enhancer (Featured Span 2 on large) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 relative rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/20 via-card to-card p-6 sm:p-7 flex flex-col justify-between overflow-hidden group shadow-xl hover:border-purple-500/50 transition-all"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10 group-hover:bg-purple-500/20 transition-all duration-700" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-extrabold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Flagship AI Feature</span>
                </div>
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Client-Side Engine
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-foreground">
                  AI Photo Enhancer & Super-Resolution
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed max-w-xl">
                  Accurately calibrate exposure, highlights, shadows, vibrance, and white balance with 14 tone sliders, real-time live RGB histogram, and 2x/4x upscale clarity.
                </p>
              </div>

              {/* Feature Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background/70 border border-border/80 text-[11px] font-semibold text-foreground">
                  <SlidersHorizontal className="w-3 h-3 text-purple-400" />
                  14 Tone Controls
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background/70 border border-border/80 text-[11px] font-semibold text-foreground">
                  <Maximize2 className="w-3 h-3 text-purple-400" />
                  2x & 4x Super-Res
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background/70 border border-border/80 text-[11px] font-semibold text-foreground">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Zero Server Upload
                </span>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">Try it on JPG, PNG, or WebP photos</span>
              <Link
                href="/tools/enhance"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all hover:-translate-y-0.5"
              >
                <span>Launch Enhancer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Bento Card 2: PDF Management Suite */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-3xl border border-red-500/25 bg-gradient-to-br from-red-950/15 via-card to-card p-6 flex flex-col justify-between overflow-hidden group shadow-lg hover:border-red-500/40 transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">
                  Vector Engine
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-foreground">PDF Suite & Extraction</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Extract high-res PNG/JPG images from multi-page PDFs, compile photos to PDF, and merge documents.
                </p>
              </div>

              <div className="space-y-1.5 pt-1 text-xs text-foreground/90 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                  <span>PDF to Images (ZIP package)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Combine & Merge PDF pages</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border/70 flex items-center justify-between">
              <Link
                href="/pdf-tools?tab=pdf-to-image"
                className="text-xs font-bold text-red-400 hover:underline"
              >
                PDF to Image
              </Link>
              <Link
                href="/pdf-tools"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border hover:border-red-400/50 text-xs font-bold text-foreground transition-all hover:bg-muted"
              >
                <span>Open Suite</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>

          {/* Bento Card 3: File Compressor */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/15 via-card to-card p-6 flex flex-col justify-between overflow-hidden group shadow-lg hover:border-emerald-500/40 transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Minimize2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Up to -90%
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-foreground">Lossless File Compressor</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Shrink heavy images, documents, and PDFs down to email-friendly file sizes without noticeable fidelity loss.
                </p>
              </div>

              <div className="space-y-1.5 pt-1 text-xs text-foreground/90 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Smart adaptive quantization</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Batch compress multiple files</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border/70 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">All formats</span>
              <Link
                href="/compress"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border hover:border-emerald-400/50 text-xs font-bold text-foreground transition-all hover:bg-muted"
              >
                <span>Compress</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>

          {/* Bento Card 4: Archive Studio */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 relative rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/15 via-card to-card p-6 flex flex-col justify-between overflow-hidden group shadow-lg hover:border-indigo-500/40 transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <Archive className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  ZIP Studio
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-foreground">ZIP Archive Creator & Extractor</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-xl">
                  Inspect archive contents directly in browser memory without extracting to disk, or package multiple files into clean ZIP bundles with single-click download.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="px-2.5 py-1 rounded-md bg-muted/60 border border-border/70 text-foreground">
                  Unpack ZIP archives
                </span>
                <span className="px-2.5 py-1 rounded-md bg-muted/60 border border-border/70 text-foreground">
                  Package bundles
                </span>
                <span className="px-2.5 py-1 rounded-md bg-muted/60 border border-border/70 text-foreground">
                  Multi-file support
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border/70 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Private client-side extraction</span>
              <Link
                href="/tools/archive"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-card border border-border hover:border-indigo-400/50 text-xs font-bold text-foreground transition-all hover:bg-muted"
              >
                <span>Open Archive Studio</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* ── 5. How It Works ── */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={containerVariants}
        className="space-y-8"
      >
        <motion.div variants={fadeUp} custom={0} className="text-center space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Simple Process</p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">How Switchr works</h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">Three seamless steps to transform any file. Zero technical skills required.</p>
        </motion.div>

        <div className="relative grid sm:grid-cols-3 gap-4">
          <div className="absolute top-[4.25rem] left-[33%] right-[33%] hidden sm:block pointer-events-none z-0">
            <div className="how-connector" />
          </div>
          {([
            { step: "01", title: "Drop your file",     desc: "Drag & drop or click to select. Format and metadata are detected instantly.", icon: Upload,    color: "text-blue-500",    bg: "from-blue-500/15 to-blue-600/5",      border: "border-blue-500/20", onClick: triggerUpload },
            { step: "02", title: "Choose output",      desc: "Pick from 200+ supported formats or use one of 30+ precision presets.",     icon: Settings2, color: "text-violet-500",  bg: "from-violet-500/15 to-violet-600/5",  border: "border-violet-500/20", href: "/convert" },
            { step: "03", title: "Download instantly", desc: "Converted right in browser memory. No queue wait, no tracking, no limits.", icon: Download,  color: "text-emerald-500", bg: "from-emerald-500/15 to-emerald-600/5", border: "border-emerald-500/20", href: "/history" },
          ] as const).map((item, i) => {
            const Icon = item.icon;
            const content = (
              <div className={`relative z-10 p-6 rounded-2xl border ${item.border} bg-gradient-to-br ${item.bg} backdrop-blur-sm flex flex-col items-center text-center gap-3 h-full transition-all group cursor-pointer hover:shadow-lg`}>
                <div className="text-[10px] font-black tracking-[0.18em] text-muted-foreground/60 uppercase mb-1">{item.step}</div>
                <div className={`w-14 h-14 rounded-2xl bg-card border ${item.border} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground text-sm group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );

            return (
              <motion.div
                key={item.step}
                variants={itemVariants}
                custom={i}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 350 } }}
              >
                {"onClick" in item ? (
                  <button type="button" onClick={item.onClick} className="w-full text-left">
                    {content}
                  </button>
                ) : (
                  <Link href={item.href} className="block w-full">
                    {content}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── 6. Interactive Format Transformation & Quality Comparison ── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: smoothEase }}
      >
        <FormatTransformationShowcase />
      </motion.section>

      {/* ── 7. Major Categories: Convert by Format ── */}
      <motion.div
        id="convert"
        className="content-section content-section-formats space-y-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={containerVariants}
      >
        <motion.div
          variants={fadeUp}
          custom={0}
          className="section-heading flex items-center justify-between border-b border-border/70 pb-3"
        >
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
              Convert by Format
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Explore our high-speed client-side converter suites</p>
          </div>
          <Link
            href="/convert"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group"
          >
            <span>All Converters</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {CONVERT_CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.title}
                variants={itemVariants}
                custom={i}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 350, damping: 18 } }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href={cat.href}
                  className={`format-card p-4 border rounded-2xl flex flex-col items-center text-center gap-2 group block bg-card/75 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg`}
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${cat.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{cat.title}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{cat.desc}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── 8. Featured Tools Grid ── */}
      <motion.div
        className="content-section content-section-tools space-y-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={containerVariants}
      >
        <motion.div
          variants={fadeUp}
          custom={0}
          className="section-heading flex items-center justify-between border-b border-border/70 pb-3"
        >
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
              Featured Tools Suite
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Specialized offline utilities for everyday workflows</p>
          </div>
          <Link
            href="/tools"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group"
          >
            <span>All Tools Directory</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {FEATURED_TOOLS.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.title}
                variants={itemVariants}
                custom={i}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 350, damping: 18 } }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href={tool.href}
                  className="quick-tool-card p-4 sm:p-5 border border-border/70 rounded-2xl flex items-center gap-3.5 group block bg-card/75 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg transition-all"
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tool.color} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {tool.title}
                      </h4>
                      {"badge" in tool && tool.badge && (
                        <span className="px-1.5 py-0.2 rounded-full bg-primary/20 text-primary text-[9px] font-black shrink-0">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">{tool.desc}</p>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── 9. Why Switchr – Feature Grid ── */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={containerVariants}
        className="space-y-8"
      >
        <motion.div variants={fadeUp} custom={0} className="text-center space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Why Switchr</p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Built different, by design</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">Every architectural decision puts you in complete control of your data.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {([
            { title: "100% Private",   desc: "Files never leave your device. Everything runs client-side inside your browser sandbox.",  icon: Lock,         gradient: "from-emerald-500 to-teal-500",  bg: "bg-emerald-500/8", border: "border-emerald-500/20", graphic: "/graphics/graphic-vault.jpg" },
            { title: "No Size Limits", desc: "No file-size caps, no daily quotas, no paywalls. Process as many gigabytes as you need.", icon: Zap,          gradient: "from-amber-500 to-orange-500",  bg: "bg-amber-500/8",   border: "border-amber-500/20", graphic: "/graphics/graphic-unlimited.jpg" },
            { title: "Lightning Fast", desc: "Powered by WebAssembly & hardware native threads for near-instant execution.",             icon: Cpu,          gradient: "from-blue-500 to-indigo-500",   bg: "bg-blue-500/8",    border: "border-blue-500/20", graphic: "/graphics/graphic-speed.jpg" },
            { title: "Works Offline",  desc: "No internet connection required after initial page load. Your tools stay with you.",       icon: Globe,        gradient: "from-violet-500 to-purple-500", bg: "bg-violet-500/8",  border: "border-violet-500/15" },
            { title: "Zero Account",   desc: "No registration, no credit card, no sign-ups. Free public utility for everyone.",          icon: CheckCircle2, gradient: "from-pink-500 to-rose-500",     bg: "bg-pink-500/8",    border: "border-pink-500/15" },
            { title: "Instant Results",desc: "Real-time stream conversion with zero waiting queues or artificial download timers.",       icon: RefreshCw,    gradient: "from-cyan-500 to-sky-500",      bg: "bg-cyan-500/8",    border: "border-cyan-500/15" },
          ] as const).map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                variants={itemVariants}
                custom={i}
                whileHover={{ y: -5, scale: 1.01, transition: { type: "spring", stiffness: 350 } }}
                className={`feature-card relative p-5 rounded-2xl border ${feat.border} ${feat.bg} backdrop-blur-sm overflow-hidden group flex flex-col justify-between`}
              >
                <div className="feature-card-shimmer" />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {"graphic" in feat && feat.graphic && (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/20 shadow-md group-hover:scale-110 transition-transform duration-300">
                        <Image
                          src={feat.graphic}
                          alt={feat.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <h3 className="font-extrabold text-foreground text-sm mb-1">{feat.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── 10. Privacy Architecture Infographic ── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: smoothEase }}
      >
        <PrivacyArchitectureGraphic />
      </motion.section>

      {/* ── 11. Interactive Scrolling Format Marquee ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-center gap-2">
          <p className="text-center text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">
            200+ formats supported — Click any format to start
          </p>
        </div>
        <div className="marquee-container relative overflow-hidden">
          <div className="marquee-track">
            {[...MARQUEE_TAGS, ...MARQUEE_TAGS].map((tag, i) => {
              const route = getRouteForExtension(tag);
              return (
                <Link
                  key={`${tag}-${i}`}
                  href={route}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-bold border border-border/70 bg-card/80 text-muted-foreground whitespace-nowrap backdrop-blur-sm hover:border-primary/50 hover:text-primary hover:bg-muted/70 transition-all cursor-pointer shadow-sm active:scale-95"
                  title={`Convert .${tag} files`}
                >
                  .{tag}
                </Link>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── 12. Bottom High-Impact Call to Action ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: smoothEase }}
        className="relative rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-8 sm:p-12 text-center overflow-hidden shadow-2xl"
      >
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant & Confidential</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Ready to convert your files?
          </h2>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Join thousands of users converting photos, documents, and media locally in their browsers with zero software installation and complete privacy.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/convert"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Start Converting Free</span>
            </Link>

            <Link
              href="/tools/enhance"
              className="inline-flex items-center gap-2 rounded-xl border border-purple-500/40 bg-purple-500/10 px-5 py-3.5 text-sm font-bold text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/60 hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Photo Enhancer</span>
            </Link>

            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-bold text-foreground hover:bg-muted transition-all"
            >
              <span>Explore All 30+ Tools</span>
            </Link>
          </div>
        </div>
      </motion.div>

    </div>
  );
}

