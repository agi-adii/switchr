"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, Download, FileText, Music, Video, Image as ImageIcon } from "lucide-react";
import { formatFileSize } from "@/lib/registry";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileUrl: string;
  format: string;
  fileSize?: number;
  file?: File;
}

export function PreviewModal({ isOpen, onClose, fileName, fileUrl, format, fileSize, file }: Props) {
  const [textContent, setTextContent] = useState<string>("");
  const [loadingText, setLoadingText] = useState(false);

  const fmt = format.toLowerCase();
  const isImage = ["jpg", "jpeg", "png", "webp", "gif", "svg", "bmp"].includes(fmt);
  const isAudio = ["mp3", "wav", "ogg", "aac"].includes(fmt);
  const isVideo = ["mp4", "webm", "mov"].includes(fmt);
  const isTextData = ["txt", "json", "csv", "xml", "html"].includes(fmt);
  const isPdf = fmt === "pdf";

  useEffect(() => {
    if (isOpen && isTextData && (file || fileUrl)) {
      setLoadingText(true);
      if (file) {
        file.text()
          .then((t) => setTextContent(t.slice(0, 5000))) // slice first 5000 chars
          .catch(() => setTextContent("Error reading file text"))
          .finally(() => setLoadingText(false));
      } else if (fileUrl) {
        fetch(fileUrl)
          .then((r) => r.text())
          .then((t) => setTextContent(t.slice(0, 5000)))
          .catch(() => setTextContent("Error fetching text content"))
          .finally(() => setLoadingText(false));
      }
    }
  }, [isOpen, isTextData, file, fileUrl]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                {isImage && <ImageIcon className="w-5 h-5" />}
                {isAudio && <Music className="w-5 h-5" />}
                {isVideo && <Video className="w-5 h-5" />}
                {isTextData && <FileText className="w-5 h-5" />}
                {!isImage && !isAudio && !isVideo && !isTextData && <Eye className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm truncate">{fileName}</h3>
                <p className="text-xs text-muted-foreground">
                  {fmt.toUpperCase()} {fileSize ? `• ${formatFileSize(fileSize)}` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={fileUrl}
                download={fileName}
                className="flex items-center gap-1.5 py-1.5 px-3 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </a>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 p-6 overflow-auto flex items-center justify-center min-h-[300px] bg-background">
            {isImage && (
              <div className="flex flex-col items-center justify-center w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fileUrl}
                  alt={fileName}
                  className="max-h-[55vh] max-w-full rounded-lg object-contain shadow-sm border border-border"
                />
              </div>
            )}

            {isAudio && (
              <div className="w-full max-w-md flex flex-col items-center gap-6 p-6 rounded-xl border border-border bg-muted/30">
                <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center animate-pulse">
                  <Music className="w-10 h-10" />
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-sm">{fileName}</h4>
                  <p className="text-xs text-muted-foreground mt-1">Ready to play</p>
                </div>
                <audio controls src={fileUrl} className="w-full" autoPlay={false} />
              </div>
            )}

            {isVideo && (
              <div className="w-full flex justify-center">
                <video controls src={fileUrl} className="max-h-[55vh] max-w-full rounded-lg shadow-sm border border-border" />
              </div>
            )}

            {isPdf && (
              <div className="w-full h-[55vh] rounded-lg border border-border overflow-hidden">
                <iframe src={fileUrl} className="w-full h-full" title={fileName} />
              </div>
            )}

            {isTextData && (
              <div className="w-full h-full">
                {loadingText ? (
                  <p className="text-sm text-muted-foreground text-center">Loading text preview...</p>
                ) : (
                  <pre className="p-4 bg-muted/40 rounded-xl border border-border text-xs font-mono overflow-auto max-h-[55vh] whitespace-pre-wrap">
                    {textContent || "(Empty file)"}
                  </pre>
                )}
              </div>
            )}

            {!isImage && !isAudio && !isVideo && !isTextData && !isPdf && (
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                  <Eye className="w-6 h-6" />
                </div>
                <h4 className="font-medium text-sm">Preview unavailable for this format</h4>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Your converted file has been safely generated. Click download above to save it.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
