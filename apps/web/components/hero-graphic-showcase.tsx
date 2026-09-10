"use client";

import { useState, type PointerEvent } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  FileImage,
  Video,
  Music,
  FileText,
  Layers,
  ArrowRightLeft,
} from "lucide-react";

export function HeroGraphicShowcase() {
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 12, y: y * -10 });
  };

  const handlePointerLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      className="relative w-full max-w-[540px] mx-auto select-none"
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={handlePointerLeave}
    >
      {/* Ambient background bloom */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 via-sky-500/20 to-purple-600/30 rounded-[3rem] filter blur-3xl opacity-70 pointer-events-none transition-opacity duration-700 -z-10" />

      {/* Main 3D Card Container */}
      <motion.div
        style={{
          transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative rounded-[2.5rem] border border-white/20 dark:border-white/10 bg-card/85 backdrop-blur-2xl p-4 sm:p-5 shadow-2xl shadow-primary/20 overflow-hidden"
      >
        {/* Top Header bar with status badge */}
        <div className="flex items-center justify-between gap-3 mb-3 px-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Local WASM Engine
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold">
            <Sparkles className="w-3 h-3" />
            <span>Zero Server Lag</span>
          </div>
        </div>

        {/* 3D Visual Artwork Canvas */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-b from-indigo-950/60 to-black/80 border border-white/10 shadow-inner group">
          <Image
            src="/graphics/hero-conversion-engine.jpg"
            alt="Switchr High-Speed 3D Conversion Engine"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Vignette Overlay for Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/30 pointer-events-none" />

          {/* Floating Live Interaction Format Tags */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card/90 backdrop-blur-md border border-white/20 text-foreground shadow-lg shadow-black/30 text-xs font-bold"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <FileImage className="w-3.5 h-3.5" />
            </div>
            <div className="text-left leading-none">
              <span className="block text-[11px] font-black">WEBP</span>
              <span className="text-[9px] text-emerald-400 font-semibold">-85% Size</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card/90 backdrop-blur-md border border-white/20 text-foreground shadow-lg shadow-black/30 text-xs font-bold"
          >
            <div className="w-6 h-6 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div className="text-left leading-none">
              <span className="block text-[11px] font-black">PDF Suite</span>
              <span className="text-[9px] text-muted-foreground font-medium">Vector Pure</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-16 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card/90 backdrop-blur-md border border-white/20 text-foreground shadow-lg shadow-black/30 text-xs font-bold"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Music className="w-3.5 h-3.5" />
            </div>
            <div className="text-left leading-none">
              <span className="block text-[11px] font-black">MP3 320k</span>
              <span className="text-[9px] text-cyan-400 font-medium">High Res</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute bottom-16 right-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card/90 backdrop-blur-md border border-white/20 text-foreground shadow-lg shadow-black/30 text-xs font-bold"
          >
            <div className="w-6 h-6 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center">
              <Video className="w-3.5 h-3.5" />
            </div>
            <div className="text-left leading-none">
              <span className="block text-[11px] font-black">MP4 / AV1</span>
              <span className="text-[9px] text-purple-400 font-medium">GPU Accel</span>
            </div>
          </motion.div>

          {/* Real-time conversion flow banner at bottom of image */}
          <div className="absolute bottom-3 inset-x-3 rounded-xl bg-background/80 backdrop-blur-md border border-border/60 p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-extrabold text-foreground">HEIC → WEBP</p>
                <p className="text-[9px] text-muted-foreground">Universal Cross-Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" />
              <span>In-Browser 0.1s</span>
            </div>
          </div>
        </div>

        {/* Bottom Technical Spec Bar */}
        <div className="mt-3.5 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-xl bg-muted/40 border border-border/40">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Privacy</p>
            <p className="text-xs font-black text-foreground mt-0.5">100% Local</p>
          </div>
          <div className="p-2 rounded-xl bg-muted/40 border border-border/40">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Latency</p>
            <p className="text-xs font-black text-emerald-500 mt-0.5">&lt; 250ms</p>
          </div>
          <div className="p-2 rounded-xl bg-muted/40 border border-border/40">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Daily Limit</p>
            <p className="text-xs font-black text-primary mt-0.5">Unlimited</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
