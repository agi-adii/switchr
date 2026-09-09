"use client";

import { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getHistory, deleteHistoryItem, clearHistory, HistoryItem } from "@/lib/history-store";
import { History, Download, Trash2, ShieldCheck, Clock, FileCheck, Sparkles } from "lucide-react";
import { formatFileSize } from "@/lib/registry";
import { toast } from "sonner";

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  const loadItems = () => {
    setHistoryItems(getHistory());
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    loadItems();
    toast.success("Item removed from history");
  };

  const handleClear = () => {
    clearHistory();
    setHistoryItems([]);
    toast.success("History cleared");
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <Breadcrumbs items={[{ label: "History" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
            <History className="w-3.5 h-3.5" />
            Local Conversion Log
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Conversion History
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Recent files processed on this device. Kept private in your browser storage.
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors border border-border self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear History
          </button>
        )}
      </div>

      {historyItems.length > 0 ? (
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="divide-y divide-border">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs sm:text-sm truncate text-foreground">
                      {item.fileName}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                      <span className="font-mono uppercase font-bold text-primary">
                        {item.fromFormat} → {item.toFormat}
                      </span>
                      <span>•</span>
                      <span>{formatFileSize(item.originalSize)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {item.downloadUrl && (
                    <a
                      href={item.downloadUrl}
                      download={`switchr-${item.fileName.split(".")[0]}.${item.toFormat}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                    title="Remove from history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-muted/40 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              Files are processed locally and preserved in your browser.
            </span>
            <span>{historyItems.length} records</span>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-3xl p-12 text-center text-muted-foreground space-y-3">
          <History className="w-10 h-10 mx-auto opacity-30" />
          <p className="text-sm font-semibold text-foreground">No recent conversions</p>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Files converted with Switchr will automatically appear here for convenient redownloading.
          </p>
        </div>
      )}
    </div>
  );
}
