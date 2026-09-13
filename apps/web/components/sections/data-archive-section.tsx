"use client";

import { useState } from "react";
import { jsonToCsv, csvToJson, jsonToXml, xmlToJson } from "@/lib/converters/data-converter";
import { createZip } from "@/lib/converters/archive-tools";
import { FileCode, Archive, Download, Eye, FilePlus2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatFileSize } from "@/lib/registry";
import { GlassPillTabs } from "@/components/ui/glass-pill-tabs";

export function DataArchiveSection() {
  const [activeTab, setActiveTab] = useState<"data" | "archive">("data");

  // Data state
  const [inputFormat, setInputFormat] = useState<"json" | "csv" | "xml">("json");
  const [outputFormat, setOutputFormat] = useState<"csv" | "json" | "xml">("csv");
  const [dataInput, setDataInput] = useState<string>("");
  const [dataOutput, setDataOutput] = useState<string>("");
  const [previewRows, setPreviewRows] = useState<any[]>([]);

  // Archive state
  const [zipFiles, setZipFiles] = useState<File[]>([]);
  const [zipName, setZipName] = useState("");
  const [isZipping, setIsZipping] = useState(false);

  const handleConvertData = () => {
    try {
      let result = "";
      if (inputFormat === "json" && outputFormat === "csv") {
        result = jsonToCsv(dataInput);
        setPreviewRows(JSON.parse(dataInput));
      } else if (inputFormat === "csv" && outputFormat === "json") {
        const parsed = csvToJson(dataInput);
        result = JSON.stringify(parsed, null, 2);
        setPreviewRows(parsed);
      } else if (inputFormat === "json" && outputFormat === "xml") {
        result = jsonToXml(dataInput);
        setPreviewRows([]);
      } else if (inputFormat === "xml" && outputFormat === "json") {
        const parsed = xmlToJson(dataInput);
        result = JSON.stringify(parsed, null, 2);
        setPreviewRows(Array.isArray(parsed) ? parsed : [parsed]);
      } else {
        result = dataInput;
      }

      setDataOutput(result);
      toast.success(`Data converted from ${inputFormat.toUpperCase()} to ${outputFormat.toUpperCase()}!`);
    } catch (err: any) {
      toast.error(err.message || "Conversion failed. Please check syntax.");
    }
  };

  const handleDownloadData = () => {
    if (!dataOutput) return;
    const mime = outputFormat === "json" ? "application/json" : outputFormat === "csv" ? "text/csv" : "application/xml";
    const blob = new Blob([dataOutput], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `switchr-data.${outputFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
      a.download = `${zipName.trim() || "archive"}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("ZIP archive created and downloaded!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to create archive", { id: toastId });
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <section id="data-archive" className="w-full py-16 scroll-mt-16 border-t border-border">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-semibold mb-3">
            <FileCode className="w-3.5 h-3.5" />
            Data &amp; Archive Toolkit
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Structured Data &amp; ZIP Archive Suite
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mt-2">
            Transform JSON, CSV, and XML with instant table validation, or bundle multiple files into compressed ZIP archives.
          </p>

          {/* Glassmorphic Pill Tab Switcher */}
          <div className="mt-6 flex justify-center">
            <GlassPillTabs
              activeTab={activeTab}
              onChange={(tabId) => setActiveTab(tabId)}
              layoutId="homeDataArchiveTab"
              tabs={[
                {
                  id: "data",
                  label: "JSON / CSV / XML Converter",
                  icon: <FileCode className="w-4 h-4 text-emerald-500" />,
                },
                {
                  id: "archive",
                  label: `ZIP Archive Packager (${zipFiles.length})`,
                  icon: <Archive className="w-4 h-4 text-blue-500" />,
                },
              ]}
            />
          </div>
        </div>

        {/* Tab 1: Data Converter */}
        {activeTab === "data" && (
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span>From:</span>
                <select
                  value={inputFormat}
                  onChange={(e) => setInputFormat(e.target.value as any)}
                  className="bg-muted px-2.5 py-1.5 rounded-lg border border-border text-foreground font-mono"
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="xml">XML</option>
                </select>

                <span>To:</span>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as any)}
                  className="bg-muted px-2.5 py-1.5 rounded-lg border border-border text-foreground font-mono"
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                  <option value="xml">XML</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleConvertData}
                  className="py-2 px-4 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Convert Data
                </button>
                {dataOutput && (
                  <button
                    onClick={handleDownloadData}
                    className="flex items-center gap-1.5 py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download {outputFormat.toUpperCase()}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Input ({inputFormat.toUpperCase()})
                </label>
                <textarea
                  rows={10}
                  value={dataInput}
                  onChange={(e) => setDataInput(e.target.value)}
                  placeholder="Paste or type JSON, CSV, or XML data here..."
                  className="w-full bg-muted/40 border border-border rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Output ({outputFormat.toUpperCase()})
                </label>
                <textarea
                  readOnly
                  rows={10}
                  value={dataOutput || "(Click Convert Data above to view result)"}
                  className="w-full bg-muted/40 border border-border rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary text-muted-foreground"
                />
              </div>
            </div>

            {/* Interactive Data Table Preview */}
            {previewRows.length > 0 && typeof previewRows[0] === "object" && (
              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Eye className="w-3.5 h-3.5 text-primary" />
                  Table Preview ({previewRows.length} rows)
                </div>
                <div className="max-h-56 overflow-auto rounded-xl border border-border">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-muted/70 text-foreground font-semibold sticky top-0">
                      <tr>
                        {Object.keys(previewRows[0]).map((col) => (
                          <th key={col} className="p-2 border-b border-border font-mono text-[11px]">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {previewRows.slice(0, 10).map((row, i) => (
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
        )}

        {/* Tab 2: Archive Packager */}
        {activeTab === "archive" && (
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h3 className="font-bold text-lg text-foreground">Multi-File ZIP Packager</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select or drop files of any type to package into a single compressed .zip download.
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
                      placeholder="archive"
                      className="bg-muted px-3 py-1.5 rounded-lg border border-border text-xs font-semibold focus:outline-none"
                    />
                    <span className="text-xs text-muted-foreground font-mono">.zip</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setZipFiles([])}
                      className="px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={handleCreateZip}
                      disabled={isZipping}
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
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
                <p className="text-xs font-medium">No files selected for ZIP packaging</p>
                <p className="text-[11px]">Click &quot;Add Files&quot; above to bundle them.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
