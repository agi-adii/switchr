import { ToolJsonLd } from "@/components/seo/json-ld";
import { ToolSeoContent } from "@/components/seo/tool-seo-content";
"use client";

import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  FileImage,
  FileText,
  Video,
  Music,
  Archive,
  FileCode,
  ArrowRight,
  Sparkles,
  Layers,
} from "lucide-react";
import { PSEO_PAIRS } from "@/lib/pseo-registry";
import { motion, type Variants } from "framer-motion";

const smoothEase = [0.16, 1, 0.3, 1] as const;

const TOOL_GROUPS = [
  {
    category: "Image Tools",
    badge: "Visual & Photos",
    tools: [
      { name: "AI Photo Enhancer", desc: "Real-ESRGAN neural super-resolution, dynamic range & tone calibration", href: "/tools/enhance", icon: Sparkles, tag: "AI" },
      { name: "Image Converter", desc: "Convert JPG, PNG, WEBP, SVG, and BMP", href: "/convert/images", icon: FileImage },
      { name: "Image Compressor", desc: "Reduce photo file sizes with smart adaptive compression", href: "/compress", icon: FileImage },
      { name: "Image to PDF", desc: "Compile single or multiple photos into PDF", href: "/pdf-tools", icon: FileText },
    ],
  },
  {
    category: "PDF Tools",
    badge: "Documents",
    tools: [
      { name: "PDF to Image", desc: "Extract high-resolution PNG, JPG, or WebP images", href: "/pdf-tools?tab=pdfToImage", icon: FileImage },
      { name: "Multi-Image to PDF", desc: "Compile photos and HEIC scans into a polished PDF", href: "/pdf-tools?tab=images", icon: FileText },
      { name: "Password Protect PDF", desc: "Encrypt and secure PDF documents with custom passwords", href: "/pdf-tools?tab=protect", icon: FileText },
      { name: "Unlock PDF", desc: "Remove passwords and security restrictions from PDFs", href: "/pdf-tools?tab=unlock", icon: FileText },
      { name: "Text to PDF", desc: "Create clean PDF documents from plain text", href: "/pdf-tools?tab=text", icon: FileText },
      { name: "Compress PDF", desc: "Reduce PDF document file size with calibrated quality", href: "/compress", icon: FileText },
    ],
  },
  {
    category: "Media Tools",
    badge: "Audio & Video",
    tools: [
      { name: "Audio Converter", desc: "Convert MP3, WAV, AAC, and more", href: "/convert/audio", icon: Music },
      { name: "Video Converter", desc: "Convert MP4, WebM, MOV, and MKV", href: "/convert/video", icon: Video },
      { name: "Video to MP3", desc: "Extract audio sound from video clips", href: "/convert/video", icon: Music },
      { name: "Video to GIF", desc: "Make short animated GIF loops", href: "/convert/video", icon: Video },
    ],
  },
  {
    category: "File & Archive Tools",
    badge: "Packaging",
    tools: [
      { name: "ZIP Creator", desc: "Package multiple files into a clean archive", href: "/tools/archive", icon: Archive },
      { name: "ZIP Extractor", desc: "Unpack and inspect ZIP files in browser", href: "/tools/archive", icon: Archive },
    ],
  },
  {
    category: "Data Tools",
    badge: "Code & Structured",
    tools: [
      { name: "JSON to CSV", desc: "Convert JSON array to spreadsheet rows", href: "/convert/data", icon: FileCode },
      { name: "CSV to JSON", desc: "Convert spreadsheet tables to JSON", href: "/convert/data", icon: FileCode },
      { name: "XML Converter", desc: "Convert XML structure into clean JSON", href: "/convert/data", icon: FileCode },
    ],
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
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

const groupVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: smoothEase },
  },
};


const TOOLS_HOW_TO_STEPS = [
  {
    name: "Select Desired Tool",
    text: "Browse our directory of in-browser tools: AI Photo Enhancer, PDF Suite, File Compressor, Archive Studio, or Multi-Format Converters.",
  },
  {
    name: "Upload Files Instantly",
    text: "Drag and drop your photos, videos, audio tracks, PDFs, or data spreadsheets directly into the tool.",
  },
  {
    name: "Download Locally Processed Results",
    text: "Experience near-instant processing via WebAssembly with zero file uploads to any cloud server.",
  },
];

const TOOLS_FAQS = [
  {
    question: "Are all Switchr tools completely free to use?",
    answer: "Yes, 100% free forever. There are no subscriptions, daily quotas, credit tokens, or promotional watermarks.",
  },
  {
    question: "How does Switchr guarantee 100% data privacy?",
    answer: "Every computation, conversion, compression, and neural network inference executes entirely inside your browser memory sandbox using WebAssembly, WebGPU, and HTML5 Canvas. Your files never leave your device.",
  },
  {
    question: "Do Switchr tools work without an active internet connection?",
    answer: "Yes! Switchr is built as a Progressive Web App (PWA). Once cached in your browser, core converter engines and tools work completely offline.",
  },
  {
    question: "What are the file size limits for conversion and compression?",
    answer: "Switchr has no arbitrary file caps. Processing capacity is determined solely by your computer or phone's available RAM memory.",
  },
  {
    question: "What formats and codecs are supported?",
    answer: "Over 200 formats across images (WebP, PNG, JPG, AVIF, HEIC, SVG), video (MP4, WebM, MOV, MKV, GIF), audio (MP3, WAV, FLAC, OGG, AAC), documents (PDF, DOCX, PPTX), archives (ZIP, TAR), and data (JSON, CSV, XML).",
  },
];

