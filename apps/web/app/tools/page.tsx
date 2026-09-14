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
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

const smoothEase = [0.16, 1, 0.3, 1] as const;

const TOOL_GROUPS = [
  {
    category: "Image Tools",
    badge: "Visual & Photos",
    tools: [
      { name: "AI Photo Enhancer", desc: "Restore detail, expand dynamic range & upscale to 4K", href: "/tools/enhance", icon: Sparkles, tag: "AI" },
      { name: "Image Converter", desc: "Convert JPG, PNG, WEBP, SVG, and BMP", href: "/convert/images", icon: FileImage },
      { name: "Image Compressor", desc: "Reduce photo file sizes without quality loss", href: "/compress", icon: FileImage },
      { name: "Image to PDF", desc: "Compile single or multiple photos into PDF", href: "/pdf-tools", icon: FileText },
    ],
  },
  {
    category: "PDF Tools",
    badge: "Documents",
    tools: [
      { name: "PDF to Image", desc: "Extract high-resolution PNG, JPG, or WebP images", href: "/pdf-tools?tab=pdf-to-image", icon: FileImage },
      { name: "Image to PDF", desc: "Compile single or multiple photos into PDF", href: "/pdf-tools", icon: FileText },
      { name: "Merge & Organize PDF", desc: "Combine multiple pages or reorder sequence", href: "/pdf-tools", icon: FileText },
      { name: "Text to PDF", desc: "Create clean PDF documents from plain text", href: "/pdf-tools", icon: FileText },
      { name: "Compress PDF", desc: "Reduce PDF document filesize", href: "/compress", icon: FileText },
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
    </div>
  );
}
