"use client";

import { useState } from "react";
import { imagesToPdf, textToPdf } from "@/lib/converters/pdf-tools";
import { FileText, Image as ImageIcon, Download, Trash2, ArrowUpDown, FilePlus2 } from "lucide-react";
import { toast } from "sonner";
import { formatFileSize } from "@/lib/registry";
import { GlassPillTabs } from "@/components/ui/glass-pill-tabs";

export function PdfToolsSection() {
  const [activeTab, setActiveTab] = useState<"images" | "text">("images");

  // Images to PDF state
  const [images, setImages] = useState<File[]>([]);
  const [orientation, setOrientation] = useState<"portrait" | "landscape" | "auto">("auto");
  const [isBuildingPdf, setIsBuildingPdf] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);

  // Text to PDF state
  const [textContent, setTextContent] = useState("");
  const [textTitle, setTextTitle] = useState("");

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
      toast.success("Text PDF generated!", { id: toastId });
    } catch (err: any) {
      toast.error("Failed to generate PDF from text", { id: toastId });
    } finally {
      setIsBuildingPdf(false);
    }
  };

  return (
    <section id="pdf-tools" className="w-full py-16 scroll-mt-16 bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold mb-3">
            <FileText className="w-3.5 h-3.5" />
            PDF Toolbox Suite
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Complete PDF Creation &amp; Management
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mt-2">
            Combine images into high-resolution documents, convert text files to clean PDFs, and export instantly.
          </p>

          {/* Glassmorphic Pill Tab Switcher */}
          <div className="mt-6 flex justify-center">
            <GlassPillTabs
              activeTab={activeTab}
              onChange={(tabId) => {
                setActiveTab(tabId);
                setGeneratedPdfUrl(null);
              }}
              layoutId="homePdfToolsTab"
              tabs={[
                {
                  id: "images",
                  label: `Images to PDF (${images.length})`,
                  icon: <ImageIcon className="w-4 h-4 text-blue-500" />,
                },
                {
                  id: "text",
                  label: "Text to PDF",
                  icon: <FileText className="w-4 h-4 text-purple-500" />,
                },
              ]}
            />
          </div>
        </div>

        {/* Tab 1: Images to PDF */}
        {activeTab === "images" && (
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
              <div>
                <h3 className="font-bold text-lg text-foreground">Multi-Image PDF Builder</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upload multiple photos, reorder pages, and compile them into a single A4 PDF.
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
                  Add Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleAddImages}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {images.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map((imgFile, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-medium truncate text-foreground">{imgFile.name}</span>
                        <span className="text-muted-foreground font-mono shrink-0">
                          ({formatFileSize(imgFile.size)})
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveImage(idx, "up")}
                          className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUpDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeImage(idx)}
                          className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <button
                    onClick={() => setImages([])}
                    className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={handleGenerateImagesPdf}
                    disabled={isBuildingPdf}
                    className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
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
                <p className="text-[11px]">Click &quot;Add Images&quot; above to compile your PDF.</p>
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
                placeholder="Enter document title (e.g. My Document)"
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
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
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
      </div>
    </section>
  );
}
