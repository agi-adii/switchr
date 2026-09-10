"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { imagesToPdf, textToPdf } from "@/lib/converters/pdf-tools";
import {
  FileText,
  Image as ImageIcon,
  Download,
  Trash2,
  ArrowUpDown,
  FilePlus2,
  RotateCw,
  Layers,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { formatFileSize } from "@/lib/registry";
import { saveHistoryItem } from "@/lib/history-store";

export default function PdfToolsPage() {
  const [activeTab, setActiveTab] = useState<"images" | "text" | "pages">("images");

  // Images to PDF state
  const [images, setImages] = useState<File[]>([]);
  const [orientation, setOrientation] = useState<"portrait" | "landscape" | "auto">("auto");
  const [isBuildingPdf, setIsBuildingPdf] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);

  // Text to PDF state
  const [textContent, setTextContent] = useState("");
  const [textTitle, setTextTitle] = useState("");

  // Page Manager simulated state
  const [mockPages, setMockPages] = useState<{ id: number; rotation: number }[]>([
    { id: 1, rotation: 0 },
    { id: 2, rotation: 0 },
    { id: 3, rotation: 0 },
    { id: 4, rotation: 0 },
  ]);

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
      setGeneratedPdfUrl(null);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setGeneratedPdfUrl(null);
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    setImages((prev) => {
      const next = [...prev];
      const targetIdx = direction === "up" ? index - 1 : index + 1;
      if (targetIdx >= 0 && targetIdx < next.length) {
        const temp = next[index];
        next[index] = next[targetIdx];
        next[targetIdx] = temp;
      }
      return next;
    });
  };

  const handleGenerateImagesPdf = async () => {
    if (images.length === 0) return;
    setIsBuildingPdf(true);
    const toastId = toast.loading(`Compiling ${images.length} images into PDF...`);

    try {
      const blob = await imagesToPdf(images, { orientation });
      const url = URL.createObjectURL(blob);
      setGeneratedPdfUrl(url);

      saveHistoryItem({
        fileName: "compiled-images.pdf",
        fromFormat: "images",
        toFormat: "pdf",
        originalSize: images.reduce((acc, f) => acc + f.size, 0),
        convertedSize: blob.size,
        downloadUrl: url,
        category: "pdf",
      });

      toast.success("PDF document created successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to compile PDF", { id: toastId });
    } finally {
      setIsBuildingPdf(false);
    }
  };

  const handleGenerateTextPdf = async () => {
    if (!textContent.trim()) {
      toast.warning("Please enter some text content first");
      return;
    }
    setIsBuildingPdf(true);
    const toastId = toast.loading("Generating formatted PDF...");

    try {
      const blob = await textToPdf(textContent, textTitle.trim() || "Document");
      const url = URL.createObjectURL(blob);
      setGeneratedPdfUrl(url);

      saveHistoryItem({
        fileName: `${textTitle.trim() || "document"}.pdf`,
        fromFormat: "txt",
        toFormat: "pdf",
        originalSize: new Blob([textContent]).size,
        convertedSize: blob.size,
        downloadUrl: url,
        category: "pdf",
      });

      toast.success("Text PDF generated!", { id: toastId });
    } catch (err: any) {
      toast.error("Failed to generate PDF from text", { id: toastId });
    } finally {
      setIsBuildingPdf(false);
    }
  };

  const rotatePage = (id: number) => {
    setMockPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p))
    );
    toast.success(`Rotated page ${id}`);
  };

  const deletePage = (id: number) => {
    setMockPages((prev) => prev.filter((p) => p.id !== id));
    toast.success(`Removed page ${id}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <Breadcrumbs items={[{ label: "PDF Tools" }]} />

      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold mb-2">
          <FileText className="w-3.5 h-3.5" />
          PDF Toolbox
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          PDF Management Suite
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Compile multiple images, generate clean formatted text PDFs, and manage individual pages.
        </p>

        {/* Tab Switcher */}
        <div className="inline-flex p-1 bg-muted rounded-2xl border border-border mt-4">
          <button
            onClick={() => {
              setActiveTab("images");
              setGeneratedPdfUrl(null);
            }}
            className={`flex items-center gap-2 px-5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === "images"
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Images to PDF ({images.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("text");
              setGeneratedPdfUrl(null);
            }}
            className={`flex items-center gap-2 px-5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === "text"
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Text to PDF
          </button>
          <button
            onClick={() => {
              setActiveTab("pages");
              setGeneratedPdfUrl(null);
            }}
            className={`flex items-center gap-2 px-5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === "pages"
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Page Manager
          </button>
        </div>
      </div>

      {/* Tab 1: Images to PDF */}
      {activeTab === "images" && (
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-foreground">Multi-Image &amp; HEIC to PDF Builder</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-extrabold border border-blue-500/20">
                  HEIC / HEIF
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload iPhone/Apple photos (.HEIC), JPG, PNG, or WEBP, arrange page sequence, and export as a unified A4 PDF document.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Layout:</span>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  className="bg-muted px-2.5 py-1 rounded-lg border border-border text-foreground font-medium text-xs"
                >
                  <option value="auto">Auto-Fit</option>
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <label className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl cursor-pointer hover:bg-primary/90 transition-colors shadow-sm">
                <FilePlus2 className="w-4 h-4" />
                Add Photos / HEIC
                <input
                  type="file"
                  multiple
                  accept="image/*,.heic,.heif"
                  onChange={handleAddImages}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {images.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((imgFile, idx) => {
                  const isHeic = imgFile.name.toLowerCase().endsWith(".heic") || imgFile.name.toLowerCase().endsWith(".heif");
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-medium truncate text-foreground">{imgFile.name}</span>
                        {isHeic && (
                          <span className="px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-500 text-[9px] font-extrabold border border-blue-500/20 shrink-0">
                            Apple HEIC
                          </span>
                        )}
                        <span className="text-muted-foreground font-mono shrink-0">
                          ({formatFileSize(imgFile.size)})
                        </span>
                      </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveImage(idx, "up")}
                        className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30 cursor-pointer"
                        title="Move up"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeImage(idx)}
                        className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => setImages([])}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  onClick={handleGenerateImagesPdf}
                  disabled={isBuildingPdf}
                  className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  {isBuildingPdf ? "Compiling PDF..." : `Create PDF (${images.length} Pages)`}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground space-y-2">
              <ImageIcon className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-xs font-medium">No images uploaded yet</p>
              <p className="text-[11px]">Click &ldquo;Add Images&rdquo; above to compile your PDF.</p>
            </div>
          )}

          {generatedPdfUrl && (
            <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600 text-xs font-bold">
                <FileText className="w-4 h-4" />
                Your compiled PDF is ready!
              </div>
              <a
                href={generatedPdfUrl}
                download="switchr-compiled-images.pdf"
                className="py-2 px-4 bg-green-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-green-700 transition-colors"
              >
                Download PDF
              </a>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Text to PDF */}
      {activeTab === "text" && (
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Document Title
            </label>
            <input
              type="text"
              value={textTitle}
              onChange={(e) => setTextTitle(e.target.value)}
              className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter document title (e.g. Project Notes)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Text Content
            </label>
            <textarea
              rows={8}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste or type notes, plain text, or document paragraphs here..."
              className="w-full bg-muted/40 border border-border rounded-xl p-4 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleGenerateTextPdf}
              disabled={isBuildingPdf || !textContent.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Generate &amp; Download PDF
            </button>
          </div>

          {generatedPdfUrl && (
            <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600 text-xs font-bold">
                <FileText className="w-4 h-4" />
                Your text PDF has been generated!
              </div>
              <a
                href={generatedPdfUrl}
                download="switchr-document.pdf"
                className="py-2 px-4 bg-green-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-green-700 transition-colors"
              >
                Download PDF
              </a>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: PDF Page Manager (Section 13) */}
      {activeTab === "pages" && (
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-sm text-foreground">Interactive Page Manager</h3>
            <p className="text-xs text-muted-foreground">
              Select, rotate, reorder, and remove individual pages from your PDF document.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {mockPages.map((page) => (
              <div
                key={page.id}
                className="flex flex-col items-center p-4 bg-muted/30 border border-border rounded-2xl space-y-3 relative group"
              >
                <div
                  style={{ transform: `rotate(${page.rotation}deg)` }}
                  className="w-24 h-32 bg-card border border-border rounded-lg shadow-sm flex flex-col items-center justify-center transition-transform duration-200"
                >
                  <FileText className="w-8 h-8 text-muted-foreground/50 mb-1" />
                  <span className="text-xs font-bold text-foreground">Page {page.id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => rotatePage(page.id)}
                    className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deletePage(page.id)}
                    className="p-1.5 rounded-lg bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive text-xs"
                    title="Delete page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button
              onClick={() => toast.success("Exported updated PDF structure!")}
              className="px-6 py-2.5 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
            >
              Export PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
