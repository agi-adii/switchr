import { ToolJsonLd } from "@/components/seo/json-ld";
import { ToolSeoContent } from "@/components/seo/tool-seo-content";
"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GlassPillTabs } from "@/components/ui/glass-pill-tabs";
import { createZip, extractZip, ZipEntry } from "@/lib/converters/archive-tools";
import { Archive, Download, FilePlus2, Trash2, FolderOpen, FileCheck } from "lucide-react";
import { toast } from "sonner";
import { formatFileSize } from "@/lib/registry";


const ARCHIVE_HOW_TO_STEPS = [
  {
    name: "Choose Create or Extract Tab",
    text: "Select 'Create ZIP' to package multiple files into a clean archive, or 'Extract ZIP' to inspect and download files from an existing .zip archive.",
  },
  {
    name: "Select Your Files or Archive",
    text: "Drop single or multiple documents, images, or code files to compress, or upload an existing .zip archive to inspect its directory structure.",
  },
  {
    name: "Download Extracted or Compressed Archive",
    text: "Click download to unpack individual files or export your standardized ZIP archive instantly with zero software installation.",
  },
];

const ARCHIVE_FAQS = [
  {
    question: "Can I open and extract ZIP files on mobile or Chromebook without WinRAR or 7-Zip?",
    answer: "Yes! Switchr unpacks ZIP files directly in your web browser using client-side JSZip WebAssembly. You do not need to install WinRAR, 7-Zip, or any third-party software.",
  },
  {
    question: "Are my archived files uploaded to any cloud server?",
    answer: "Never. All archive extraction and compression execute 100% locally in your browser memory sandbox. Not a single byte is ever transmitted across the internet.",
  },
  {
    question: "Can I bundle mixed file types (PDFs, Word docs, photos) into a single ZIP?",
    answer: "Yes! You can bundle any combination of files into a clean, organized ZIP archive for convenient email attachments or project backups.",
  },
  {
    question: "Is there a limit on file size or archive capacity?",
    answer: "There are no cloud limits, subscriptions, or daily caps. Capacity is determined solely by your computer or phone's available RAM memory.",
  },
  {
    question: "Will the created ZIP open natively on Windows and Mac?",
    answer: "Yes! Switchr creates standard Deflate PKZIP archives that open out-of-the-box in Windows File Explorer, macOS Archive Utility, and Linux without issues.",
  },
  {
    question: "Is this online archive tool completely free?",
    answer: "Yes, 100% free with no watermarks, no sign-ups, and no advertising delays.",
  },
];

