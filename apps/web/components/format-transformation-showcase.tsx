"use client";

import { useState, useRef, type MouseEvent, type TouchEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  SlidersHorizontal,
  Sparkles,
  Zap,
  CheckCircle2,
  FileDown,
  Layers,
  Eye,
  Maximize2,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

interface FormatPreset {
  id: string;
  name: string;
  extension: string;
  originalSize: string;
  convertedSize: string;
  reduction: string;
  timeMs: number;
  quality: string;
  color: string;
}

const PRESETS: FormatPreset[] = [
  {
    id: "webp",
    name: "WebP Modern",
    extension: ".webp",
    originalSize: "8.4 MB (Raw PNG)",
    convertedSize: "412 KB",
    reduction: "95%",
    timeMs: 140,
    quality: "Visually Lossless",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "avif",
    name: "AVIF Ultra",
    extension: ".avif",
    originalSize: "8.4 MB (Raw PNG)",
    convertedSize: "284 KB",
    reduction: "97%",
    timeMs: 280,
    quality: "Next-Gen Fidelity",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "jpeg",
    name: "JPEG Turbo",
    extension: ".jpg",
    originalSize: "8.4 MB (Raw PNG)",
    convertedSize: "720 KB",
    reduction: "91%",
    timeMs: 95,
    quality: "Standard Web (90%)",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "png",
    name: "PNG Optimized",
    extension: ".png",
    originalSize: "8.4 MB (Raw PNG)",
    convertedSize: "1.9 MB",
    reduction: "77%",
    timeMs: 180,
    quality: "Alpha Preserved",
    color: "from-emerald-500 to-teal-500",
  },
];

export function FormatTransformationShowcase() {
  const [activePreset, setActivePreset] = useState<FormatPreset>(PRESETS[0]);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header with Title & Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Live Demo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Zero Quality Loss. Maximum Compression.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            Drag the visual slider to inspect original high-res details versus client-side optimized output in real-time.
          </p>
        </div>

        {/* Format Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/80">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setActivePreset(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activePreset.id === preset.id
                  ? "bg-card text-foreground shadow-md border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {preset.extension.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Visual Comparison Stage */}
      <div className="relative rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl p-3 sm:p-5 shadow-2xl overflow-hidden">
        {/* Comparison Image Container */}
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden cursor-ew-resize select-none bg-black border border-white/10"
        >
          {/* Layer 1: Converted / Optimized Image (Right side underneath) */}
          <div className="absolute inset-0">
            <Image
              src="/graphics/sample-city.jpg"
              alt="Optimized output"
              fill
              priority
              className="object-cover object-center"
            />
            {/* Tag Badge: Output */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-emerald-500/30 text-white text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {activePreset.name} ({activePreset.convertedSize})
              </span>
            </div>
          </div>

          {/* Layer 2: Original Image (Left side clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <div className="relative w-full h-full min-w-[100vw] sm:min-w-[1000px]">
              <Image
                src="/graphics/sample-city.jpg"
                alt="Original file"
                fill
                priority
                className="object-cover object-center"
              />
            </div>
            {/* Tag Badge: Original */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Original PNG ({activePreset.originalSize})</span>
            </div>
          </div>

          {/* Draggable Divider Bar */}
          <div
            className="absolute top-0 bottom-0 z-30 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="relative h-full w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] -translate-x-1/2 flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-white text-black font-black flex items-center justify-center shadow-xl border-2 border-primary text-xs pointer-events-auto cursor-ew-resize">
                <SlidersHorizontal className="w-4 h-4 text-primary rotate-90" />
              </div>
            </div>
          </div>

          {/* Overlay Helper Instruction */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-white/80 pointer-events-none hidden sm:inline-block">
            ⟵ Drag slider to compare fidelity ⟶
          </div>
        </div>

        {/* Live Transformation Stats Matrix */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Size Reduction
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-emerald-500">
                -{activePreset.reduction}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">smaller</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Client WASM Time
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-foreground">
                {activePreset.timeMs}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">ms</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Visual Quality
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-black text-primary truncate">
                {activePreset.quality}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Data Sent to Server
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-cyan-500">0 Bytes</span>
              <span className="text-[10px] text-muted-foreground font-semibold">(100% Private)</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Processed instantly on your device via client-side WebAssembly.
          </p>
          <div className="flex items-center gap-2">
            <Link
              href="/convert/images"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm"
            >
              <span>Convert Images</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/tools/enhance"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border hover:border-primary/40 text-foreground text-xs font-bold hover:bg-muted/60 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>AI Photo Enhancer</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
