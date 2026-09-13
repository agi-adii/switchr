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
    tools: [
      { name: "AI Photo Enhancer", desc: "Restore detail, expand dynamic range & upscale to 4K", href: "/tools/enhance", icon: Sparkles },
      { name: "Image Converter", desc: "Convert JPG, PNG, WEBP, SVG, and BMP", href: "/convert/images", icon: FileImage },
      { name: "Image Compressor", desc: "Reduce photo file sizes without quality loss", href: "/compress", icon: FileImage },
      { name: "Image to PDF", desc: "Compile single or multiple photos into PDF", href: "/pdf-tools", icon: FileText },
    ],
  },
  {
    category: "PDF Tools",
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
    tools: [
      { name: "Audio Converter", desc: "Convert MP3, WAV, AAC, and more", href: "/convert/audio", icon: Music },
      { name: "Video Converter", desc: "Convert MP4, WebM, MOV, and MKV", href: "/convert/video", icon: Video },
      { name: "Video to MP3", desc: "Extract audio sound from video clips", href: "/convert/video", icon: Music },
      { name: "Video to GIF", desc: "Make short animated GIF loops", href: "/convert/video", icon: Video },
    ],
  },
  {
    category: "File & Archive Tools",
    tools: [
      { name: "ZIP Creator", desc: "Package multiple files into a clean archive", href: "/tools/archive", icon: Archive },
      { name: "ZIP Extractor", desc: "Unpack and inspect ZIP files in browser", href: "/tools/archive", icon: Archive },
    ],
  },
  {
    category: "Data Tools",
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
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Complete Tool Index
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          All Switchr Tools
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Every tool is completely free, runs client-side fast, and requires zero account creation.
        </p>
      </motion.div>

      <div className="space-y-10">
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
            <h2 className="text-base font-extrabold text-foreground border-b border-border pb-2">
              {group.category}
            </h2>
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
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link
                      href={tool.href}
                      className="p-4 bg-card border border-border rounded-2xl shadow-sm hover:border-primary/60 hover:shadow-md transition-colors flex flex-col justify-between group block h-full"
                    >
                      <div className="space-y-2">
                        <motion.div
                          whileHover={{ scale: 1.12, rotate: 6 }}
                          transition={{ type: "spring", stiffness: 280, damping: 14 }}
                          className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center"
                        >
                          <Icon className="w-4 h-4" />
                        </motion.div>
                        <h3 className="text-xs sm:text-sm font-bold text-foreground">
                          {tool.name}
                        </h3>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {tool.desc}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
                        <span>Open Tool</span>
                        <motion.span
                          className="inline-flex"
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
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
