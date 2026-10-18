"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { urlEncode, urlDecode } from "@/lib/converters/text-utils";
import { Copy, Check, ArrowRightLeft, Link2 } from "lucide-react";
import { toast } from "sonner";

export default function UrlEncodePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    if (!input) return;
    setOutput(urlEncode(input));
    toast.success("URL encoded");
  };

  const handleDecode = () => {
    if (!input) return;
    try {
      setOutput(urlDecode(input));
      toast.success("URL decoded");
    } catch {
      toast.error("Invalid URL encoding sequence");
    }
  };

  const handleSwap = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "URL Encode" }]} />

      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          URL Encoder & Decoder
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Safely encode special characters for URLs or decode percent-encoded strings back to readable text.
        </p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleEncode}
              className="px-4 py-2 bg-primary text-primary-foreground font-semibold text-xs rounded-xl hover:bg-primary/90 transition-all shadow-sm"
            >
              Encode URL
            </button>
            <button
              onClick={handleDecode}
              className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs rounded-xl border border-border transition-all"
            >
              Decode URL
            </button>
            <button
              onClick={handleSwap}
              title="Swap input and output"
              className="p-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl border border-border transition-all"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {output && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold rounded-xl border border-border transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-foreground" />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Input Text</label>
            <textarea
              rows={12}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://example.com/search?query=hello world & format=json"
              className="w-full bg-muted/30 border border-border rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Output Text</label>
            <textarea
              readOnly
              rows={12}
              value={output}
              placeholder="(Encoded or decoded URL will appear here)"
              className="w-full bg-muted/30 border border-border rounded-xl p-3 text-xs font-mono focus:outline-none text-muted-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
