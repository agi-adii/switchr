"use client";

import { motion } from "framer-motion";
import { FileImage, Video, Music, FileText, Lock, Play } from "lucide-react";
import Image from "next/image";

// Sizes for the SVG coordinate space
const W = 640;
const H = 340;
const CX = W / 2;
const CY = H / 2 - 8;
const IS = 76; // icon box size in SVG units

const ICONS = [
  { id: "pdf",   x: 110, y: 56,  label: "PDF",   Icon: FileText,  color: "#ef4444", shadow: "rgba(239,68,68,0.55)",   bg: "from-red-700 to-red-500",          border: "rgba(248,113,113,0.6)", rotate: -8 },
  { id: "audio", x: 76,  y: 240, label: "Audio", Icon: Music,     color: "#a855f7", shadow: "rgba(168,85,247,0.55)",  bg: "from-purple-700 to-purple-500",     border: "rgba(192,132,252,0.6)", rotate:  5 },
  { id: "image", x: 456, y: 52,  label: "Image", Icon: FileImage, color: "#10b981", shadow: "rgba(16,185,129,0.55)",  bg: "from-emerald-600 to-teal-500",      border: "rgba(52,211,153,0.6)", rotate:  8 },
  { id: "video", x: 468, y: 244, label: "Video", Icon: Play,      color: "#3b82f6", shadow: "rgba(59,130,246,0.55)",  bg: "from-blue-700 to-blue-500",         border: "rgba(96,165,250,0.6)", rotate: -5 },
];

