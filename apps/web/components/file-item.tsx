"use client";

import { useState } from "react";
import { useConversionStore, FileItem } from "@/store/conversion-store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Download,
  FileAudio,
  FileImage,
  FileVideo,
  FileText,
  FileCode,
  FileWarning,
  Loader2,
  X,
  Eye,
  QrCode,
  Sparkles,
} from "lucide-react";
import {
  getFormatMetadata,
  getAvailableTargets,
  formatFileSize,
  SmartAction,
} from "@/lib/registry";
import { PreviewModal } from "@/components/preview-modal";
import { QrModal } from "@/components/qr-modal";

interface Props {
  item: FileItem;
}

export function FileItemCard({ item }: Props) {
  const updateFile = useConversionStore((state) => state.updateFile);
  const removeFile = useConversionStore((state) => state.removeFile);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const metadata = getFormatMetadata(item.fromFormat);
  const availableFormats = getAvailableTargets(item.fromFormat);

  const getCategoryIcon = () => {
    switch (metadata?.category) {
      case "video":
        return FileVideo;
      case "audio":
        return FileAudio;
      case "data":
        return FileCode;
      case "document":
        return FileText;
      case "image":
      default:
        return FileImage;
    }
  };

  const Icon = getCategoryIcon();

  const handleApplySmartAction = (action: SmartAction) => {
    updateFile(item.id, { toFormat: action.toFormat });
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
        className="w-full relative flex flex-col p-4 rounded-xl border border-border bg-card shadow-sm gap-3 hover:border-primary/40 transition-colors"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 overflow-hidden">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Icon className="w-5 h-5" />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-semibold truncate text-sm text-foreground">
                {item.fileName}
              </span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span>{formatFileSize(item.fileSize)}</span>
                <span>•</span>
                <span className="px-1.5 py-0.5 rounded bg-muted font-mono uppercase text-[10px] font-bold">
                  {item.fromFormat}
                </span>
                {metadata?.name && <span className="hidden sm:inline">({metadata.name})</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <AnimatePresence mode="wait">
              {item.status === "idle" || item.status === "error" ? (
                <motion.div
                  key="controls"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2"
                >
                  {item.error && (
                    <div className="flex items-center text-xs text-destructive bg-destructive/10 px-2 py-1 rounded-md">
                      <FileWarning className="w-3.5 h-3.5 mr-1" />
                      <span className="truncate max-w-[120px]">{item.error}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <span className="text-muted-foreground">to</span>
                    <select
                      value={item.toFormat}
                      onChange={(e) => updateFile(item.id, { toFormat: e.target.value })}
                      className="bg-muted hover:bg-muted/80 border border-border rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer text-foreground shadow-sm transition-colors"
                    >
                      {availableFormats.length > 0 ? (
                        availableFormats.map((fmt) => (
                          <option key={fmt} value={fmt} disabled={fmt === item.fromFormat}>
                            {fmt.toUpperCase()}
                          </option>
                        ))
                      ) : (
                        <option value={item.toFormat}>{item.toFormat.toUpperCase()}</option>
                      )}
                    </select>
                  </div>

                  <button
                    onClick={() => removeFile(item.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : item.status === "converting" ? (
                <motion.div
                  key="converting"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2.5"
                >
                  <div className="text-xs font-semibold text-primary flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Converting... {Math.round((item.progress || 0) * 100)}%</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                    <Check className="w-4 h-4" />
                  </div>

                  {item.outputUrl && (
                    <>
                      <button
                        onClick={() => setPreviewOpen(true)}
                        className="flex items-center gap-1 text-xs font-semibold py-1.5 px-2.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors border border-border"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Preview</span>
                      </button>

                      <button
                        onClick={() => setQrOpen(true)}
                        className="flex items-center gap-1 text-xs font-semibold py-1.5 px-2.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors border border-border"
                        title="Scan on Mobile"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">QR</span>
                      </button>

                      <a
                        href={item.outputUrl}
                        download={`switchr-${item.fileName.split(".")[0]}.${item.toFormat}`}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-all shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </a>
                    </>
                  )}

                  <button
                    onClick={() => removeFile(item.id)}
                    className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Smart Auto-Convert Presets Bar (Phase 11) */}
        {item.status === "idle" && metadata?.smartActions && metadata.smartActions.length > 0 && (
          <div className="flex items-center gap-1.5 pt-2 border-t border-border/60 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 mr-1 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Quick:
            </span>
            {metadata.smartActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleApplySmartAction(action)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors shrink-0 flex items-center gap-1 ${
                  item.toFormat === action.toFormat
                    ? "bg-primary/10 border-primary text-primary font-semibold"
                    : "bg-muted/50 border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
                title={action.description}
              >
                <span>{action.label}</span>
                {action.badge && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-background border border-border/80 font-mono">
                    {action.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {item.status === "converting" && (
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-primary rounded-b-xl"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.max(15, (item.progress || 0) * 100)}%` }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          />
        )}
      </motion.div>

      {/* Modals */}
      {item.outputUrl && (
        <>
          <PreviewModal
            isOpen={previewOpen}
            onClose={() => setPreviewOpen(false)}
            fileName={`switchr-${item.fileName.split(".")[0]}.${item.toFormat}`}
            fileUrl={item.outputUrl}
            format={item.toFormat}
            fileSize={item.fileSize}
          />
          <QrModal
            isOpen={qrOpen}
            onClose={() => setQrOpen(false)}
            fileName={`switchr-${item.fileName.split(".")[0]}.${item.toFormat}`}
            fileUrl={item.outputUrl}
            fileSize={item.fileSize}
          />
        </>
      )}
    </>
  );
}
