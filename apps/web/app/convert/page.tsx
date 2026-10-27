"use client";

import { useState } from "react";
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
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { PSEO_PAIRS } from "@/lib/pseo-registry";

const smoothEase = [0.16, 1, 0.3, 1] as const;

type ToolCategory = "all" | "image" | "pdf" | "media" | "data" | "archive";

interface ToolItem {
  id: string;
  title: string;
  desc: string;
  href: string;
  icon: any;
  accent: string;
  buttonText: string;
  formats: string[];
  category: ToolCategory;
  badge?: string;
}

const ALL_TOOLS: ToolItem[] = [
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

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: smoothEase },
  },
};

export default function ConvertHubPage() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("all");

  const filteredTools =
    selectedCategory === "all"
      ? ALL_TOOLS
      : ALL_TOOLS.filter((t) => t.category === selectedCategory);

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-12">
      <div>
        <Breadcrumbs items={[{ label: "Convert" }]} />

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-3 mb-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold mb-1 backdrop-blur-md shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Complete Transformation Suite</span>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Select What You Want to Convert
          </h1>
          <p className="text-xs sm:text-sm text-white/70 max-w-2xl mx-auto leading-relaxed">
            Every tool runs 100% in your browser using WebAssembly and hardware acceleration. Zero server uploads, zero quotas, and instant downloads.
          </p>

          {/* Interactive Category Filter Pills */}
          <div className="pt-4 flex justify-center">
            <GlassPillTabs<ToolCategory>
              activeTab={selectedCategory}
              onChange={(id) => setSelectedCategory(id)}
              layoutId="convertFilterTab"
              tabs={[
                { id: "all", label: `All Tools (${ALL_TOOLS.length})` },
                { id: "image", label: "Image & AI" },
                { id: "pdf", label: "PDF Suite" },
                { id: "media", label: "Audio & Video" },
                { id: "data", label: "Data & Docs" },
                { id: "archive", label: "ZIP & System" },
              ]}
            />
          </div>
        </motion.div>

        {/* Full Tools Grid matching Reference Card Design */}
        <motion.div
          key={selectedCategory}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredTools.map((tool) => {
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

      {/* ── Popular Dedicated Converters (pSEO Internal Links) ── */}
      <section className="pt-8 border-t border-white/15 space-y-6">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Targeted 1-Click Converters</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Popular Conversions
          </h2>
          <p className="text-xs text-white/65 max-w-lg mx-auto">
            Direct dedicated tools for high-frequency conversions with instant presets, zero server upload, and rich settings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          {PSEO_PAIRS.map((pair) => (
            <Link
              key={pair.slug}
              href={`/convert/${pair.slug}`}
              className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all group flex flex-col justify-between space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-amber-200 transition-colors">
                  {pair.fromFormat} &rarr; {pair.toFormat}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/15 text-white/80 uppercase">
                  {pair.category}
                </span>
              </div>
              <p className="text-[11px] text-white/65 line-clamp-2 leading-snug">
                {pair.subtitle}
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-white/90 group-hover:text-white">
                <span>Launch Tool</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
