"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GlassPillTabs } from "@/components/ui/glass-pill-tabs";
import { base64Encode, base64Decode, fileToBase64, base64ToBlob } from "@/lib/converters/text-utils";
import { Copy, Check, Download, UploadCloud, ArrowRightLeft, FileCode } from "lucide-react";
import { toast } from "sonner";

export default function Base64ToolPage() {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [textInput, setTextInput] = useState("");
  const [textOutput, setTextOutput] = useState("");
  const [copied, setCopied] = useState(false);

  // File mode state
  const [fileB64, setFileB64] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState<number | null>(null);

  const handleEncodeText = () => {
    if (!textInput.trim()) return;
    try {
      const res = base64Encode(textInput);
      setTextOutput(res);
      toast.success("Encoded to Base64");
    } catch {
      toast.error("Failed to encode text");
    }
  };

  const handleDecodeText = () => {
    if (!textInput.trim()) return;
    try {
      const res = base64Decode(textInput);
      setTextOutput(res);
      toast.success("Decoded from Base64");
    } catch (e: any) {
      toast.error(e.message || "Invalid Base64 string");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize(file.size);
      try {
        const b64 = await fileToBase64(file);
        setFileB64(b64);
        toast.success(`Converted ${file.name} to Base64`);
      } catch {
        toast.error("Failed to convert file");
      }
    }
  };

  const handleCopy = (str: string) => {
    if (!str) return;
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  };

  const handleDownloadFileFromB64 = () => {
    if (!fileB64) return;
    try {
      const blob = base64ToBlob(fileB64);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "downloaded-file.bin";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to decode Base64 to file");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Base64" }]} />

      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Base64 Encoder & Decoder
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Encode and decode plain text or entire binary files to and from Base64 completely in your browser.
        </p>

        <div className="mt-6 flex justify-center">
          <GlassPillTabs
            activeTab={mode}
            onChange={(m) => setMode(m as "text" | "file")}
            layoutId="base64Tabs"
            tabs={[
              { id: "text", label: "Text Encode / Decode" },
              { id: "file", label: "File to Base64" },
            ]}
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {mode === "text" ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEncodeText}
                  className="px-4 py-2 bg-primary text-primary-foreground font-semibold text-xs rounded-xl hover:bg-primary/90 transition-all shadow-sm"
                >
                  Encode to Base64
                </button>
                <button
                  onClick={handleDecodeText}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs rounded-xl border border-border transition-all"
                >
                  Decode from Base64
                </button>
              </div>

              {textOutput && (
                <button
                  onClick={() => handleCopy(textOutput)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold rounded-xl border border-border transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Input Text</label>
                <textarea
                  rows={12}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter text to encode or Base64 string to decode..."
                  className="w-full bg-muted/30 border border-border rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Output Text</label>
                <textarea
                  readOnly
                  rows={12}
                  value={textOutput}
                  placeholder="(Result will appear here)"
                  className="w-full bg-muted/30 border border-border rounded-xl p-3 text-xs font-mono focus:outline-none text-muted-foreground"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:bg-muted/20 transition-colors">
              <input type="file" id="b64file" onChange={handleFileUpload} className="hidden" />
              <label htmlFor="b64file" className="cursor-pointer space-y-3 flex flex-col items-center">
                <UploadCloud className="w-10 h-10 text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Click to upload any file</p>
                  <p className="text-xs text-muted-foreground">Images, documents, audio, or binaries</p>
                </div>
              </label>
            </div>

            {fileB64 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    Base64 String ({fileName} — {Math.round(fileB64.length / 1024)} KB encoded)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(fileB64)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold rounded-lg border border-border transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copied" : "Copy Base64"}
                    </button>
                    <button
                      onClick={handleDownloadFileFromB64}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download File
                    </button>
                  </div>
                </div>
                <textarea
                  readOnly
                  rows={10}
                  value={fileB64}
                  className="w-full bg-muted/30 border border-border rounded-xl p-3 text-xs font-mono focus:outline-none text-muted-foreground break-all"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
