"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { formatJson, minifyJson, validateJson } from "@/lib/converters/text-utils";
import { FileCode2, Copy, Check, Download, UploadCloud, AlertCircle, Sparkles, Minimize2 } from "lucide-react";
import { toast } from "sonner";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    if (!input.trim()) return;
    try {
      const err = validateJson(input);
      if (err) {
        setError(err);
        toast.error("Invalid JSON syntax");
        return;
      }
      setError(null);
      const res = formatJson(input);
      setOutput(res);
      toast.success("JSON formatted successfully");
    } catch (e: any) {
      setError(e.message || "Failed to format JSON");
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    try {
      const err = validateJson(input);
      if (err) {
        setError(err);
        toast.error("Invalid JSON syntax");
        return;
      }
      setError(null);
      const res = minifyJson(input);
      setOutput(res);
      toast.success("JSON minified");
    } catch (e: any) {
      setError(e.message || "Failed to minify JSON");
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const text = await e.target.files[0].text();
      setInput(text);
      setError(null);
      toast.success(`Loaded ${e.target.files[0].name}`);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "JSON Formatter" }]} />

      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          JSON Formatter & Validator
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Prettify, validate, and minify JSON data client-side with real-time error detection.
        </p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Actions bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleFormat}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-semibold text-xs rounded-xl hover:bg-primary/90 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Beautify
            </button>
            <button
              onClick={handleMinify}
              className="flex items-center gap-1.5 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs rounded-xl border border-border transition-all"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              Minify
            </button>
            <label className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold rounded-xl border border-border cursor-pointer transition-colors">
              <UploadCloud className="w-3.5 h-3.5" />
              Upload
              <input type="file" accept=".json,application/json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="flex items-center gap-2">
            {output && (
              <>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold rounded-xl border border-border transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Input JSON</label>
            <textarea
              rows={14}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              placeholder='{"name": "Switchr", "awesome": true}'
              className="w-full bg-muted/30 border border-border rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Formatted Output</label>
            <textarea
              readOnly
              rows={14}
              value={output}
              placeholder="(Beautified or minified JSON will appear here)"
              className="w-full bg-muted/30 border border-border rounded-xl p-3 text-xs font-mono focus:outline-none text-muted-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
