"use client";

import { useMemo } from "react";
import type { ImageHistogramData } from "@/lib/enhancer/photo-enhancer";

interface HistogramProps {
  data: ImageHistogramData | null;
  className?: string;
}

export function ImageHistogram({ data, className = "" }: HistogramProps) {
  const points = useMemo(() => {
    if (!data || data.maxCount === 0) return { luma: "", r: "", g: "", b: "" };

    const w = 256;
    const h = 50;
    const max = Math.log10(data.maxCount + 1);

    const makePath = (arr: Uint32Array) => {
      let d = `M 0 ${h} `;
      for (let i = 0; i < 256; i++) {
        const count = arr[i];
        const val = count === 0 ? 0 : Math.log10(count + 1) / max;
        const y = Math.round(h - val * (h - 2));
        d += `L ${i} ${y} `;
      }
      d += `L 255 ${h} Z`;
      return d;
    };

    return {
      luma: makePath(data.luma),
      r: makePath(data.r),
      g: makePath(data.g),
      b: makePath(data.b),
    };
  }, [data]);

  if (!data) return null;

  return (
    <div className={`p-3 rounded-2xl bg-muted/40 border border-border space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
        <span>Real-Time Component Histogram</span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-red-500">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> R
          </span>
          <span className="flex items-center gap-1 text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> G
          </span>
          <span className="flex items-center gap-1 text-blue-500">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> B
          </span>
          <span className="flex items-center gap-1 text-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" /> Luma
          </span>
        </div>
      </div>

      <div className="relative w-full h-[50px] bg-neutral-950 rounded-xl overflow-hidden border border-border/60">
        {/* Zone markers */}
        <div className="absolute inset-0 flex pointer-events-none opacity-20">
          <div className="w-1/3 border-r border-white/40" />
          <div className="w-1/3 border-r border-white/40" />
          <div className="w-1/3" />
        </div>

        <svg
          viewBox="0 0 256 50"
          preserveAspectRatio="none"
          className="w-full h-full opacity-80"
        >
          {/* Red channel */}
          <path d={points.r} fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" strokeWidth="0.8" />
          {/* Green channel */}
          <path d={points.g} fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="0.8" />
          {/* Blue channel */}
          <path d={points.b} fill="rgba(59, 130, 246, 0.25)" stroke="#3b82f6" strokeWidth="0.8" />
          {/* Luminance channel */}
          <path d={points.luma} fill="rgba(255, 255, 255, 0.3)" stroke="#ffffff" strokeWidth="1" />
        </svg>
      </div>

      <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
        <span>Shadows (0)</span>
        <span>Midtones (128)</span>
        <span>Highlights (255)</span>
      </div>
    </div>
  );
}
