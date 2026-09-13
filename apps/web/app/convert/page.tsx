"use client";

import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  FileImage,
  FileText,
  Music,
  Video,
  FileCode,
  Archive,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

const smoothEase = [0.16, 1, 0.3, 1] as const;

const CATEGORIES = [
  {
    title: "Image Converter",
    desc: "Convert JPG, PNG, WEBP, SVG, BMP, GIF with precision compression and resizing.",
    href: "/convert/images",
    icon: FileImage,
    accent: "text-blue-500 bg-blue-500/10",
    buttonText: "Open Image Converter",
    formats: ["JPG", "PNG", "WEBP", "PDF", "BMP"],
  },
  {
    title: "Document Converter",
    desc: "Convert DOCX, DOC, TXT, HTML, RTF to high-resolution formatted PDFs and text files.",
    href: "/convert/documents",
    icon: FileText,
    accent: "text-amber-500 bg-amber-500/10",
    buttonText: "Open Document Converter",
    formats: ["DOCX", "PDF", "TXT", "HTML"],
  },
  {
    title: "PDF Converter & Suite",
    desc: "Convert PDFs to images/text, compile multiple photos into PDF, or organize pages.",
    href: "/pdf-tools",
    icon: FileText,
    accent: "text-red-500 bg-red-500/10",
    buttonText: "Open PDF Tools",
    formats: ["Images → PDF", "PDF → Images", "Text → PDF"],
  },
  {
    title: "Audio Converter",
    desc: "Convert MP3, WAV, AAC, M4A, OGG with custom bitrate and sample rate presets.",
    href: "/convert/audio",
    icon: Music,
    accent: "text-emerald-500 bg-emerald-500/10",
    buttonText: "Open Audio Converter",
    formats: ["MP3", "WAV", "AAC", "M4A"],
  },
  {
    title: "Video Converter",
    desc: "Convert MP4, WEBM, MOV, MKV, extract audio to MP3, or make lightweight GIF animations.",
    href: "/convert/video",
    icon: Video,
    accent: "text-violet-500 bg-violet-500/10",
    buttonText: "Open Video Converter",
    formats: ["MP4", "WEBM", "MOV", "GIF", "MP3"],
  },
  {
    title: "Data Converter",
    desc: "Convert JSON, CSV, XML files with interactive live data preview tables.",
    href: "/convert/data",
    icon: FileCode,
    accent: "text-cyan-500 bg-cyan-500/10",
    buttonText: "Open Data Converter",
    formats: ["JSON ↔ CSV", "XML ↔ JSON", "Table"],
  },
  {
    title: "Archive & ZIP Tools",
    desc: "Package multiple files into clean ZIP bundles or extract archive contents.",
    href: "/tools/archive",
    icon: Archive,
    accent: "text-indigo-500 bg-indigo-500/10",
    buttonText: "Open Archive Tools",
    formats: ["Create ZIP", "Extract ZIP"],
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: smoothEase },
  },
};

export default function ConvertHubPage() {
  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <Breadcrumbs items={[{ label: "Convert" }]} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center space-y-2 mb-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Dedicated Conversion Suites
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Select What You Want to Convert
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          Choose a dedicated converter below. Each tool is focused on a single task with zero clutter.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.title}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 320, damping: 18 } }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-white/40 hover:bg-white/15 hover:shadow-lg transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <motion.div
                    whileHover={{ scale: 1.12, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 280, damping: 14 }}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center ${cat.accent}`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <div className="flex flex-wrap gap-1">
                    {cat.formats.slice(0, 3).map((f) => (
                      <span
                        key={f}
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/15 text-white/70"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{cat.title}</h3>
                  <p className="text-xs text-white/60 mt-1.5 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-white/15">
                <Link
                  href={cat.href}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/15 hover:bg-primary hover:text-primary-foreground text-white rounded-xl text-xs font-bold transition-all group"
                >
                  <span>{cat.buttonText}</span>
                  <motion.span
                    className="inline-flex"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
