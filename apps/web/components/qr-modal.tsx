"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { X, QrCode, Smartphone, Copy, Check, Clock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
}

export function QrModal({ isOpen, onClose, fileName, fileUrl, fileSize }: Props) {
  const [qrSrc, setQrSrc] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && fileUrl) {
      // In web apps, object URLs or current origin links can be transferred
      const downloadLink = typeof window !== "undefined" ? window.location.href : fileUrl;
      QRCode.toDataURL(downloadLink, {
        width: 250,
        margin: 2,
        color: {
          dark: "#09090b",
          light: "#ffffff",
        },
      })
        .then((url) => setQrSrc(url))
        .catch((err) => console.error("QR generation error", err));
    }
  }, [isOpen, fileUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Download link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md p-6 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-none">Scan to Mobile</h3>
              <p className="text-xs text-muted-foreground mt-1">Download directly to your phone or tablet</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-border/40 shadow-inner my-3">
            {qrSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrSrc} alt="Download QR Code" className="w-48 h-48 rounded-lg shadow-sm" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-muted-foreground text-sm">
                Generating QR...
              </div>
            )}
            <span className="text-[11px] font-mono text-zinc-600 mt-2 font-medium truncate max-w-xs">
              {fileName}
            </span>
          </div>

          <div className="space-y-2 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary shrink-0" />
              <span>Open your phone camera & point it at this QR code</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Temporary transfer session valid for current session</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
              <span>100% free • No registration • No app installation needed</span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold rounded-lg transition-colors border border-border"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied Link" : "Copy Web Link"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
