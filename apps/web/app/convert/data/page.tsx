"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { jsonToCsv, csvToJson, jsonToXml, xmlToJson } from "@/lib/converters/data-converter";
import { FileCode, Download, Eye, UploadCloud, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { saveHistoryItem } from "@/lib/history-store";

export default function DataConverterPage() {
  const [activeTab, setActiveTab] = useState<"json" | "csv" | "xml">("json");
  const [targetFormat, setTargetFormat] = useState<string>("csv");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      const text = await f.text();
      setInputText(text);
      setOutputText("");
      setPreviewRows([]);
      toast.success(`Loaded ${f.name}`);
    }
  };

  const handleConvert = () => {
    if (!inputText.trim()) {
      toast.warning("Please enter or upload data first");
      return;
    }
    setIsProcessing(true);

    try {
      let result = "";
      if (activeTab === "json" && targetFormat === "csv") {
        result = jsonToCsv(inputText);
        setPreviewRows(JSON.parse(inputText));
      } else if (activeTab === "csv" && targetFormat === "json") {
        const parsed = csvToJson(inputText);
        result = JSON.stringify(parsed, null, 2);
        setPreviewRows(parsed);
      } else if (activeTab === "json" && targetFormat === "xml") {
        result = jsonToXml(inputText);
        setPreviewRows([]);
      } else if (activeTab === "xml" && targetFormat === "json") {
        const parsed = xmlToJson(inputText);
        result = JSON.stringify(parsed, null, 2);
        setPreviewRows(Array.isArray(parsed) ? parsed : [parsed]);
      } else {
        result = inputText;
      }

      setOutputText(result);
      saveHistoryItem({
        fileName: `data-export.${targetFormat}`,
        fromFormat: activeTab,
        toFormat: targetFormat,
        originalSize: new Blob([inputText]).size,
        convertedSize: new Blob([result]).size,
        category: "data",
      });
      toast.success(`Converted ${activeTab.toUpperCase()} to ${targetFormat.toUpperCase()}!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to parse data");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    const mime = targetFormat === "json" ? "application/json" : targetFormat === "csv" ? "text/csv" : "application/xml";
    const blob = new Blob([outputText], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `switchr-data.${targetFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <Breadcrumbs items={[{ label: "Convert", href: "/convert" }, { label: "Data" }]} />

      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Structured Data Converter
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Convert between JSON, CSV, and XML with instant validation and table preview.
        </p>

        {/* Source Tabs */}
        <div className="inline-flex p-1 bg-muted rounded-2xl border border-border mt-4">
          {(["json", "csv", "xml"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setActiveTab(t);
                setTargetFormat(t === "json" ? "csv" : "json");
                setOutputText("");
                setPreviewRows([]);
              }}
              className={`px-5 py-1.5 text-xs font-bold uppercase rounded-xl transition-all ${
                activeTab === t
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              From {t}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span>Target Output:</span>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
              className="bg-muted px-3 py-1.5 rounded-lg border border-border text-foreground font-mono text-xs uppercase"
            >
              {activeTab === "json" && (
                <>
                  <option value="csv">CSV Spreadsheet</option>
                  <option value="xml">XML Document</option>
                </>
              )}
              {activeTab === "csv" && (
                <>
                  <option value="json">JSON Array</option>
                </>
              )}
              {activeTab === "xml" && (
                <>
                  <option value="json">JSON Object</option>
                </>
              )}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold rounded-xl border border-border cursor-pointer transition-colors">
              <UploadCloud className="w-3.5 h-3.5" />
              Upload File
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={handleConvert}
              disabled={isProcessing}
              className="py-2 px-5 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-primary/90 transition-all shadow-sm"
            >
              Convert Data
            </button>

            {outputText && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            )}
          </div>
        </div>

        {/* Textareas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Input {activeTab.toUpperCase()}
            </label>
            <textarea
              rows={11}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Paste or type ${activeTab.toUpperCase()} data here...`}
              className="w-full bg-muted/30 border border-border rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Output {targetFormat.toUpperCase()}
            </label>
            <textarea
              readOnly
              rows={11}
              value={outputText || "(Converted output will appear here)"}
              className="w-full bg-muted/30 border border-border rounded-xl p-3 text-xs font-mono focus:outline-none text-muted-foreground"
            />
          </div>
        </div>

        {/* Live Table Preview */}
        {previewRows.length > 0 && typeof previewRows[0] === "object" && (
          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <Eye className="w-4 h-4 text-primary" />
              <span>Parsed Table Preview ({previewRows.length} rows)</span>
            </div>
            <div className="max-h-56 overflow-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted text-foreground font-semibold sticky top-0">
                  <tr>
                    {Object.keys(previewRows[0]).map((col) => (
                      <th key={col} className="p-2 border-b border-border font-mono text-[11px]">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {previewRows.slice(0, 15).map((row, i) => (
                    <tr key={i} className="hover:bg-muted/30">
                      {Object.values(row).map((val: any, j) => (
                        <td key={j} className="p-2 text-muted-foreground text-[11px] font-mono">
                          {typeof val === "object" ? JSON.stringify(val) : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
