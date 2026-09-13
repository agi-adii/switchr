"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Columns,
  SplitSquareVertical,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
} from "lucide-react";

interface BeforeAfterSliderProps {
  originalSrc: string;
  enhancedSrc: string;
  originalWidth: number;
  originalHeight: number;
  enhancedWidth: number;
  enhancedHeight: number;
  className?: string;
}

export function BeforeAfterSlider({
  originalSrc,
  enhancedSrc,
  originalWidth,
  originalHeight,
  enhancedWidth,
  enhancedHeight,
  className = "",
}: BeforeAfterSliderProps) {
  const [sliderPos, setSliderPos] = useState(50); // percentage (0 to 100)
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<"slider" | "sideBySide">("slider");
  const [showOriginalOnly, setShowOriginalOnly] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(pct);
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleEnd]);

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      {/* Viewport Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border">
          <button
            onClick={() => setViewMode("slider")}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              viewMode === "slider"
                ? "bg-card text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            Split Slider
          </button>
          <button
            onClick={() => setViewMode("sideBySide")}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              viewMode === "sideBySide"
                ? "bg-card text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            Side by Side
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Hold to Compare button */}
          <button
            onMouseDown={() => setShowOriginalOnly(true)}
            onMouseUp={() => setShowOriginalOnly(false)}
            onMouseLeave={() => setShowOriginalOnly(false)}
            onTouchStart={() => setShowOriginalOnly(true)}
            onTouchEnd={() => setShowOriginalOnly(false)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-muted/70 hover:bg-muted text-foreground border border-border text-[11px] font-bold select-none cursor-pointer transition-colors shadow-xs active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 text-primary" />
            Hold for Original
          </button>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(0.75, prev - 0.25))}
              disabled={zoomLevel <= 0.75}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[10px] px-1 text-foreground font-semibold">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(2.5, prev + 0.25))}
              disabled={zoomLevel >= 2.5}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel !== 1 && (
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 rounded-lg hover:bg-muted text-primary cursor-pointer"
                title="Reset zoom"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Image Comparison Frame */}
      {viewMode === "slider" ? (
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[560px] rounded-3xl border border-border bg-neutral-950 overflow-hidden select-none cursor-ew-resize shadow-lg group"
        >
          {/* Zoom container */}
          <div
            className="w-full h-full relative transition-transform duration-100 ease-out"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center center" }}
          >
            {/* Enhanced Image (Base Background) */}
            <img
              src={showOriginalOnly ? originalSrc : enhancedSrc}
              alt="Enhanced view"
              draggable={false}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            {/* Original Image (Clipped Left Layer) */}
            {!showOriginalOnly && (
              <div
                className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <img
                  src={originalSrc}
                  alt="Original view"
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          {/* Floating Badges */}
          {!showOriginalOnly && (
            <>
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-extrabold uppercase tracking-wider border border-white/10 shadow-md pointer-events-none">
                Original
              </div>
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-primary/80 backdrop-blur-md text-primary-foreground text-[10px] font-extrabold uppercase tracking-wider border border-white/15 shadow-md flex items-center gap-1 pointer-events-none">
                <Sparkles className="w-3 h-3" />
                AI Enhanced
              </div>
            </>
          )}

          {/* Split Divider & Handle */}
          {!showOriginalOnly && (
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-neutral-900 shadow-xl border-2 border-primary flex items-center justify-center pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18-6-6 6-6" />
                  <path d="m15 6 6 6-6 6" />
                </svg>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Side by Side Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {/* Left: Original */}
          <div className="relative aspect-[4/3] rounded-2xl border border-border bg-neutral-950 overflow-hidden shadow-sm flex flex-col items-center justify-center">
            <img
              src={originalSrc}
              alt="Original photo"
              className="w-full h-full object-contain p-2"
            />
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white/90 text-[10px] font-extrabold uppercase tracking-wider border border-white/10">
              Original ({originalWidth}×{originalHeight})
            </div>
          </div>

          {/* Right: Enhanced */}
          <div className="relative aspect-[4/3] rounded-2xl border border-border bg-neutral-950 overflow-hidden shadow-sm flex flex-col items-center justify-center">
            <img
              src={enhancedSrc}
              alt="Enhanced photo"
              className="w-full h-full object-contain p-2"
            />
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-primary/80 backdrop-blur-md text-primary-foreground text-[10px] font-extrabold uppercase tracking-wider border border-white/15 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Enhanced ({enhancedWidth}×{enhancedHeight})
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
