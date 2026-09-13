"use client";

import { useState, useEffect, useRef } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GlassPillTabs } from "@/components/ui/glass-pill-tabs";
import {
  imagesToPdf,
  textToPdf,
  pdfToImages,
  getPdfMetadata,
  createImagesZip,
  protectPdf,
  unlockPdf,
  checkIsPdfEncrypted,
  type ConvertedPdfPage,
  type PdfMetadata,
  type PdfSecurityInfo,
} from "@/lib/converters/pdf-tools";
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
  FileImage,
  UploadCloud,
  Check,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ShieldCheck,
  Key,
  X,
  Archive,
  Sliders,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { formatFileSize } from "@/lib/registry";
import { saveHistoryItem } from "@/lib/history-store";

function parsePageRange(input: string, totalPages: number): number[] {
  if (!input.trim()) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set<number>();
  const parts = input.split(",");
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [startStr, endStr] = trimmed.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const from = Math.max(1, Math.min(start, end));
        const to = Math.min(totalPages, Math.max(start, end));
        for (let i = from; i <= to; i++) pages.add(i);
      }
    } else {
      const num = parseInt(trimmed, 10);
      if (!isNaN(num) && num >= 1 && num <= totalPages) {
        pages.add(num);
      }
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

export default function PdfToolsPage() {
  const [activeTab, setActiveTab] = useState<"images" | "pdfToImage" | "protect" | "unlock" | "text" | "pages">("images");

  // Read URL param if available (?tab=pdf-to-image, ?tab=protect, ?tab=unlock)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "pdf-to-image" || tab === "pdfToImage") {
        setActiveTab("pdfToImage");
      } else if (tab === "protect" || tab === "protect-pdf") {
        setActiveTab("protect");
      } else if (tab === "unlock" || tab === "unlock-pdf") {
        setActiveTab("unlock");
      }
    }
  }, []);

  // -------------------------------------------------------------
  // Tab 1: Images to PDF state
  // -------------------------------------------------------------
  const [images, setImages] = useState<File[]>([]);
  const [orientation, setOrientation] = useState<"portrait" | "landscape" | "auto">("auto");
  const [isBuildingPdf, setIsBuildingPdf] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);

  // -------------------------------------------------------------
  // Tab 2: PDF to Image state
  // -------------------------------------------------------------
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfMetadata, setPdfMetadata] = useState<PdfMetadata | null>(null);
  const [isAnalyzingPdf, setIsAnalyzingPdf] = useState(false);
  const [isConvertingPdf, setIsConvertingPdf] = useState(false);
  const [convertProgress, setConvertProgress] = useState(0);
  const [currentConvertingPage, setCurrentConvertingPage] = useState(0);
  const [pdfOutputFormat, setPdfOutputFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [pdfScale, setPdfScale] = useState<number>(1.5);
  const [pdfQuality, setPdfQuality] = useState<number>(92);
  const [pageSelectionMode, setPageSelectionMode] = useState<"all" | "custom">("all");
  const [customRange, setCustomRange] = useState<string>("");
  const [convertedPages, setConvertedPages] = useState<ConvertedPdfPage[]>([]);
  const [isZipping, setIsZipping] = useState(false);
  const [previewModalIndex, setPreviewModalIndex] = useState<number | null>(null);
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // -------------------------------------------------------------
  // Tab 3: Protect PDF State
  // -------------------------------------------------------------
  const [protectFile, setProtectFile] = useState<File | null>(null);
  const [protectPassword, setProtectPassword] = useState("");
  const [protectConfirmPassword, setProtectConfirmPassword] = useState("");
  const [protectShowPassword, setProtectShowPassword] = useState(false);
  const [protectAllowPrint, setProtectAllowPrint] = useState(true);
  const [protectAllowCopy, setProtectAllowCopy] = useState(true);
  const [isProtecting, setIsProtecting] = useState(false);
  const [protectProgress, setProtectProgress] = useState(0);
  const [protectedPdfUrl, setProtectedPdfUrl] = useState<string | null>(null);
  const [protectedFileSize, setProtectedFileSize] = useState(0);
  const protectFileInputRef = useRef<HTMLInputElement>(null);

  // -------------------------------------------------------------
  // Tab 4: Unlock PDF State
  // -------------------------------------------------------------
  const [unlockFile, setUnlockFile] = useState<File | null>(null);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [unlockShowPassword, setUnlockShowPassword] = useState(false);
  const [isAnalyzingUnlock, setIsAnalyzingUnlock] = useState(false);
  const [unlockSecurityInfo, setUnlockSecurityInfo] = useState<PdfSecurityInfo | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockProgress, setUnlockProgress] = useState(0);
  const [unlockedPdfUrl, setUnlockedPdfUrl] = useState<string | null>(null);
  const [unlockedFileSize, setUnlockedFileSize] = useState(0);
  const unlockFileInputRef = useRef<HTMLInputElement>(null);

  // -------------------------------------------------------------
  // Tab 5: Text to PDF state
  // -------------------------------------------------------------
  const [textContent, setTextContent] = useState("");
  const [textTitle, setTextTitle] = useState("");

  // -------------------------------------------------------------
  // Tab 6: Page Manager simulated state
  // -------------------------------------------------------------
  const [mockPages, setMockPages] = useState<{ id: number; rotation: number }[]>([
    { id: 1, rotation: 0 },
    { id: 2, rotation: 0 },
    { id: 3, rotation: 0 },
    { id: 4, rotation: 0 },
  ]);

  // Handlers for Tab 1 (Images to PDF)
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

  // Handlers for Tab 2 (PDF to Image)
  const handleSelectPdfFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      toast.error("Please select a valid PDF file");
      return;
    }

    setPdfFile(file);
    setConvertedPages([]);
    setIsAnalyzingPdf(true);
    const toastId = toast.loading(`Loading document "${file.name}"...`);

    try {
      const meta = await getPdfMetadata(file);
      setPdfMetadata(meta);
      setCustomRange(`1-${meta.pageCount}`);
      toast.success(`Loaded PDF: ${meta.pageCount} ${meta.pageCount === 1 ? "page" : "pages"}`, {
        id: toastId,
      });
    } catch (err: any) {
      console.error(err);
      toast.error("Could not parse PDF. Make sure it is not password-protected.", {
        id: toastId,
      });
      setPdfFile(null);
      setPdfMetadata(null);
    } finally {
      setIsAnalyzingPdf(false);
    }
  };

  const handleStartPdfToImage = async () => {
    if (!pdfFile || !pdfMetadata) return;

    let targetPages: number[] | undefined = undefined;
    if (pageSelectionMode === "custom") {
      targetPages = parsePageRange(customRange, pdfMetadata.pageCount);
      if (targetPages.length === 0) {
        toast.warning("Please specify a valid page range (e.g. 1-3, 5)");
        return;
      }
    }

    setIsConvertingPdf(true);
    setConvertProgress(0);
    setCurrentConvertingPage(1);
    const pagesToConvertCount = targetPages ? targetPages.length : pdfMetadata.pageCount;
    const toastId = toast.loading(
      `Converting ${pagesToConvertCount} ${
        pagesToConvertCount === 1 ? "page" : "pages"
      } to ${pdfOutputFormat.toUpperCase()}...`
    );

    try {
      const results = await pdfToImages(
        pdfFile,
        {
          format: pdfOutputFormat,
          scale: pdfScale,
          quality: pdfQuality / 100,
          pageNumbers: targetPages,
        },
        (progress, current) => {
          setConvertProgress(progress);
          setCurrentConvertingPage(current);
        }
      );

      setConvertedPages(results);

      saveHistoryItem({
        fileName: `${pdfFile.name.replace(/\.[^/.]+$/, "")}-extracted.${
          pdfOutputFormat === "jpeg" ? "jpg" : pdfOutputFormat
        }`,
        fromFormat: "pdf",
        toFormat: pdfOutputFormat,
        originalSize: pdfFile.size,
        convertedSize: results.reduce((acc, p) => acc + p.blob.size, 0),
        downloadUrl: results[0]?.dataUrl || "",
        category: "pdf",
      });

      toast.success(
        `Rendered ${results.length} high-res ${
          results.length === 1 ? "image" : "images"
        } successfully!`,
        { id: toastId }
      );
    } catch (err: any) {
      console.error("PDF to image error:", err);
      toast.error(err.message || "Failed to convert PDF pages to images", { id: toastId });
    } finally {
      setIsConvertingPdf(false);
    }
  };

  const downloadSinglePage = (page: ConvertedPdfPage) => {
    const ext = pdfOutputFormat === "jpeg" ? "jpg" : pdfOutputFormat;
    const baseName = pdfFile ? pdfFile.name.replace(/\.[^/.]+$/, "") : "document";
    const filename = `${baseName}-page-${page.pageNumber}.${ext}`;
    const url = URL.createObjectURL(page.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded Page ${page.pageNumber}`);
  };

  const handleDownloadAllZip = async () => {
    if (convertedPages.length === 0 || !pdfFile) return;
    setIsZipping(true);
    const toastId = toast.loading("Packaging images into ZIP archive...");

    try {
      const baseName = pdfFile.name.replace(/\.[^/.]+$/, "");
      const zipBlob = await createImagesZip(convertedPages, baseName, pdfOutputFormat);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${baseName}-images.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("ZIP archive downloaded!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create ZIP archive", { id: toastId });
    } finally {
      setIsZipping(false);
    }
  };

  const handleCopyImage = async (page: ConvertedPdfPage) => {
    try {
      if (page.blob.type === "image/png" && typeof window !== "undefined" && "ClipboardItem" in window) {
        await navigator.clipboard.write([
          new (window as any).ClipboardItem({ "image/png": page.blob }),
        ]);
        toast.success(`Page ${page.pageNumber} copied to clipboard!`);
      } else {
        await navigator.clipboard.writeText(page.dataUrl);
        toast.success(`Page ${page.pageNumber} image link copied!`);
      }
    } catch (err) {
      toast.info("Could not write directly to clipboard; please use the download button.");
    }
  };

  const resetPdfToImage = () => {
    setPdfFile(null);
    setPdfMetadata(null);
    setConvertedPages([]);
    setConvertProgress(0);
    setCurrentConvertingPage(0);
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  };

  // -------------------------------------------------------------
  // Protect PDF Handlers
  // -------------------------------------------------------------
  const handleSelectProtectFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      toast.error("Please select a valid PDF file");
      return;
    }
    setProtectFile(file);
    setProtectedPdfUrl(null);
    setProtectPassword("");
    setProtectConfirmPassword("");
  };

  const handleStartProtectPdf = async () => {
    if (!protectFile) {
      toast.error("Please select a PDF file to protect");
      return;
    }
    if (!protectPassword.trim()) {
      toast.error("Please enter a password for protection");
      return;
    }
    if (protectConfirmPassword && protectPassword !== protectConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsProtecting(true);
    setProtectProgress(0);
    const toastId = toast.loading(`Encrypting "${protectFile.name}" with password...`);

    try {
      const blob = await protectPdf(
        protectFile,
        {
          userPassword: protectPassword,
          ownerPassword: protectPassword,
          permissions: {
            print: protectAllowPrint,
            copy: protectAllowCopy,
          },
        },
        (progress) => setProtectProgress(progress)
      );

      const url = URL.createObjectURL(blob);
      setProtectedPdfUrl(url);
      setProtectedFileSize(blob.size);

      saveHistoryItem({
        fileName: `${protectFile.name.replace(/\.[^/.]+$/, "")}-protected.pdf`,
        fromFormat: "pdf",
        toFormat: "pdf",
        originalSize: protectFile.size,
        convertedSize: blob.size,
        downloadUrl: url,
        category: "pdf",
      });

      toast.success("PDF protected & encrypted successfully!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to protect PDF", { id: toastId });
    } finally {
      setIsProtecting(false);
    }
  };

  const resetProtectPdf = () => {
    setProtectFile(null);
    setProtectPassword("");
    setProtectConfirmPassword("");
    setProtectedPdfUrl(null);
    setProtectProgress(0);
    if (protectFileInputRef.current) protectFileInputRef.current.value = "";
  };

  // -------------------------------------------------------------
  // Unlock PDF Handlers
  // -------------------------------------------------------------
  const handleSelectUnlockFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      toast.error("Please select a valid PDF file");
      return;
    }

    setUnlockFile(file);
    setUnlockedPdfUrl(null);
    setUnlockPassword("");
    setIsAnalyzingUnlock(true);

    try {
      const info = await checkIsPdfEncrypted(file);
      setUnlockSecurityInfo(info);
      if (info.isEncrypted) {
        toast.info("Password-protected PDF detected. Enter password to unlock.");
      } else {
        toast.success("PDF is not locked, ready to strip restrictions!");
      }
    } catch (err: any) {
      console.error("PDF analysis error:", err);
      setUnlockSecurityInfo({ isEncrypted: true, requiresPassword: true });
    } finally {
      setIsAnalyzingUnlock(false);
    }
  };

  const handleStartUnlockPdf = async () => {
    if (!unlockFile) {
      toast.error("Please select a PDF file to unlock");
      return;
    }

    setIsUnlocking(true);
    setUnlockProgress(0);
    const toastId = toast.loading(`Unlocking "${unlockFile.name}"...`);

    try {
      const blob = await unlockPdf(unlockFile, unlockPassword, (p) => setUnlockProgress(p));
      const url = URL.createObjectURL(blob);
      setUnlockedPdfUrl(url);
      setUnlockedFileSize(blob.size);

      saveHistoryItem({
        fileName: `${unlockFile.name.replace(/\.[^/.]+$/, "")}-unlocked.pdf`,
        fromFormat: "pdf",
        toFormat: "pdf",
        originalSize: unlockFile.size,
        convertedSize: blob.size,
        downloadUrl: url,
        category: "pdf",
      });

      toast.success("PDF unlocked & password removed successfully!", { id: toastId });
    } catch (err: any) {
      console.error("Unlock error:", err);
      toast.error(err.message || "Incorrect password or failed to unlock PDF", { id: toastId });
    } finally {
      setIsUnlocking(false);
    }
  };

  const resetUnlockPdf = () => {
    setUnlockFile(null);
    setUnlockPassword("");
    setUnlockSecurityInfo(null);
    setUnlockedPdfUrl(null);
    setUnlockProgress(0);
    if (unlockFileInputRef.current) unlockFileInputRef.current.value = "";
  };

  // Handlers for Tab 5 (Text to PDF)
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

  // Handlers for Tab 4 (Page Manager)
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
          Compile multiple images, extract high-quality images, password-protect &amp; encrypt PDFs, unlock protected PDFs, and manage pages.
        </p>

        {/* Glassmorphic Pill Tab Switcher */}
        <div className="mt-6 flex justify-center">
          <GlassPillTabs
            activeTab={activeTab}
            onChange={(tabId) => {
              setActiveTab(tabId);
              setGeneratedPdfUrl(null);
            }}
            layoutId="pdfToolsTab"
            tabs={[
              {
                id: "images",
                label: `Images to PDF (${images.length})`,
                icon: <ImageIcon className="w-4 h-4 text-blue-500" />,
              },
              {
                id: "pdfToImage",
                label: "PDF to Image",
                icon: <FileImage className="w-4 h-4 text-red-500" />,
                badge: convertedPages.length > 0 ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-primary/20 text-primary text-[10px] font-mono">
                    {convertedPages.length}
                  </span>
                ) : undefined,
              },
              {
                id: "protect",
                label: "Protect PDF",
                icon: <Lock className="w-4 h-4 text-emerald-500" />,
              },
              {
                id: "unlock",
                label: "Unlock PDF",
                icon: <Unlock className="w-4 h-4 text-amber-500" />,
              },
              {
                id: "text",
                label: "Text to PDF",
                icon: <FileText className="w-4 h-4 text-purple-500" />,
              },
              {
                id: "pages",
                label: "Page Manager",
                icon: <Layers className="w-4 h-4 text-indigo-500" />,
              },
            ]}
          />
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
                  className="bg-muted px-2.5 py-1 rounded-lg border border-border text-foreground font-medium text-xs cursor-pointer"
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
                  const isHeic =
                    imgFile.name.toLowerCase().endsWith(".heic") ||
                    imgFile.name.toLowerCase().endsWith(".heif");
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
              <p className="text-[11px]">Click &ldquo;Add Photos / HEIC&rdquo; above to compile your PDF.</p>
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

      {/* Tab 2: PDF to Image */}
      {activeTab === "pdfToImage" && (
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-foreground">PDF to High-Res Image Extractor</h3>
                <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-extrabold border border-red-500/20">
                  PNG / JPG / WebP
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-extrabold border border-emerald-500/20">
                  Batch ZIP
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Convert PDF pages into crystal-clear images with full client-side privacy. Download single pages or the entire document as a ZIP.
              </p>
            </div>

            {pdfFile && (
              <button
                onClick={resetPdfToImage}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-lg border border-border bg-muted/40 transition-colors shrink-0 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Choose Another PDF
              </button>
            )}
          </div>

          {!pdfFile ? (
            /* Upload Dropzone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingPdf(true);
              }}
              onDragLeave={() => setIsDraggingPdf(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingPdf(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleSelectPdfFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => pdfInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all ${
                isDraggingPdf
                  ? "border-red-500 bg-red-500/5 scale-[0.99]"
                  : "border-border hover:border-red-500/50 hover:bg-muted/30"
              }`}
            >
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleSelectPdfFile(e.target.files[0]);
                  }
                }}
              />
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-foreground mb-1">
                Drop your PDF file here, or <span className="text-red-500 underline underline-offset-2">browse</span>
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Supports single or multi-page documents. Rendered 100% locally in your browser.
              </p>
            </div>
          ) : (
            /* PDF Document Active Settings */
            <div className="space-y-6">
              {/* Document Info Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{pdfFile.name}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      {formatFileSize(pdfFile.size)} •{" "}
                      {isAnalyzingPdf
                        ? "Inspecting document..."
                        : pdfMetadata
                        ? `${pdfMetadata.pageCount} ${pdfMetadata.pageCount === 1 ? "page" : "pages"}`
                        : "Ready"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">
                    Private &amp; Offline
                  </span>
                </div>
              </div>

              {/* Settings Toolbar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-muted/20 border border-border">
                {/* 1. Output Format */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Image Format
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 bg-muted/60 p-1 rounded-xl border border-border">
                    {(["png", "jpeg", "webp"] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setPdfOutputFormat(fmt)}
                        className={`py-1.5 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                          pdfOutputFormat === fmt
                            ? "bg-card text-foreground shadow-sm border border-border"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {fmt === "jpeg" ? "JPG" : fmt}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {pdfOutputFormat === "png"
                      ? "Lossless PNG with transparency preserved."
                      : pdfOutputFormat === "jpeg"
                      ? "Compact JPEG photo format."
                      : "Lightweight, next-gen WebP format."}
                  </p>
                </div>

                {/* 2. Resolution / DPI */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Resolution Quality
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 bg-muted/60 p-1 rounded-xl border border-border">
                    {[
                      { scale: 1.0, label: "1x", desc: "Standard (72 DPI)" },
                      { scale: 1.5, label: "1.5x HD", desc: "HD (150 DPI)" },
                      { scale: 2.0, label: "2x Crisp", desc: "Ultra HD (300 DPI)" },
                    ].map((item) => (
                      <button
                        key={item.scale}
                        onClick={() => setPdfScale(item.scale)}
                        className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          pdfScale === item.scale
                            ? "bg-card text-foreground shadow-sm border border-border"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        title={item.desc}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {pdfScale === 1.0
                      ? "Standard screen display, lowest file size."
                      : pdfScale === 1.5
                      ? "High-definition, clean reading on Retina displays."
                      : "Razor-sharp 300 DPI ultra-res for printing & presentation."}
                  </p>
                </div>

                {/* 3. Page Selection */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Pages to Extract
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 bg-muted/60 p-1 rounded-xl border border-border">
                    <button
                      onClick={() => setPageSelectionMode("all")}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        pageSelectionMode === "all"
                          ? "bg-card text-foreground shadow-sm border border-border"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      All ({pdfMetadata?.pageCount || 1})
                    </button>
                    <button
                      onClick={() => setPageSelectionMode("custom")}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        pageSelectionMode === "custom"
                          ? "bg-card text-foreground shadow-sm border border-border"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Custom
                    </button>
                  </div>
                  {pageSelectionMode === "custom" ? (
                    <input
                      type="text"
                      placeholder="e.g. 1-3, 5"
                      value={customRange}
                      onChange={(e) => setCustomRange(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-2.5 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  ) : (
                    <p className="text-[10px] text-muted-foreground">
                      Will convert every page in the document.
                    </p>
                  )}
                </div>
              </div>

              {/* Progress indicator during conversion */}
              {isConvertingPdf && (
                <div className="space-y-2 p-4 rounded-2xl bg-red-500/5 border border-red-500/20">
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                      Rendering page {currentConvertingPage} of {pdfMetadata?.pageCount || "?"}...
                    </span>
                    <span className="font-mono text-red-500">
                      {Math.round(convertProgress * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all duration-200 rounded-full"
                      style={{ width: `${Math.round(convertProgress * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              {convertedPages.length === 0 && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleStartPdfToImage}
                    disabled={isConvertingPdf || isAnalyzingPdf}
                    className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {isConvertingPdf ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Converting Pages...
                      </>
                    ) : (
                      <>
                        <FileImage className="w-4 h-4" />
                        Convert to Images
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Converted Pages Results Gallery */}
              {convertedPages.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-border">
                  {/* Gallery Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-muted/40 border border-border">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <span className="w-6 h-6 rounded-lg bg-green-500/15 text-green-500 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span>{convertedPages.length} {convertedPages.length === 1 ? "page" : "pages"} extracted</span>
                      <span className="text-muted-foreground font-normal">
                        ({pdfOutputFormat.toUpperCase()} • {pdfScale}x resolution)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownloadAllZip}
                        disabled={isZipping}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                      >
                        {isZipping ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Archiving...
                          </>
                        ) : (
                          <>
                            <Archive className="w-3.5 h-3.5" />
                            Download All (ZIP)
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setConvertedPages([]);
                        }}
                        className="px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        Re-convert
                      </button>
                    </div>
                  </div>

                  {/* Page Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {convertedPages.map((page, idx) => (
                      <div
                        key={page.pageNumber}
                        className="group relative flex flex-col rounded-2xl border border-border bg-muted/20 overflow-hidden hover:border-red-500/40 hover:shadow-md transition-all"
                      >
                        {/* Thumbnail Container */}
                        <div
                          onClick={() => setPreviewModalIndex(idx)}
                          className="relative aspect-[3/4] w-full bg-muted/40 flex items-center justify-center p-3 cursor-pointer overflow-hidden group/thumb"
                        >
                          <img
                            src={page.dataUrl}
                            alt={`Page ${page.pageNumber}`}
                            className="max-h-full max-w-full object-contain rounded-lg shadow-sm group-hover/thumb:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-background/50 opacity-0 group-hover/thumb:opacity-100 backdrop-blur-[2px] flex items-center justify-center transition-opacity gap-2">
                            <span className="p-2 rounded-xl bg-card text-foreground shadow-sm flex items-center gap-1 text-xs font-bold">
                              <Eye className="w-3.5 h-3.5 text-red-500" />
                              Inspect
                            </span>
                          </div>
                          {/* Page Number Badge */}
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-background/85 backdrop-blur-sm text-foreground text-[10px] font-bold border border-border shadow-xs">
                            Page {page.pageNumber}
                          </span>
                        </div>

                        {/* Card Info & Actions */}
                        <div className="p-3 border-t border-border flex items-center justify-between text-xs">
                          <div className="min-w-0">
                            <p className="font-mono text-[10px] text-muted-foreground">
                              {page.width} × {page.height} px
                            </p>
                            <p className="font-mono text-[10px] text-muted-foreground">
                              {formatFileSize(page.blob.size)}
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleCopyImage(page)}
                              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                              title="Copy image or link"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => downloadSinglePage(page)}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-card hover:bg-muted text-foreground border border-border rounded-lg font-bold text-[11px] cursor-pointer transition-colors shadow-xs"
                              title="Download this page image"
                            >
                              <Download className="w-3.5 h-3.5 text-red-500" />
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Protect PDF */}
      {activeTab === "protect" && (
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-foreground">Password Protect &amp; Encrypt PDF</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-extrabold border border-emerald-500/20">
                  100% Private
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Encrypt any PDF with user password protection and custom security permissions right in your browser.
              </p>
            </div>
            {protectFile && (
              <button
                onClick={resetProtectPdf}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-muted/50 hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change File
              </button>
            )}
          </div>

          {!protectFile ? (
            <div
              onClick={() => protectFileInputRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40 rounded-3xl p-8 text-center transition-all cursor-pointer group"
            >
              <input
                ref={protectFileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleSelectProtectFile(e.target.files[0]);
                }}
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Lock className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-foreground">Click to select or drag &amp; drop a PDF file</p>
              <p className="text-xs text-muted-foreground mt-1">Supports any PDF document (.pdf)</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected File Card */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{protectFile.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(protectFile.size)}</p>
                  </div>
                </div>
                <button
                  onClick={resetProtectPdf}
                  className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!protectedPdfUrl ? (
                <div className="space-y-5 bg-muted/10 p-5 rounded-2xl border border-border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* User Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-emerald-500" />
                        Set PDF Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={protectShowPassword ? "text" : "password"}
                          value={protectPassword}
                          onChange={(e) => setProtectPassword(e.target.value)}
                          placeholder="Enter a strong password"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setProtectShowPassword(!protectShowPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {protectShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={protectShowPassword ? "text" : "password"}
                          value={protectConfirmPassword}
                          onChange={(e) => setProtectConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className={`w-full px-3.5 py-2.5 rounded-xl border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                            protectConfirmPassword && protectPassword !== protectConfirmPassword
                              ? "border-red-500/50 focus:ring-red-500/20"
                              : "border-border focus:ring-primary/20"
                          }`}
                        />
                      </div>
                      {protectConfirmPassword && (
                        <p className="text-[11px] font-semibold mt-1">
                          {protectPassword === protectConfirmPassword ? (
                            <span className="text-emerald-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Passwords match
                            </span>
                          ) : (
                            <span className="text-red-500 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Passwords do not match
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Permissions Settings */}
                  <div className="pt-3 border-t border-border/60 space-y-2">
                    <p className="text-xs font-bold text-foreground">Security Permissions</p>
                    <div className="flex flex-wrap gap-4 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                        <input
                          type="checkbox"
                          checked={protectAllowPrint}
                          onChange={(e) => setProtectAllowPrint(e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary/20"
                        />
                        Allow Printing
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                        <input
                          type="checkbox"
                          checked={protectAllowCopy}
                          onChange={(e) => setProtectAllowCopy(e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary/20"
                        />
                        Allow Content Copying
                      </label>
                    </div>
                  </div>

                  {/* Protect Action Button */}
                  <button
                    onClick={handleStartProtectPdf}
                    disabled={isProtecting || !protectPassword.trim()}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProtecting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Encrypting PDF ({Math.round(protectProgress * 100)}%)...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Encrypt &amp; Protect PDF
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Protected PDF Ready Result */
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-foreground">PDF Protected Successfully!</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your document is now encrypted with password protection.
                    </p>
                    <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                      File Size: {formatFileSize(protectedFileSize)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <a
                      href={protectedPdfUrl}
                      download={`${protectFile.name.replace(/\.[^/.]+$/, "")}-protected.pdf`}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Download Protected PDF
                    </a>
                    <button
                      onClick={resetProtectPdf}
                      className="px-4 py-2.5 bg-card hover:bg-muted border border-border text-foreground font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      Protect Another PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Unlock PDF */}
      {activeTab === "unlock" && (
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-foreground">Unlock Password Protected PDF</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-extrabold border border-blue-500/20">
                  Instant Decrypt
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Remove passwords and security restrictions from encrypted PDF files directly on your local device.
              </p>
            </div>
            {unlockFile && (
              <button
                onClick={resetUnlockPdf}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-muted/50 hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change File
              </button>
            )}
          </div>

          {!unlockFile ? (
            <div
              onClick={() => unlockFileInputRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40 rounded-3xl p-8 text-center transition-all cursor-pointer group"
            >
              <input
                ref={unlockFileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleSelectUnlockFile(e.target.files[0]);
                }}
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Unlock className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-foreground">Click to select or drag &amp; drop a protected PDF</p>
              <p className="text-xs text-muted-foreground mt-1">Select an encrypted PDF document (.pdf)</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected File & Security Status Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{unlockFile.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{formatFileSize(unlockFile.size)}</span>
                      {isAnalyzingUnlock ? (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Analyzing security...
                        </span>
                      ) : unlockSecurityInfo?.isEncrypted ? (
                        <span className="px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold border border-amber-500/20 inline-flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Password Protected
                        </span>
                      ) : (
                        <span className="px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Unencrypted / Ready
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={resetUnlockPdf}
                  className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors self-end sm:self-center"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!unlockedPdfUrl ? (
                <div className="space-y-5 bg-muted/10 p-5 rounded-2xl border border-border">
                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-blue-500" />
                      PDF Password {unlockSecurityInfo?.requiresPassword && <span className="text-amber-500">(Required to decrypt)</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={unlockShowPassword ? "text" : "password"}
                        value={unlockPassword}
                        onChange={(e) => setUnlockPassword(e.target.value)}
                        placeholder="Enter the PDF password"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setUnlockShowPassword(!unlockShowPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {unlockShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      If the PDF has a password restriction, enter it above to unlock and generate an unprotected copy.
                    </p>
                  </div>

                  {/* Unlock Action Button */}
                  <button
                    onClick={handleStartUnlockPdf}
                    disabled={isUnlocking}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isUnlocking ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Decrypting PDF ({Math.round(unlockProgress * 100)}%)...
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4" />
                        Unlock &amp; Remove Password
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Unlocked PDF Ready Result */
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-foreground">PDF Password Removed!</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      All password security and restrictions have been successfully stripped from your document.
                    </p>
                    <p className="text-xs font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                      File Size: {formatFileSize(unlockedFileSize)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <a
                      href={unlockedPdfUrl}
                      download={`${unlockFile.name.replace(/\.[^/.]+$/, "")}-unlocked.pdf`}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Download Unlocked PDF
                    </a>
                    <button
                      onClick={resetUnlockPdf}
                      className="px-4 py-2.5 bg-card hover:bg-muted border border-border text-foreground font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      Unlock Another PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Text to PDF */}
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

      {/* Tab 4: PDF Page Manager */}
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
                    className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs cursor-pointer"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deletePage(page.id)}
                    className="p-1.5 rounded-lg bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive text-xs cursor-pointer"
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

      {/* Full Size Preview Modal */}
      {previewModalIndex !== null && convertedPages[previewModalIndex] && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setPreviewModalIndex(null)}
        >
          <div
            className="relative bg-card border border-border rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-foreground">
                  Page {convertedPages[previewModalIndex].pageNumber} of {convertedPages.length}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  ({convertedPages[previewModalIndex].width} ×{" "}
                  {convertedPages[previewModalIndex].height} px •{" "}
                  {formatFileSize(convertedPages[previewModalIndex].blob.size)})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadSinglePage(convertedPages[previewModalIndex])}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold uppercase transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
                <button
                  onClick={() => setPreviewModalIndex(null)}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Body */}
            <div className="relative flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-muted/20 min-h-[300px]">
              <img
                src={convertedPages[previewModalIndex].dataUrl}
                alt={`Preview Page ${convertedPages[previewModalIndex].pageNumber}`}
                className="max-h-[70vh] w-auto object-contain rounded-xl shadow-md"
              />

              {/* Navigation Arrows */}
              {previewModalIndex > 0 && (
                <button
                  onClick={() => setPreviewModalIndex(previewModalIndex - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/90 hover:bg-card border border-border text-foreground shadow-lg backdrop-blur-sm cursor-pointer"
                  title="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {previewModalIndex < convertedPages.length - 1 && (
                <button
                  onClick={() => setPreviewModalIndex(previewModalIndex + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/90 hover:bg-card border border-border text-foreground shadow-lg backdrop-blur-sm cursor-pointer"
                  title="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
