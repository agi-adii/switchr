"use client";

import { useState } from "react";
import { Terminal, Cpu, ShieldCheck, CheckCircle2, Copy, Check, Code2 } from "lucide-react";
import { toast } from "sonner";

export function ApiHealthSection() {
  const [lang, setLang] = useState<"ts" | "wasm">("ts");
  const [copied, setCopied] = useState(false);

  const snippets = {
    ts: `// Direct Client-Side Transformation in Browser Memory
import { convertImage } from "@/lib/converters/image-converter";

const result = await convertImage(file, {
  toFormat: "webp",
  quality: 0.85
});
console.log("Converted Blob URL:", result.url);`,
    wasm: `// WebAssembly Processing Pipeline
// No server uploads • 100% Client-Side RAM
const response = await fetch("/ffmpeg/ffmpeg-core.wasm");
const wasmBuffer = await response.arrayBuffer();
console.log("Local WASM core initialized in browser sandbox");`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[lang]);
    setCopied(true);
    toast.success("Code snippet copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developer-api" className="w-full py-16 scroll-mt-16 bg-muted/20 border-t border-border">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-500 text-xs font-semibold mb-3">
            <Terminal className="w-3.5 h-3.5" />
            Client-Side Architecture &amp; Subsystems
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Open-Source Architecture &amp; Engine Status
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mt-2">
            100% in-browser transformation pipelines utilizing WebAssembly, Canvas APIs, and native browser threads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Architecture Snippet Column */}
          <div className="md:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">Engine:</span>
                  <span className="font-mono text-[11px] text-primary bg-primary/10 px-2 py-0.5 rounded">
                    Client-Side WASM / Canvas
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {(["ts", "wasm"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-colors ${
                        lang === l
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <pre className="p-4 bg-zinc-950 text-zinc-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-zinc-800">
                  {snippets[lang]}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 p-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs transition-colors cursor-pointer"
                  title="Copy code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Zero remote server uploads • Complete privacy guarantee
              </span>
              <span className="font-mono text-[11px]">Local RAM Sandbox</span>
            </div>
          </div>

          {/* Engine Status Column */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Cpu className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs text-foreground uppercase tracking-wider">
                Local Engine Status
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-semibold text-foreground">Canvas Image Engine</span>
                </div>
                <span className="text-[10px] font-mono text-green-600 bg-green-500/10 px-2 py-0.5 rounded font-bold">
                  Operational
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-semibold text-foreground">WebAssembly Subsystem</span>
                </div>
                <span className="text-[10px] font-mono text-green-600 bg-green-500/10 px-2 py-0.5 rounded font-bold">
                  Operational
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-semibold text-foreground">PDF Compilation Engine</span>
                </div>
                <span className="text-[10px] font-mono text-green-600 bg-green-500/10 px-2 py-0.5 rounded font-bold">
                  Operational
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-semibold text-foreground">Data &amp; ZIP Generator</span>
                </div>
                <span className="text-[10px] font-mono text-green-600 bg-green-500/10 px-2 py-0.5 rounded font-bold">
                  Operational
                </span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              All client-side engines ready in browser memory.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