export function HeroGraphicShowcase() {
  return (
    <div className="relative w-full max-w-[780px] mx-auto select-none font-sans mb-10">

      {/* Left annotation */}
      <div className="absolute -left-4 sm:-left-28 top-[44%] -translate-y-1/2 hidden md:flex flex-col items-end gap-0.5 rotate-[-5deg] pointer-events-none z-10">
        <span className="font-serif italic text-[17px] text-white/75 leading-snug">Fast</span>
        <span className="font-serif italic text-[17px] text-white/75 leading-snug">Secure</span>
        <span className="font-serif italic text-[17px] text-white/75 leading-snug">Private</span>
        <svg width="44" height="38" viewBox="0 0 44 38" fill="none" className="mt-0.5 opacity-50">
          <path d="M4 4 Q 18 28 40 34" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M34 30 L40 34 L36 26" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Right annotation */}
      <div className="absolute -right-4 sm:-right-36 top-[18%] hidden md:flex flex-col items-start gap-0.5 rotate-[4deg] pointer-events-none z-10">
        <span className="font-serif italic text-[17px] text-white/75 leading-snug">All tools</span>
        <span className="font-serif italic text-[17px] text-white/75 leading-snug">in one place</span>
        <svg width="50" height="42" viewBox="0 0 50 42" fill="none" className="mt-0.5 opacity-50 self-end">
          <path d="M46 4 Q 28 26 6 36" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M12 32 L6 36 L10 28" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* macOS window */}
      <div className="relative rounded-[1.4rem] border border-white/10 bg-[#080b18] overflow-hidden shadow-2xl shadow-blue-950/60 flex flex-col">

        {/* Ambient radial glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_55%_50%_at_50%_46%,rgba(80,50,200,0.18),transparent)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_35%_35%_at_50%_50%,rgba(59,130,246,0.10),transparent)]" />

        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/30 shrink-0">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <div className="flex-1 flex justify-center items-center gap-1.5" style={{ marginLeft: "-3.5rem" }}>
            <Image src="/logo.jpg" alt="Switchr" width={16} height={16} className="rounded" onError={() => {}} />
            <span className="text-[12px] font-semibold text-white/75 tracking-wide">Switchr</span>
          </div>
        </div>

        {/* SVG canvas + icon overlays */}
        <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>

          {/* SVG: connection lines + folder */}
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="glow2" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="2.5" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="lineGlow2" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <radialGradient id="fglow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(99,102,241,0.5)"/>
                <stop offset="100%" stopColor="transparent"/>
              </radialGradient>
              <linearGradient id="fback" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(139,92,246,0.55)"/>
                <stop offset="100%" stopColor="rgba(80,40,180,0.30)"/>
              </linearGradient>
              <linearGradient id="fmid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(100,160,255,0.60)"/>
                <stop offset="100%" stopColor="rgba(50,80,200,0.35)"/>
              </linearGradient>
              <linearGradient id="ffront" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(140,195,255,0.70)"/>
                <stop offset="100%" stopColor="rgba(60,100,235,0.48)"/>
              </linearGradient>
            </defs>

            {/* Connection lines */}
            {ICONS.map((icon) => {
              const x1 = icon.x + IS / 2;
              const y1 = icon.y + IS / 2;
              const pathD = `M ${x1} ${y1} L ${CX} ${CY}`;
              const dur = icon.id === "pdf" ? 2.2 : icon.id === "audio" ? 2.9 : icon.id === "image" ? 2.5 : 2.7;
              const del = icon.id === "pdf" ? 0   : icon.id === "audio" ? 1.1 : icon.id === "image" ? 0.5 : 1.5;
              return (
                <g key={icon.id} filter="url(#lineGlow2)">
                  <line x1={x1} y1={y1} x2={CX} y2={CY}
                    stroke="rgba(139,92,246,0.22)" strokeWidth="1.5" strokeDasharray="5,4" />
                  {/* Traveling dot */}
                  <circle r="4" fill={icon.color} filter="url(#glow2)">
                    <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${del}s`} path={pathD} />
                  </circle>
                </g>
              );
            })}

            {/* Folder glow blob */}
            <ellipse cx={CX} cy={CY} rx="115" ry="95" fill="url(#fglow)" opacity="0.85" />

            {/* Back folder panel */}
            <rect x={CX - 88} y={CY - 78} width="158" height="114" rx="13"
              fill="url(#fback)" stroke="rgba(139,92,246,0.45)" strokeWidth="1.2" />

            {/* Middle folder panel */}
            <rect x={CX - 90} y={CY - 60} width="178" height="120" rx="13"
              fill="url(#fmid)" stroke="rgba(96,165,250,0.55)" strokeWidth="1.5" />

            {/* Front folder panel */}
            <rect x={CX - 86} y={CY - 42} width="170" height="128" rx="13"
              fill="url(#ffront)" stroke="rgba(165,210,255,0.70)" strokeWidth="1.8" />

            {/* Inner mini UI inside front panel */}
            <rect x={CX - 32} y={CY - 12} width="62" height="58" rx="10"
              fill="rgba(8,11,24,0.88)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
            <circle cx={CX - 18} cy={CY + 4} r="7" fill="rgba(239,68,68,0.88)" />
            <rect x={CX - 6} y={CY - 2} width="26" height="10" rx="5" fill="rgba(96,165,250,0.88)" />
            <rect x={CX - 26} y={CY + 18} width="50" height="10" rx="5" fill="rgba(139,92,246,0.88)" />
          </svg>

          {/* Icon overlays — absolutely positioned using percentage */}
          {ICONS.map((icon, i) => {
            const lp = (icon.x / W) * 100;
            const tp = (icon.y / H) * 100;
            const wp = (IS / W) * 100;
            const hp = (IS / H) * 100;
            const floatY = i % 2 === 0 ? [-5, 5, -5] : [5, -5, 5];
            const dur = [4.0, 4.6, 3.8, 4.3][i];
            const del = [0,   0.9, 0.4, 1.3][i];

            return (
              <motion.div
                key={icon.id}
                animate={{ y: floatY }}
                transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay: del }}
                style={{
                  position: "absolute",
                  left: `${lp}%`,
                  top: `${tp}%`,
                  width: `${wp}%`,
                  paddingTop: `${hp}%`,
                  transform: `rotate(${icon.rotate}deg)`,
                }}
                className="z-30"
              >
                <div
                  className={`absolute inset-0 rounded-[22%] bg-gradient-to-br ${icon.bg} flex flex-col items-center justify-center gap-1`}
                  style={{
                    border: `1.5px solid ${icon.border}`,
                    boxShadow: `0 0 28px 6px ${icon.shadow}, inset 0 1px 0 rgba(255,255,255,0.25)`,
                  }}
                >
                  <icon.Icon className="w-[38%] h-[38%] text-white drop-shadow-lg" />
                  <span className="text-[10px] font-extrabold tracking-wide text-white/90">{icon.label}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