export default function ArchiveToolsPage() {
  const [activeTab, setActiveTab] = useState<"create" | "extract">("create");

  // Create ZIP state
  const [zipFiles, setZipFiles] = useState<File[]>([]);
  const [zipName, setZipName] = useState("");
  const [isZipping, setIsZipping] = useState(false);

  // Extract ZIP state
  const [extractedEntries, setExtractedEntries] = useState<ZipEntry[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleCreateZip = async () => {
    if (zipFiles.length === 0) return;
    setIsZipping(true);
    const toastId = toast.loading(`Archiving ${zipFiles.length} files...`);

    try {
      const items = zipFiles.map((f) => ({ name: f.name, file: f }));
      const zipBlob = await createZip(items);
      const url = URL.createObjectURL(zipBlob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${zipName.trim() || "switchr-archive"}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("ZIP archive created and downloaded!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to create archive", { id: toastId });
    } finally {
      setIsZipping(false);
    }
  };

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsExtracting(true);
      const toastId = toast.loading(`Reading ${file.name}...`);

      try {
        const entries = await extractZip(file);
        setExtractedEntries(entries);
        toast.success(`Extracted ${entries.length} files from archive!`, { id: toastId });
      } catch (err: any) {
        toast.error("Failed to read ZIP archive", { id: toastId });
      } finally {
        setIsExtracting(false);
      }
    }
  };

  const handleDownloadSingle = (entry: ZipEntry) => {
    const url = URL.createObjectURL(entry.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = entry.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Archive Tools" }]} />

      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold mb-2">
          <Archive className="w-3.5 h-3.5" />
          Archive Suite
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          ZIP Creator &amp; Extractor
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Package multiple files into a compressed ZIP or inspect and extract archive contents.
        </p>

        {/* Glassmorphic Pill Tab Switcher */}
        <div className="mt-6 flex justify-center">
          <GlassPillTabs
            activeTab={activeTab}
            onChange={(tabId) => setActiveTab(tabId)}
            layoutId="archiveToolsTab"
            tabs={[
              {
                id: "create",
                label: `Create ZIP (${zipFiles.length})`,
                icon: <Archive className="w-4 h-4 text-blue-500" />,
              },
              {
                id: "extract",
                label: `Extract ZIP (${extractedEntries.length})`,
                icon: <FolderOpen className="w-4 h-4 text-indigo-500" />,
              },
            ]}
          />
        </div>
      </div>

      {/* Tab 1: Create ZIP */}
      {activeTab === "create" && (
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h3 className="font-bold text-sm text-foreground">Multi-File ZIP Packager</h3>
              <p className="text-xs text-muted-foreground">
                Drop any files to bundle them into a single compressed .zip file.
              </p>
            </div>

            <label className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl cursor-pointer hover:bg-primary/90 transition-colors shadow-sm self-start sm:self-auto">
              <FilePlus2 className="w-4 h-4" />
              Add Files
              <input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setZipFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
                  }
                }}
                className="hidden"
              />
            </label>
          </div>

          {zipFiles.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {zipFiles.map((zf, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30 text-xs"
                  >
                    <span className="font-medium truncate text-foreground">{zf.name}</span>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-muted-foreground font-mono text-[11px]">
                        {formatFileSize(zf.size)}
                      </span>
                      <button
                        onClick={() => setZipFiles((prev) => prev.filter((_, i) => i !== idx))}
                        className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-muted-foreground font-semibold">ZIP Name:</span>
                  <input
                    type="text"
                    value={zipName}
                    onChange={(e) => setZipName(e.target.value)}
                    placeholder="switchr-archive"
                    className="bg-muted px-3 py-1.5 rounded-lg border border-border text-xs font-semibold focus:outline-none"
                  />
                  <span className="text-xs text-muted-foreground font-mono">.zip</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZipFiles([])}
                    className="px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={handleCreateZip}
                    disabled={isZipping}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    {isZipping ? "Creating ZIP..." : `Download ZIP (${zipFiles.length})`}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground space-y-2">
              <Archive className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-xs font-medium">No files selected yet</p>
              <p className="text-[11px]">Click &ldquo;Add Files&rdquo; above to package them into a ZIP.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Extract ZIP */}
      {activeTab === "extract" && (
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h3 className="font-bold text-sm text-foreground">ZIP Archive Extractor</h3>
              <p className="text-xs text-muted-foreground">
                Upload a .zip file to inspect and download individual files.
              </p>
            </div>

            <label className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl cursor-pointer hover:bg-primary/90 transition-colors shadow-sm self-start sm:self-auto">
              <FolderOpen className="w-4 h-4" />
              Choose ZIP
              <input type="file" accept=".zip" onChange={handleZipUpload} className="hidden" />
            </label>
          </div>

          {extractedEntries.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground">
                Found {extractedEntries.length} file(s) inside archive:
              </p>
              <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                {extractedEntries.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-muted/20 flex items-center justify-between gap-3 text-xs hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileCheck className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-semibold text-foreground truncate">{item.name}</span>
                      <span className="text-muted-foreground font-mono text-[11px] shrink-0">
                        ({formatFileSize(item.size)})
                      </span>
                    </div>

                    <button
                      onClick={() => handleDownloadSingle(item)}
                      className="flex items-center gap-1 py-1 px-2.5 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg font-semibold text-[11px] transition-colors shrink-0"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground space-y-2">
              <FolderOpen className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-xs font-medium">No ZIP archive loaded</p>
              <p className="text-[11px]">Click &ldquo;Choose ZIP&rdquo; above to extract files.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Search Engine Rich Snippet JSON-LD & High-Authority SEO Content ── */}
      <ToolJsonLd
        name="Free Online ZIP & Archive Studio"
        description="Extract, inspect, and create ZIP and TAR archives directly in your browser with 100% privacy and zero server uploads."
        url="/tools/archive"
        category="UtilitiesApplication"
        features={[
          "ZIP archive extractor and inspector",
          "Multi-file ZIP bundle creator",
          "Standard Deflate PKZIP compression level 6",
          "Zero software installation required",
          "100% In-Browser client-side processing",
          "Zero file uploads to cloud servers",
        ]}
        howTo={ARCHIVE_HOW_TO_STEPS}
        faqs={ARCHIVE_FAQS}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Archive Studio", url: "/tools/archive" },
        ]}
      />

      <ToolSeoContent
        toolName="Switchr Archive Studio"
        badge="100% In-Browser & Private"
        heading="Free Online ZIP Tool – Extract, Unzip & Create ZIP Archives"
        subheading="Open, inspect, and package files into compressed ZIP archives right in your browser. No WinRAR or 7-Zip required."
        overviewParagraphs={[
          "Switchr's Archive Studio provides a lightweight, instant alternative to heavy desktop archivers. Whether you need to inspect the contents of a ZIP file received on a mobile phone or bundle 20 work documents into a single tidy archive for email, everything happens inside your browser tab.",
          "Because compression and extraction run locally via client-side WebAssembly, your confidential files never leave your computer. Enjoy blazing fast archive management with zero privacy risks, no file quotas, and no subscription paywalls.",
        ]}
        steps={ARCHIVE_HOW_TO_STEPS}
        faqs={ARCHIVE_FAQS}
        relatedLinks={[
          { label: "Extract ZIP Online", href: "/convert/extract-zip", desc: "Unpack and download files from ZIP archives.", badge: "Fast" },
          { label: "Create ZIP Online", href: "/convert/create-zip", desc: "Package multiple files into a clean archive." },
          { label: "Smart File Compressor", href: "/compress", desc: "Reduce image and PDF file sizes by up to 80%." },
          { label: "PDF Tools Suite", href: "/pdf-tools", desc: "Merge, split, protect, and convert PDF documents." },
          { label: "Image Converter", href: "/convert/images", desc: "Convert JPG, PNG, WebP, and HEIC photos." },
          { label: "All File Tools", href: "/tools", desc: "Browse the complete directory of free web utilities." },
        ]}
      />
    </div>
  );
}
