"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { removeDuplicateRows, trimCsvWhitespace } from "@/lib/converters/text-utils";
import { Table, UploadCloud, Download, Copy, Check, Trash2, Sparkles, Filter } from "lucide-react";
import { toast } from "sonner";

export default function CsvCleanupPage() {
  const [inputCsv, setInputCsv] = useState("");
  const [outputCsv, setOutputCsv] = useState("");
  const [removedCount, setRemovedCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleClean = () => {
    if (!inputCsv.trim()) return;
    try {
      const trimmed = trimCsvWhitespace(inputCsv);
      const { result, removed } = removeDuplicateRows(trimmed);
      setOutputCsv(result);
      setRemovedCount(removed);
      toast.success(`Removed ${removed} duplicate rows!`);
    } catch {
      toast.error("Failed to parse CSV");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const text = await e.target.files[0].text();
      setInputCsv(text);
      setOutputCsv("");
      setRemovedCount(null);
      toast.success(`Loaded ${e.target.files[0].name}`);
    }
  };

  const handleDownload = () => {
    if (!outputCsv) return;
    const blob = new Blob([outputCsv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cleaned-data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!outputCsv) return;
    navigator.clipboard.writeText(outputCsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Cleaned CSV copied to clipboard");
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "CSV Cleanup" }]} />

      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          CSV Deduplication & Cleanup
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Remove duplicate rows, strip leading/trailing whitespace, and clean up messy spreadsheet data client-side.
        </p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleClean}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-semibold text-xs rounded-xl hover:bg-primary/90 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Deduplicate & Clean
            </button>
            <label className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold rounded-xl border border-border cursor-pointer transition-colors">
              <UploadCloud className="w-3.5 h-3.5" />
              Upload CSV
              <input type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="flex items-center gap-2">
            {outputCsv && (
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
                  Download CSV
                </button>
              </>
            )}
          </div>
        </div>

        {removedCount !== null && (
          <div className="p-3 bg-primary/10 border border-primary/20 text-foreground rounded-xl text-xs font-semibold flex items-center justify-between">
            <span>✨ Cleanup Results:</span>
            <span className="font-mono text-primary font-bold">
              {removedCount} duplicate {removedCount === 1 ? "row" : "rows"} removed
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Original CSV</label>
            <textarea
              rows={14}
              value={inputCsv}
              onChange={(e) => {
                setInputCsv(e.target.value);
                setRemovedCount(null);
              }}
              placeholder={"id,name,email\n1,Alice,alice@example.com\n2,Bob,bob@example.com\n1,Alice,alice@example.com"}
              className="w-full bg-muted/30 border border-border rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Cleaned CSV</label>
            <textarea
              readOnly
              rows={14}
              value={outputCsv}
              placeholder="(Deduplicated and trimmed CSV will appear here)"
              className="w-full bg-muted/30 border border-border rounded-xl p-3 text-xs font-mono focus:outline-none text-muted-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
