"use client";

import { useState, useEffect } from "react";
import { getHistory, deleteHistoryItem, clearHistory, HistoryItem } from "@/lib/history-store";
import { History, Download, Trash2, ShieldCheck, Clock, FileCheck } from "lucide-react";
import { formatFileSize } from "@/lib/registry";
import { toast } from "sonner";

export function HistorySection() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  const loadItems = () => {
    setHistoryItems(getHistory());
  };

  useEffect(() => {
    loadItems();
    const interval = setInterval(loadItems, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    loadItems();
    toast.success("Conversion removed from history");
  };

  const handleClear = () => {
    clearHistory();
    setHistoryItems([]);
    toast.success("History cleared");
  };

  return (
    <section id="history" className="w-full py-16 scroll-mt-16 bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <History className="w-3.5 h-3.5" />
              Local Guest History
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Recent Conversions
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Your recent conversions are preserved locally in your browser for convenience.
            </p>
          </div>

          {historyItems.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors border border-border self-start sm:self-auto"
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
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs sm:text-sm truncate text-foreground">
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
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
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
                Files are processed locally and kept private to this device.
              </span>
              <span>{historyItems.length} total conversions</span>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-3xl p-10 text-center text-muted-foreground space-y-2">
            <History className="w-8 h-8 mx-auto opacity-30" />
            <p className="text-xs font-medium">No conversions in your local history yet</p>
            <p className="text-[11px]">Convert a file above to see it recorded here.</p>
          </div>
        )}
      </div>
    </section>
  );
}
