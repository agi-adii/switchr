"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Breadcrumbs, BreadcrumbItem } from "@/components/breadcrumbs";
import {
  UploadCloud,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  QrCode,
  RotateCcw,
  Trash2,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { formatFileSize } from "@/lib/registry";
import { PreviewModal } from "@/components/preview-modal";
import { QrModal } from "@/components/qr-modal";
import { saveHistoryItem } from "@/lib/history-store";
import { toast } from "sonner";

interface Props {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  accept?: string;
  recommendedFormats: string[];
  moreFormats?: string[];
  defaultTarget: string;
  category: string;
  advancedOptionsNode?: React.ReactNode;
  onConvert: (
    file: File,
    toFormat: string,
    onProgress: (p: number) => void
  ) => Promise<{ url: string; newSize?: number }>;
}

export function ConverterTemplate({
  title,
  description,
  breadcrumbs,
  accept,
  recommendedFormats,
  moreFormats = [],
  defaultTarget,
  category,
  advancedOptionsNode,
  onConvert,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>(defaultTarget);
  const [showMoreFormats, setShowMoreFormats] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Conversion execution states
  const [stage, setStage] = useState<"idle" | "processing" | "completed" | "error">("idle");
  const [stageText, setStageText] = useState("Processing...");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ url: string; newSize?: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals
  const [previewOpen, setPreviewOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selected: File) => {
    setFile(selected);
    setStage("idle");
    setResult(null);
    setErrorMsg(null);
    setProgress(0);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleConvertClick = async () => {
    if (!file) return;
    setStage("processing");
    setErrorMsg(null);
    setProgress(0.1);
    setStageText("Uploading & Analyzing...");

    try {
      setTimeout(() => setStageText("Processing conversion..."), 400);

      const res = await onConvert(file, selectedFormat, (p) => {
        setProgress(Math.max(0.15, p));
        if (p > 0.8) setStageText("Validating output...");
      });

      setStageText("Completed!");
      setProgress(1.0);
      setResult(res);
      setStage("completed");

      // Save to local history
      saveHistoryItem({
        fileName: file.name,
        fromFormat: file.name.split(".").pop()?.toLowerCase() || "",
        toFormat: selectedFormat,
        originalSize: file.size,
        convertedSize: res.newSize,
        downloadUrl: res.url,
        category,
      });

      toast.success(`Successfully converted to ${selectedFormat.toUpperCase()}!`);
    } catch (err: any) {
      console.error(err);
      setStage("error");
      setErrorMsg(err.message || "Failed to convert file. Please check file format.");
      toast.error("Conversion failed: " + (err.message || "Unknown error"));
    }
  };

  const resetAll = () => {
    setFile(null);
    setStage("idle");
    setResult(null);
    setErrorMsg(null);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <Breadcrumbs items={breadcrumbs} />

      {/* 1. Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center space-y-2 mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          {description}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
      >
        {/* 2. Upload Card (If no file selected) */}
        {!file && (
          <motion.div
            whileHover={{ scale: isDragging ? 1.01 : 1.004 }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative w-full aspect-[2.6/1] sm:aspect-[3.2/1] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 cursor-pointer transition-all duration-200 ${
              isDragging
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <motion.div
              animate={isDragging ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3"
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <UploadCloud className="w-6 h-6" />
              </motion.div>
            </motion.div>
            <p className="text-sm font-bold text-foreground">
              {isDragging ? "Release to upload" : "Drop your file here"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              or <span className="text-primary font-semibold underline">Choose File</span> from device
            </p>
          </motion.div>
        )}

        {/* 3. Selected File Details */}
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold truncate text-foreground">
                  {file.name}
                </p>
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                  {formatFileSize(file.size)} • {file.name.split(".").pop()?.toUpperCase()}
                </p>
              </div>
            </div>
            <button
              onClick={resetAll}
              disabled={stage === "processing"}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
              title="Remove file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* 4. Format Selection */}
        {file && stage !== "completed" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3 pt-2"
          >
            <label className="block text-xs font-bold text-foreground">
              Convert to:
            </label>
            <motion.div
              className="flex flex-wrap items-center gap-2"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            >
              {recommendedFormats.map((fmt) => (
                <motion.button
                  key={fmt}
                  variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-colors border ${
                    selectedFormat === fmt
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-muted/50 border-border hover:bg-muted text-foreground"
                  }`}
                >
                  {fmt}
                </motion.button>
              ))}

              {moreFormats.length > 0 && (
                <motion.button
                  variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowMoreFormats(!showMoreFormats)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground border border-dashed border-border"
                >
                  {showMoreFormats ? "Less formats" : `More formats (${moreFormats.length})`}
                </motion.button>
              )}
            </motion.div>

            {showMoreFormats && moreFormats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 pt-2"
              >
                {moreFormats.map((fmt) => (
                  <motion.button
                    key={fmt}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors border ${
                      selectedFormat === fmt
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-muted/30 border-border hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {fmt}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* 5. Collapsible Advanced Options */}
        {file && advancedOptionsNode && stage !== "completed" && (
          <div className="pt-2 border-t border-border">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground py-1"
            >
              <span>Advanced Options</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  showAdvanced ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-3 overflow-hidden"
                >
                  {advancedOptionsNode}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* 6. Primary Convert Action Button */}
        {file && stage === "idle" && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 24px var(--color-primary, rgba(99,102,241,0.35))" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleConvertClick}
            className="w-full py-3 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            Convert to {selectedFormat.toUpperCase()}
          </motion.button>
        )}

        {/* 7. Progress Stage Screen */}
        {stage === "processing" && (
          <div className="py-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-foreground">{stageText}</span>
              <span className="font-mono text-primary">{Math.round(progress * 100)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.round(progress * 100)}%` }}
                transition={{ ease: "easeOut", duration: 0.2 }}
              />
            </div>
          </div>
        )}

        {/* Error Feedback */}
        {stage === "error" && errorMsg && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Conversion Error</span>
            </div>
            <p className="text-xs text-muted-foreground">{errorMsg}</p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleConvertClick}
                className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90"
              >
                Retry
              </button>
              <button
                onClick={resetAll}
                className="px-3 py-1.5 bg-muted text-foreground rounded-lg text-xs font-semibold hover:bg-muted/80"
              >
                Try Another File
              </button>
            </div>
          </div>
        )}

        {/* 8. Conversion Result Screen */}
        {stage === "completed" && result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="py-4 space-y-6 text-center"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
              className="w-14 h-14 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto"
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.15 }}
              >
                <CheckCircle2 className="w-8 h-8" />
              </motion.div>
            </motion.div>

            <div>
              <h3 className="text-lg font-extrabold text-foreground">Conversion Complete</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {file?.name} → {selectedFormat.toUpperCase()}{" "}
                {result.newSize ? `(${formatFileSize(result.newSize)})` : ""}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <a
                href={result.url}
                download={`switchr-${file?.name.split(".")[0] || "file"}.${selectedFormat}`}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
              >
                <Download className="w-4 h-4" />
                Download File
              </a>

              <button
                onClick={() => setPreviewOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-muted hover:bg-muted/80 border border-border text-foreground rounded-xl text-xs font-semibold transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>

              <button
                onClick={() => setQrOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-muted hover:bg-muted/80 border border-border text-foreground rounded-xl text-xs font-semibold transition-colors"
              >
                <QrCode className="w-4 h-4" />
                Scan QR
              </button>

              <button
                onClick={resetAll}
                className="flex items-center gap-1.5 px-4 py-2.5 text-muted-foreground hover:text-foreground text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Convert Again
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Modals */}
      {result && file && (
        <>
          <PreviewModal
            isOpen={previewOpen}
            onClose={() => setPreviewOpen(false)}
            fileName={`switchr-${file.name.split(".")[0]}.${selectedFormat}`}
            fileUrl={result.url}
            format={selectedFormat}
            fileSize={result.newSize}
          />
          <QrModal
            isOpen={qrOpen}
            onClose={() => setQrOpen(false)}
            fileName={`switchr-${file.name.split(".")[0]}.${selectedFormat}`}
            fileUrl={result.url}
            fileSize={result.newSize}
          />
        </>
      )}
    </div>
  );
}