export default function ToolsDirectoryPage() {
  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <Breadcrumbs items={[{ label: "Tools" }]} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center space-y-2 mb-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.06 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold mb-2 backdrop-blur-md shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
          Complete Tool Index
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          All Switchr Tools
        </h1>
        <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto leading-relaxed">
          Every tool is completely free, runs client-side fast, and requires zero account creation.
        </p>
      </motion.div>

      <div className="space-y-12">
        {TOOL_GROUPS.map((group, gi) => (
          <motion.div
            key={group.category}
            variants={groupVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: gi * 0.04 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>{group.category}</span>
                {group.badge && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/70">
                    {group.badge}
                  </span>
                )}
              </h2>
              <span className="text-xs font-semibold text-white/60">
                {group.tools.length} tools
              </span>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-30px" }}
            >
              {group.tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={tool.name}
                    variants={cardVariants}
                    whileHover={{ y: -4, transition: { type: "spring", stiffness: 330, damping: 18 } }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={tool.href}
                      className="p-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-sm hover:border-white/40 hover:bg-white/15 hover:shadow-xl hover:shadow-white/5 transition-all duration-300 flex flex-col justify-between group block h-full relative overflow-hidden"
                    >
                      {/* Top highlight refraction line */}
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

                      {/* Ambient soft glow on hover */}
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none group-hover:bg-white/10 transition-all duration-500" />

                      <div className="space-y-3 relative z-10">
                        <div className="flex items-center justify-between">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 6 }}
                            transition={{ type: "spring", stiffness: 280, damping: 14 }}
                            className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 text-white flex items-center justify-center shadow-xs group-hover:bg-white/25 group-hover:border-white/30 transition-all"
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </motion.div>
                          {tool.tag && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/15 border border-white/20 text-white/90">
                              {tool.tag}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-white transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-xs text-white/70 mt-1 leading-relaxed line-clamp-2">
                            {tool.desc}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 mt-4 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-white/90 group-hover:text-white relative z-10">
                        <span>Open Tool</span>
                        <motion.span
                          className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-white/20 border border-white/15 group-hover:border-white/25 flex items-center justify-center transition-colors"
                          whileHover={{ x: 2 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                        </motion.span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* ── HTML Sitemap Directory: All Dedicated Conversion Pairs ── */}
      <section className="pt-8 border-t border-border space-y-4" aria-label="Conversion Directory">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Direct Format Conversion Pages (HTML Directory)
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Index of dedicated single-purpose converter engines. Statically rendered with in-browser WebAssembly execution.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {PSEO_PAIRS.map((pair) => (
            <Link
              key={pair.slug}
              href={`/convert/${pair.slug}`}
              className="p-3.5 rounded-2xl bg-card border border-border hover:border-primary/50 hover:bg-muted/40 transition-all text-center group block shadow-xs"
            >
              <span className="text-xs font-bold text-foreground block group-hover:text-primary transition-colors">
                {pair.fromFormat} &rarr; {pair.toFormat}
              </span>
              <span className="text-[10px] text-muted-foreground block mt-0.5">
                {pair.category.toUpperCase()} • Free
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Search Engine Rich Snippet JSON-LD & High-Authority SEO Content ── */}
      <ToolJsonLd
        name="Free In-Browser File Tools & PDF Utilities Directory"
        description="Comprehensive directory of free in-browser file utilities: AI photo enhancer, PDF editor, smart compression, and multi-format converters."
        url="/tools"
        category="UtilitiesApplication"
        features={[
          "AI Photo Enhancer & 4K Upscaler (Real-ESRGAN)",
          "Complete PDF Management Suite (Merge, Split, Protect, Unlock)",
          "Smart File Compressor (Images & PDFs)",
          "ZIP & TAR Archive Studio",
          "Universal Media & Data Converters",
          "100% In-Browser execution with zero server uploads",
        ]}
        howTo={TOOLS_HOW_TO_STEPS}
        faqs={TOOLS_FAQS}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
        ]}
      />

      <ToolSeoContent
        toolName="Switchr Utilities Suite"
        badge="100% In-Browser & Private"
        heading="Free Online File Tools & PDF Utilities Directory"
        subheading="A complete collection of client-side productivity utilities powered by WebAssembly, WebGPU, and modern web standards."
        overviewParagraphs={[
          "Switchr brings professional-grade desktop utility features into a fast, beautiful, and completely private web application. Whether you need neural super-resolution to restore old family photographs, enterprise PDF encryption to secure legal agreements, lossless file compression to meet email limits, or quick data formatting between JSON and CSV, you can accomplish it all in your browser.",
          "By processing every file locally on your device hardware, Switchr eliminates cloud storage risks, subscription fees, and slow network upload bottlenecks. Bookmark this directory or install Switchr as a Progressive Web App (PWA) to keep essential productivity tools at your fingertips anywhere, even offline.",
        ]}
        steps={TOOLS_HOW_TO_STEPS}
        faqs={TOOLS_FAQS}
        relatedLinks={[
          { label: "AI Photo Enhancer", href: "/tools/enhance", desc: "4K neural upscaler & tone restoration.", badge: "AI" },
          { label: "PDF Tools Suite", href: "/pdf-tools", desc: "Merge, split, protect, and extract PDF pages.", badge: "Top" },
          { label: "Smart File Compressor", href: "/compress", desc: "Shrink image and PDF files by up to 80%." },
          { label: "Archive Studio", href: "/tools/archive", desc: "Unpack and create ZIP archives." },
          { label: "Image Converter", href: "/convert/images", desc: "Transform WebP, PNG, JPG, and HEIC photos." },
          { label: "Video Converter", href: "/convert/video", desc: "Convert MP4, WebM, MOV, and GIFs." },
        ]}
      />
    </div>
  );
}
