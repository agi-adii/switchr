"use client";

import { useConversionStore } from "@/store/conversion-store";
import { convertFile, loadFfmpeg } from "@/lib/ffmpeg";
import { convertImage } from "@/lib/converters/image-converter";
import { imagesToPdf, textToPdf } from "@/lib/converters/pdf-tools";
import { jsonToCsv, csvToJson, jsonToXml, xmlToJson } from "@/lib/converters/data-converter";
import { saveHistoryItem } from "@/lib/history-store";
import { getConversionEngine, getFormatMetadata } from "@/lib/registry";
import { DownloadCloud, Play, Trash2, Layers, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import JSZip from "jszip";

export function BatchActions() {
  const { files, clearAll, updateFile, setAllTargetFormats } = useConversionStore();
  const [isConverting, setIsConverting] = useState(false);

  const pendingFiles = files.filter(
    (f) => f.status === "idle" || f.status === "error"
  );

  const completedFiles = files.filter(
    (f) => f.status === "done" && f.outputUrl
  );

  const handleConvert = async () => {
    if (pendingFiles.length === 0) return;
    setIsConverting(true);

    const loadingToastId = toast.loading(`Converting ${pendingFiles.length} file(s)...`);

    try {
      // Pre-check if any files require FFmpeg
      const requiresFfmpeg = pendingFiles.some((f) => {
        const engine = getConversionEngine(f.fromFormat, f.toFormat);
        return engine === "ffmpeg";
      });

      const ffmpeg = requiresFfmpeg ? await loadFfmpeg() : null;

      let successCount = 0;
      let failCount = 0;

      for (const item of pendingFiles) {
        updateFile(item.id, { status: "converting", error: undefined, progress: 0.1 });

        try {
          let outputUrl: string = "";
          let convertedBlob: Blob | null = null;
          const engine = getConversionEngine(item.fromFormat, item.toFormat);

          // 1. CANVAS ENGINE (Images -> WebP, PNG, JPG, BMP)
          if (engine === "canvas") {
            const result = await convertImage(
              item.file,
              { toFormat: item.toFormat, quality: 0.92 },
              (p) => updateFile(item.id, { progress: p })
            );
            outputUrl = result.url;
            convertedBlob = result.blob;
          }
          // 2. PDF ENGINE (Images -> PDF, Text -> PDF)
          else if (engine === "jspdf" || item.toFormat === "pdf") {
            if (["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg"].includes(item.fromFormat)) {
              convertedBlob = await imagesToPdf([item.file], {}, (p) =>
                updateFile(item.id, { progress: p })
              );
            } else {
              const text = await item.file.text();
              convertedBlob = await textToPdf(text, item.fileName);
            }
            outputUrl = URL.createObjectURL(convertedBlob);
          }
          // 3. DATA ENGINE (JSON, CSV, XML)
          else if (engine === "data") {
            const rawText = await item.file.text();
            let resultText = "";
            let mimeType = "text/plain";

            if (item.fromFormat === "json" && item.toFormat === "csv") {
              resultText = jsonToCsv(rawText);
              mimeType = "text/csv";
            } else if (item.fromFormat === "csv" && item.toFormat === "json") {
              const parsed = csvToJson(rawText);
              resultText = JSON.stringify(parsed, null, 2);
              mimeType = "application/json";
            } else if (item.fromFormat === "json" && item.toFormat === "xml") {
              resultText = jsonToXml(rawText);
              mimeType = "application/xml";
            } else if (item.fromFormat === "xml" && item.toFormat === "json") {
              const parsed = xmlToJson(rawText);
              resultText = JSON.stringify(parsed, null, 2);
              mimeType = "application/json";
            } else {
              resultText = rawText;
            }

            convertedBlob = new Blob([resultText], { type: mimeType });
            outputUrl = URL.createObjectURL(convertedBlob);
          }
          // 4. FFMPEG ENGINE (Audio / Video)
          else if (engine === "ffmpeg") {
            if (!ffmpeg) throw new Error("Audio/Video engine could not be loaded");
            outputUrl = await convertFile(
              ffmpeg,
              item.file,
              item.toFormat,
              (progress) => updateFile(item.id, { progress })
            );
          } else {
            throw new Error(`Unsupported conversion from ${item.fromFormat} to ${item.toFormat}`);
          }

          updateFile(item.id, { status: "done", outputUrl, progress: 1 });
          successCount++;

          // Record in persistent history
          saveHistoryItem({
            fileName: item.fileName,
            fromFormat: item.fromFormat,
            toFormat: item.toFormat,
            originalSize: item.fileSize,
            convertedSize: convertedBlob ? convertedBlob.size : undefined,
            downloadUrl: outputUrl,
            category: getFormatMetadata(item.fromFormat)?.category || "general",
          });
        } catch (error: any) {
          console.error(`Conversion failed for ${item.fileName}:`, error);
          const friendlyMessage =
            error.message && error.message.length < 80
              ? error.message
              : "Conversion failed. Verify file integrity.";
          updateFile(item.id, { status: "error", error: friendlyMessage });
          failCount++;
        }
      }

      if (failCount === 0) {
        toast.success(`Successfully converted ${successCount} file(s)!`, { id: loadingToastId });
      } else {
        toast.warning(`Converted ${successCount} files, ${failCount} failed.`, { id: loadingToastId });
      }
    } catch (err: any) {
      console.error("Conversion engine initialization error", err);
      toast.error("Failed to start conversion engine: " + (err.message || "Unknown error"), {
        id: loadingToastId,
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownloadZip = async () => {
    if (completedFiles.length === 0) return;

    const toastId = toast.loading("Packaging files into ZIP...");
    try {
      const zip = new JSZip();

      await Promise.all(
        completedFiles.map(async (f) => {
          const response = await fetch(f.outputUrl!);
          const blob = await response.blob();
          const baseName = f.fileName.substring(0, f.fileName.lastIndexOf(".")) || f.fileName;
          const newName = `switchr-${baseName}.${f.toFormat}`;
          zip.file(newName, blob);
        })
      );

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipBlob);

      const a = document.createElement("a");
      a.href = zipUrl;
      a.download = `switchr-batch-${Date.now()}.zip`;
      a.click();

      URL.revokeObjectURL(zipUrl);
      toast.success("Batch ZIP downloaded successfully!", { id: toastId });
    } catch (err) {
      toast.error("Failed to generate ZIP archive", { id: toastId });
      console.error(err);
    }
  };

  if (files.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto my-4 flex items-center justify-between p-4 bg-card border border-border rounded-2xl shadow-sm flex-wrap gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Layers className="w-4 h-4 text-primary" />
          <span>{files.length} file{files.length !== 1 ? "s" : ""} in queue</span>
        </div>
        {completedFiles.length > 0 && (
          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {completedFiles.length} ready
          </span>
        )}
      </div>

      <div className="flex items-center gap-2.5 ml-auto flex-wrap">
        {/* Bulk target selection */}
        {pendingFiles.length > 1 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mr-1">
            <span>Set all:</span>
            <button
              onClick={() => setAllTargetFormats("webp")}
              className="px-2 py-1 bg-muted hover:bg-muted/80 rounded border text-foreground font-semibold text-[11px]"
            >
              WEBP
            </button>
            <button
              onClick={() => setAllTargetFormats("png")}
              className="px-2 py-1 bg-muted hover:bg-muted/80 rounded border text-foreground font-semibold text-[11px]"
            >
              PNG
            </button>
            <button
              onClick={() => setAllTargetFormats("pdf")}
              className="px-2 py-1 bg-muted hover:bg-muted/80 rounded border text-foreground font-semibold text-[11px]"
            >
              PDF
            </button>
          </div>
        )}

        <button
          onClick={clearAll}
          disabled={isConverting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>

        {completedFiles.length > 1 && (
          <button
            onClick={handleDownloadZip}
            disabled={isConverting}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors shadow-sm disabled:opacity-50"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            Download ZIP ({completedFiles.length})
          </button>
        )}

        <button
          onClick={handleConvert}
          disabled={pendingFiles.length === 0 || isConverting}
          className="flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:pointer-events-none"
        >
          <Play className="w-3.5 h-3.5" />
          {isConverting ? "Converting Queue..." : pendingFiles.length === 0 ? "All Converted" : `Convert ${pendingFiles.length} File(s)`}
        </button>
      </div>
    </div>
  );
}
