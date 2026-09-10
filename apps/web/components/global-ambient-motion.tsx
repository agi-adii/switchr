"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulseSpeed: number;
  color: string;
}

export function GlobalAmbientMotion() {
  const reduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const animFrameId = useRef<number>(0);

  useEffect(() => {
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // Initial particles
    const particleCount = Math.min(38, Math.floor((width * height) / 30000));
    const colors = [
      "rgba(99, 102, 241,", // Indigo
      "rgba(56, 189, 248,", // Cyan
      "rgba(168, 85, 247,", // Violet
      "rgba(16, 185, 129,", // Emerald
    ];

    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.2 - Math.random() * 0.4, // float upwards
      size: 1 + Math.random() * 2.5,
      alpha: 0.15 + Math.random() * 0.4,
      pulseSpeed: 0.01 + Math.random() * 0.02,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let time = 0;

    const render = () => {
      time += 0.012;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const { x: mx, y: my } = mouseRef.current;

      // Draw soft interactive cursor glow if inside window
      if (mx > -500 && mx < width + 500 && my > -500 && my < height + 500) {
        const glowGradient = ctx.createRadialGradient(mx, my, 0, mx, my, 320);
        glowGradient.addColorStop(0, "rgba(99, 102, 241, 0.09)");
        glowGradient.addColorStop(0.5, "rgba(56, 189, 248, 0.04)");
        glowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = glowGradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw floating motion particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around bounds
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Slight oscillation
        const wave = Math.sin(time + p.x * 0.01) * 0.3;
        const currentAlpha = Math.max(
          0.05,
          p.alpha + Math.sin(time * 2 + p.y * 0.05) * 0.15
        );

        ctx.beginPath();
        ctx.arc(p.x + wave, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha.toFixed(3)})`;
        ctx.shadowColor = `${p.color}0.8)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrameId.current);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Moving Ambient Aurora Orbs */}
      <div className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-primary/18 via-indigo-600/12 to-transparent blur-[110px] animate-aurora-drift-1" />
      <div className="absolute top-[35%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-sky-500/14 via-cyan-400/10 to-transparent blur-[120px] animate-aurora-drift-2" />
      <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[45vw] rounded-full bg-gradient-to-tr from-purple-600/14 via-violet-500/10 to-transparent blur-[130px] animate-aurora-drift-3" />

      {/* Floating Canvas for moving dust particles and cursor spotlight */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-80" />
    </div>
  );
}
