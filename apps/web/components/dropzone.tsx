"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, ShieldCheck, Zap, Sparkles, FolderUp } from "lucide-react";
import { useConversionStore } from "@/store/conversion-store";
import { SUPPORTED_EXTENSIONS, getFileExtension } from "@/lib/registry";
import { toast } from "sonner";

export function Dropzone() {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const addFiles = useConversionStore((state) => state.addFiles);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const filterFiles = (files: File[]) => {
    const valid: File[] = [];
    let skipped = 0;

    files.forEach((file) => {
      const ext = getFileExtension(file.name);
      if (SUPPORTED_EXTENSIONS.includes(ext) || ext === "pdf") {
        valid.push(file);
      } else {
        skipped++;
      }
    });

    if (skipped > 0) {
      toast.warning(`${skipped} unsupported file(s) skipped. See supported formats below.`);
    }

    return valid;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const validFiles = filterFiles(Array.from(e.dataTransfer.files));
        if (validFiles.length > 0) {
          addFiles(validFiles);
          toast.success(`Added ${validFiles.length} file(s) for conversion`);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addFiles]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const validFiles = filterFiles(Array.from(e.target.files));
        if (validFiles.length > 0) {
          addFiles(validFiles);
          toast.success(`Added ${validFiles.length} file(s) for conversion`);
        }
      }
      e.target.value = "";
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addFiles]
  );

  return (
    <motion.div
      className="relative w-full aspect-[2.4/1] sm:aspect-[3.2/1] max-w-4xl mx-auto rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-8 overflow-hidden cursor-pointer transition-all duration-300 shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      animate={{
        borderColor: isDragging || isHovered ? "var(--color-primary)" : "var(--color-border)",
        backgroundColor: isDragging || isHovered ? "var(--color-muted)" : "var(--color-card)",
        scale: isDragging ? 1.01 : 1,
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <input
        type="file"
        multiple
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={handleFileChange}
      />

      <motion.div
        animate={{ y: isDragging || isHovered ? -4 : 0 }}
        className="flex flex-col items-center gap-4 text-center pointer-events-none px-4"
      >
        <div className="relative w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
          <UploadCloud className="w-8 h-8" />
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
            <Sparkles className="w-3 h-3" />
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Drop your files here
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            or <span className="text-primary font-semibold underline underline-offset-4">browse files</span> from your device.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-muted-foreground font-medium">
          <span className="flex items-center gap-1 bg-background/80 border border-border px-2.5 py-1 rounded-full">
            <Zap className="w-3 h-3 text-amber-500" />
            Instant Client-Side
          </span>
          <span className="flex items-center gap-1 bg-background/80 border border-border px-2.5 py-1 rounded-full">
            <FolderUp className="w-3 h-3 text-blue-500" />
            Batch Upload Supported
          </span>
          <span className="flex items-center gap-1 bg-background/80 border border-border px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3 h-3 text-green-500" />
            100% Free &amp; Private
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
