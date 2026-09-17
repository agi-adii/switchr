"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, FileImage, FileText, Music, Video, FileCode, Archive, Minimize2, Layers } from "lucide-react";

interface SearchItem {
  id: string;
  title: string;
  category: string;
  description: string;
  href: string;
  icon: any;
}

const SEARCH_ITEMS: SearchItem[] = [
  // Conversions
  { id: "jpg-pdf", title: "JPG to PDF", category: "Images", description: "Convert JPG photos into a PDF document", href: "/convert/images", icon: FileImage },
  { id: "png-webp", title: "PNG to WEBP", category: "Images", description: "Convert PNG to lightweight WebP", href: "/convert/images", icon: FileImage },
  { id: "image-conv", title: "Image Converter", category: "Images", description: "Convert JPG, PNG, WEBP, SVG, BMP, GIF", href: "/convert/images", icon: FileImage },
  
  // PDF
  { id: "pdf-conv", title: "PDF Converter", category: "PDF Tools", description: "Convert PDFs and compile images into PDF", href: "/pdf-tools", icon: FileText },
  { id: "pdf-merge", title: "Merge PDF", category: "PDF Tools", description: "Combine multiple files into a single PDF", href: "/pdf-tools", icon: Layers },
  { id: "pdf-text", title: "Text to PDF", category: "PDF Tools", description: "Compile notes or text into a formatted PDF", href: "/pdf-tools", icon: FileText },
  
  // Audio & Video
  { id: "mp4-mp3", title: "MP4 to MP3", category: "Media", description: "Extract audio track from video files", href: "/convert/video", icon: Video },
  { id: "video-conv", title: "Video Converter", category: "Media", description: "Convert MP4, WEBM, MOV, MKV, GIF", href: "/convert/video", icon: Video },
  { id: "audio-conv", title: "Audio Converter", category: "Media", description: "Convert MP3, WAV, AAC, M4A, OGG", href: "/convert/audio", icon: Music },

  // Documents
  { id: "pptx-pdf", title: "PPT to PDF Converter", category: "Documents", description: "Convert PowerPoint slides into landscape PDF deck", href: "/convert/pptx-to-pdf", icon: FileText },
  { id: "pptx-docx", title: "PPT to DOCX Converter", category: "Documents", description: "Turn PowerPoint slides into editable Word document", href: "/convert/pptx-to-docx", icon: FileText },
  { id: "docx-pdf", title: "DOCX to PDF Converter", category: "Documents", description: "Convert Microsoft Word document to print-ready PDF", href: "/convert/docx-to-pdf", icon: FileText },
  { id: "doc-conv", title: "Document Converter", category: "Documents", description: "Convert PPT, DOCX, TXT, HTML, PDF", href: "/convert/documents", icon: FileText },

  // Data & Archive
  { id: "json-csv", title: "JSON to CSV", category: "Data", description: "Convert JSON array to spreadsheet CSV", href: "/convert/data", icon: FileCode },
  { id: "csv-json", title: "CSV to JSON", category: "Data", description: "Convert spreadsheet CSV to JSON data", href: "/convert/data", icon: FileCode },
  { id: "data-conv", title: "Data Converter", category: "Data", description: "Convert JSON, CSV, XML files with table preview", href: "/convert/data", icon: FileCode },
  { id: "zip-tools", title: "Archive & ZIP Tools", category: "Archives", description: "Create and extract compressed ZIP archives", href: "/tools/archive", icon: Archive },

  // Tools & Compression
  { id: "compress", title: "Compress Files", category: "Compression", description: "Reduce image, PDF, audio, and video sizes", href: "/compress", icon: Minimize2 },
  { id: "history", title: "Conversion History", category: "Personal", description: "View recent conversions and redownload files", href: "/history", icon: Layers },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchPalette({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggling
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = SEARCH_ITEMS.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-background/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-border gap-3">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Switchr... (e.g. JPG to PDF, Compress, MP4, JSON)"
              className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder:text-muted-foreground/70"
            />
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filtered.length > 0 ? (
              filtered.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.href)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/70 text-left transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-foreground">
                            {item.title}
                          </span>
                          <span className="text-[10px] font-medium text-muted-foreground px-1.5 py-0.2 rounded bg-muted">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </button>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs text-muted-foreground space-y-1">
                <p className="font-medium">No results found for &ldquo;{query}&rdquo;</p>
                <p className="text-[11px] text-muted-foreground/70">
                  Try searching for JPG, PDF, Audio, Video, Compress, or Data
                </p>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-4 py-2.5 bg-muted/40 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-mono">
                ESC
              </span>
              <span>to close</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-mono">
                ↵
              </span>
              <span>to navigate</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
