"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  life: number;
  decay: number;
  color: string;
  type: "diamond" | "cross" | "spark" | "ring";
}

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
}

export function GlobalAmbientMotion() {
  const reduceMotion = useReducedMotion();
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const fgCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameId = useRef<number>(0);

  useEffect(() => {
    if (reduceMotion) return;

    const bgCanvas = bgCanvasRef.current;
    const fgCanvas = fgCanvasRef.current;
    if (!bgCanvas || !fgCanvas) return;

    const bgCtx = bgCanvas.getContext("2d");
    const fgCtx = fgCanvas.getContext("2d");
    if (!bgCtx || !fgCtx) return;

    let width = (bgCanvas.width = fgCanvas.width = window.innerWidth);
    let height = (bgCanvas.height = fgCanvas.height = window.innerHeight);

    const handleResize = () => {
      if (!bgCanvas || !fgCanvas) return;
      width = bgCanvas.width = fgCanvas.width = window.innerWidth;
      height = bgCanvas.height = fgCanvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // ── Mouse / Cursor State ─────────────────────────────────────────
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      prevX: -1000,
      prevY: -1000,
      vx: 0,
      vy: 0,
      speed: 0,
      isActive: false,
      idleTimer: 0,
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      if (!mouse.isActive) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.prevX = e.clientX;
        mouse.prevY = e.clientY;
        mouse.isActive = true;
      }
      mouse.idleTimer = 0;
    };

    const handlePointerLeave = () => {
      mouse.isActive = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);

    // ── Harmonically Ordered Color Palettes for Continuous Fluid Cycles ────
    interface ColorPalette {
      name: string;
      bands: number[]; // 7 base hues for vertical rainbow curtain
      orbHueRange: [number, number]; // [minHue, maxHue] for floating orbs
      accentRgb: [number, number, number]; // Constellation links & cursor glow
      beamRgb: [number, number, number];   // Cursor center beam
      particles: string[]; // Sparkle shimmer colors
    }

    const PALETTES: ColorPalette[] = [
      // 1. Cyberpunk Violet (Pink, Fuchsia, Violet, Indigo, Cyan, Emerald, Magenta)
      {
        name: "Cyberpunk Violet",
        bands: [330, 298, 275, 245, 210, 180, 318],
        orbHueRange: [280, 335],
        accentRgb: [217, 70, 239],
        beamRgb: [244, 63, 94],
        particles: ["#ec4899", "#d946ef", "#a855f7", "#38bdf8", "#f43f5e", "#ffffff"],
      },
      // 2. Deep Twilight (Violet, Deep Purple, Royal Indigo, Cobalt, Azure, Lavender)
      {
        name: "Deep Twilight",
        bands: [280, 260, 242, 222, 202, 185, 270],
        orbHueRange: [240, 280],
        accentRgb: [168, 85, 247],
        beamRgb: [99, 102, 241],
        particles: ["#a855f7", "#c084fc", "#818cf8", "#6366f1", "#c4b5fd", "#ffffff"],
      },
      // 3. Oceanic Azure & Teal (Royal Blue, Cyan, Aquamarine, Mint, Emerald)
      {
        name: "Oceanic Azure",
        bands: [230, 210, 195, 180, 165, 150, 220],
        orbHueRange: [180, 225],
        accentRgb: [56, 189, 248],
        beamRgb: [45, 212, 191],
        particles: ["#38bdf8", "#06b6d4", "#2dd4bf", "#10b981", "#60a5fa", "#ffffff"],
      },
      // 4. Aurora Emerald (Emerald, Teal, Cyan, Sky, Indigo, Mint)
      {
        name: "Aurora Emerald",
        bands: [160, 180, 200, 225, 250, 175, 155],
        orbHueRange: [145, 195],
        accentRgb: [16, 185, 129],
        beamRgb: [6, 182, 212],
        particles: ["#10b981", "#34d399", "#22d3ee", "#818cf8", "#6ee7b7", "#ffffff"],
      },
      // 5. Cosmic Sunset (Plum, Magenta, Hot Pink, Crimson, Amber Orange, Rose)
      {
        name: "Cosmic Sunset",
        bands: [285, 310, 335, 355, 18, 340, 295],
        orbHueRange: [325, 360],
        accentRgb: [244, 63, 94],
        beamRgb: [251, 146, 60],
        particles: ["#f43f5e", "#fb923c", "#f59e0b", "#d946ef", "#fda4af", "#ffffff"],
      },
      // 6. Solar Amber (Crimson, Coral, Tangerine, Golden Amber, Warm Orange)
      {
        name: "Solar Amber",
        bands: [348, 10, 28, 44, 24, 358, 338],
        orbHueRange: [15, 45],
        accentRgb: [249, 115, 22],
        beamRgb: [234, 179, 8],
        particles: ["#f97316", "#eab308", "#ef4444", "#f43f5e", "#fde047", "#ffffff"],
      },
    ];

    const NUM_BANDS = 7;
    const phases = Array.from({ length: NUM_BANDS }).map((_, i) => (i / NUM_BANDS) * Math.PI * 2);
    const speeds = Array.from({ length: NUM_BANDS }).map(() => 0.18 + Math.random() * 0.12);

    // Shortest angular distance interpolation for smooth 360-degree color wheel transitions
    const lerpHue = (a: number, b: number, t: number): number => {
      const diff = ((b - a + 540) % 360) - 180;
      return (a + diff * t + 360) % 360;
    };

    // Ken Perlin's C2-continuous Smootherstep (zero 1st and 2nd derivatives at endpoints)
    const smootherstep = (t: number): number => {
      const clamped = Math.max(0, Math.min(1, t));
      return clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10);
    };

    // ── Time Interval Configuration ─────────────────────────────────
    const DWELL_TIME = 2.4;       // Dwell briefly on each color theme (2.4s)
    const MORPH_TIME = 2.4;       // Seamlessly morph to next theme (2.4s)
    const CYCLE_PERIOD = DWELL_TIME + MORPH_TIME; // Fast 4.8s dynamic cycle
    const startTime = performance.now();
    let lastTime = performance.now();

    // ── Continuous State Damping (Viscous Fluid Lerp) ───────────────
    const renderedHues = [...PALETTES[0].bands];
    let renderedAccentR = PALETTES[0].accentRgb[0];
    let renderedAccentG = PALETTES[0].accentRgb[1];
    let renderedAccentB = PALETTES[0].accentRgb[2];

    let renderedBeamR = PALETTES[0].beamRgb[0];
    let renderedBeamG = PALETTES[0].beamRgb[1];
    let renderedBeamB = PALETTES[0].beamRgb[2];

    let renderedPrimaryHue = PALETTES[0].bands[1];
    let renderedOrbMinHue = PALETTES[0].orbHueRange[0];
    let renderedOrbMaxHue = PALETTES[0].orbHueRange[1];

    // ── Dot-matrix overlay config ───────────────────────────────────
    const DOT_SPACING = 30;   // pixels between dot centers
    const DOT_RADIUS = 1.8;   // base dot radius (px)
    const DOT_ALPHA = 0.22;   // base opacity of dots

    // ── Floating Orbs Config ────────────────────────────────────────
    const NUM_ORBS = 5;
    const orbs = Array.from({ length: NUM_ORBS }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: 220 + Math.random() * 260,
      hue: 270 + Math.random() * 60,
    }));

    // ── Foreground Motion Graphics: Particles & Trail ───────────────
    let particles: Particle[] = [];
    const MAX_PARTICLES = 65;

    const trailPoints: TrailPoint[] = [];
    const MAX_TRAIL_POINTS = 16;

    let currentParticleColors = PALETTES[0].particles;

    const PARTICLE_TYPES: Array<"diamond" | "cross" | "spark" | "ring"> = [
      "diamond",
      "cross",
      "spark",
      "ring",
    ];

    const spawnParticles = (x: number, y: number, count: number, speed: number) => {
      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) {
          particles.shift();
        }

        const angle = Math.random() * Math.PI * 2;
        const dispSpeed = 0.8 + Math.random() * (1.5 + Math.min(speed * 0.2, 3));
        const color = currentParticleColors[Math.floor(Math.random() * currentParticleColors.length)];
        const type = PARTICLE_TYPES[Math.floor(Math.random() * PARTICLE_TYPES.length)];

        particles.push({
          x: x + (Math.random() - 0.5) * 14,
          y: y + (Math.random() - 0.5) * 14,
          vx: Math.cos(angle) * dispSpeed + mouse.vx * 0.15,
          vy: Math.sin(angle) * dispSpeed + mouse.vy * 0.15 - 0.4, // subtle upward antigravity
          size: type === "ring" ? 4 + Math.random() * 8 : 3 + Math.random() * 5,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.18,
          life: 1.0,
          decay: 0.016 + Math.random() * 0.024,
          color,
          type,
        });
      }
    };

    let time = 0;

    // ── Main Animation Render Loop ──────────────────────────────────
    const render = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      time += 0.007;

      // ── Calculate Time-Interval Color Transitions ─────────────────
      const elapsedSeconds = (now - startTime) / 1000;
      const cycleProgress = elapsedSeconds % CYCLE_PERIOD;
      const fromIdx = Math.floor(elapsedSeconds / CYCLE_PERIOD) % PALETTES.length;
      const toIdx = (fromIdx + 1) % PALETTES.length;

      let morphProgress = 0;
      if (cycleProgress > DWELL_TIME) {
        const rawT = (cycleProgress - DWELL_TIME) / MORPH_TIME;
        morphProgress = smootherstep(rawT);
      }

      const pFrom = PALETTES[fromIdx];
      const pTo = PALETTES[toIdx];

      // Blend particle colors proportionally
      currentParticleColors = morphProgress < 0.5 ? pFrom.particles : pTo.particles;

      // Viscous fluid exponential damping (smooth, responsive tracking)
      const fluidDamp = 1 - Math.exp(-5.5 * dt);

      for (let b = 0; b < NUM_BANDS; b++) {
        const targetH = lerpHue(pFrom.bands[b], pTo.bands[b], morphProgress);
        renderedHues[b] = lerpHue(renderedHues[b], targetH, fluidDamp);
      }

      // Smooth accents
      const targetAccR = pFrom.accentRgb[0] + (pTo.accentRgb[0] - pFrom.accentRgb[0]) * morphProgress;
      const targetAccG = pFrom.accentRgb[1] + (pTo.accentRgb[1] - pFrom.accentRgb[1]) * morphProgress;
      const targetAccB = pFrom.accentRgb[2] + (pTo.accentRgb[2] - pFrom.accentRgb[2]) * morphProgress;
      renderedAccentR += (targetAccR - renderedAccentR) * fluidDamp;
      renderedAccentG += (targetAccG - renderedAccentG) * fluidDamp;
      renderedAccentB += (targetAccB - renderedAccentB) * fluidDamp;

      const targetBmR = pFrom.beamRgb[0] + (pTo.beamRgb[0] - pFrom.beamRgb[0]) * morphProgress;
      const targetBmG = pFrom.beamRgb[1] + (pTo.beamRgb[1] - pFrom.beamRgb[1]) * morphProgress;
      const targetBmB = pFrom.beamRgb[2] + (pTo.beamRgb[2] - pFrom.beamRgb[2]) * morphProgress;
      renderedBeamR += (targetBmR - renderedBeamR) * fluidDamp;
      renderedBeamG += (targetBmG - renderedBeamG) * fluidDamp;
      renderedBeamB += (targetBmB - renderedBeamB) * fluidDamp;

      const targetPrimary = renderedHues[1] ?? 280;
      renderedPrimaryHue = lerpHue(renderedPrimaryHue, targetPrimary, fluidDamp);

      const targetOrbMin = lerpHue(pFrom.orbHueRange[0], pTo.orbHueRange[0], morphProgress);
      const targetOrbMax = lerpHue(pFrom.orbHueRange[1], pTo.orbHueRange[1], morphProgress);
      renderedOrbMinHue = lerpHue(renderedOrbMinHue, targetOrbMin, fluidDamp);
      renderedOrbMaxHue = lerpHue(renderedOrbMaxHue, targetOrbMax, fluidDamp);

      const currentAccentRgb = `${Math.round(renderedAccentR)}, ${Math.round(renderedAccentG)}, ${Math.round(renderedAccentB)}`;
      const currentBeamRgb = `${Math.round(renderedBeamR)}, ${Math.round(renderedBeamG)}, ${Math.round(renderedBeamB)}`;

      // 1. Smooth mouse tracking with lerp
      if (mouse.isActive) {
        const prevSmoothX = mouse.x;
        const prevSmoothY = mouse.y;

        mouse.x += (mouse.targetX - mouse.x) * 0.16;
        mouse.y += (mouse.targetY - mouse.y) * 0.16;

        mouse.vx = mouse.x - prevSmoothX;
        mouse.vy = mouse.y - prevSmoothY;
        mouse.speed = Math.hypot(mouse.vx, mouse.vy);

        mouse.idleTimer++;
        if (mouse.idleTimer > 180) {
          // If stationary for >3s, slowly fade out focus
          mouse.speed *= 0.92;
        }

        // Add to smooth trail
        trailPoints.unshift({ x: mouse.x, y: mouse.y, alpha: 1.0 });
        if (trailPoints.length > MAX_TRAIL_POINTS) {
          trailPoints.pop();
        }

        // Spawn particles when cursor moves
        if (mouse.speed > 1.2) {
          const spawnCount = Math.min(Math.floor(mouse.speed / 4) + 1, 3);
          spawnParticles(mouse.x, mouse.y, spawnCount, mouse.speed);
        }
      } else {
        mouse.speed *= 0.9;
        if (trailPoints.length > 0) {
          trailPoints.pop();
        }
      }

      // Age existing trail points
      for (let i = 0; i < trailPoints.length; i++) {
        trailPoints[i].alpha -= 0.06;
      }

      // ─────────────────────────────────────────────────────────────
      // LAYER 1: Background Canvas (Atmospheric Glow, Bands, Dots, Orbs)
      // ─────────────────────────────────────────────────────────────
      bgCtx.clearRect(0, 0, width, height);

      // 1a. Ambient deep radial backlight bathing the whole screen in current theme
      const baseGrad = bgCtx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      );
      baseGrad.addColorStop(0, `hsla(${renderedPrimaryHue.toFixed(1)}, 72%, 14%, 0.38)`);
      baseGrad.addColorStop(0.5, `hsla(${renderedPrimaryHue.toFixed(1)}, 62%, 8%, 0.20)`);
      baseGrad.addColorStop(1, "rgba(4, 4, 10, 0)");
      bgCtx.fillStyle = baseGrad;
      bgCtx.fillRect(0, 0, width, height);

      const bandW = width / NUM_BANDS;

      // 1b. Draw flowing ambient rainbow curtain with coherent harmonic wave
      for (let b = 0; b < NUM_BANDS; b++) {
        const x = b * bandW;
        const waveProgress = b / NUM_BANDS;
        // Harmonic cohesive wave progression across bands
        const wave = Math.sin(time * 0.8 + waveProgress * Math.PI * 1.5) * 2.8;
        const hue = (renderedHues[b] + wave + 360) % 360;
        const flow = Math.sin(time * 0.6 + waveProgress * Math.PI * 2);

        const sat = 75 + flow * 4;
        const light = 31 + flow * 3;
        const alpha = 0.50 + flow * 0.07;

        const grad = bgCtx.createLinearGradient(x, 0, x, height);
        grad.addColorStop(0, `hsla(${hue.toFixed(1)}, ${sat}%, ${light + 16}%, ${alpha * 0.52})`);
        grad.addColorStop(0.3, `hsla(${hue.toFixed(1)}, ${sat}%, ${light + 7}%,  ${alpha * 0.78})`);
        grad.addColorStop(0.6, `hsla(${hue.toFixed(1)}, ${sat}%, ${light}%,      ${alpha})`);
        grad.addColorStop(1, `hsla(${hue.toFixed(1)}, ${sat}%, ${light - 9}%, ${alpha * 0.48})`);

        bgCtx.fillStyle = grad;
        bgCtx.fillRect(x - bandW * 0.55, 0, bandW * 2.1, height);
      }

      // 1c. Subtle vertical scan lines
      for (let b = 0; b < NUM_BANDS; b++) {
        const cx = b * bandW + bandW / 2;
        const flow = Math.sin(time * 0.9 + (b / NUM_BANDS) * Math.PI * 2 + 0.5);
        const scanAlpha = 0.07 + flow * 0.04;

        const scanGrad = bgCtx.createLinearGradient(cx - 4, 0, cx + 4, 0);
        scanGrad.addColorStop(0, "rgba(255,255,255,0)");
        scanGrad.addColorStop(0.5, `rgba(255,255,255,${scanAlpha})`);
        scanGrad.addColorStop(1, "rgba(255,255,255,0)");

        bgCtx.fillStyle = scanGrad;
        bgCtx.fillRect(cx - 8, 0, 16, height);
      }

      // 1d. Floating Graphical Orbs with Cursor Repulsion & Dynamic Palette Hue
      bgCtx.globalCompositeOperation = "screen";
      for (let i = 0; i < NUM_ORBS; i++) {
        const orb = orbs[i];

        // Cursor interactive repulsion
        if (mouse.isActive) {
          const odx = orb.x - mouse.x;
          const ody = orb.y - mouse.y;
          const oDist = Math.hypot(odx, ody);
          const repulseRadius = orb.radius + 120;

          if (oDist < repulseRadius && oDist > 1) {
            const force = (1 - oDist / repulseRadius) * 0.8;
            orb.vx += (odx / oDist) * force;
            orb.vy += (ody / oDist) * force;
          }
        }

        // Apply friction to orb velocity
        orb.vx *= 0.985;
        orb.vy *= 0.985;

        orb.x += orb.vx;
        orb.y += orb.vy;

        // Gentle bounce off screen edges
        if (orb.x < -orb.radius) orb.vx = Math.abs(orb.vx) + 0.2;
        if (orb.x > width + orb.radius) orb.vx = -Math.abs(orb.vx) - 0.2;
        if (orb.y < -orb.radius) orb.vy = Math.abs(orb.vy) + 0.2;
        if (orb.y > height + orb.radius) orb.vy = -Math.abs(orb.vy) - 0.2;

        // Steering orb hue smoothly with faster transition tracking
        const targetOrbHue = lerpHue(renderedOrbMinHue, renderedOrbMaxHue, i / NUM_ORBS);
        orb.hue = lerpHue(orb.hue, targetOrbHue, fluidDamp * 0.7);

        const orbGrad = bgCtx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        orbGrad.addColorStop(0, `hsla(${orb.hue}, 92%, 62%, 0.16)`);
        orbGrad.addColorStop(0.5, `hsla(${orb.hue}, 90%, 55%, 0.08)`);
        orbGrad.addColorStop(1, `hsla(${orb.hue}, 90%, 50%, 0)`);

        bgCtx.fillStyle = orbGrad;
        bgCtx.beginPath();
        bgCtx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        bgCtx.fill();
      }
      bgCtx.globalCompositeOperation = "source-over";

      // 1e. Interactive Dot-Matrix Overlay + Magnetic Cursor Lens & Constellation
      const cols = Math.ceil(width / DOT_SPACING) + 1;
      const rows = Math.ceil(height / DOT_SPACING) + 1;

      // Collect near-cursor dots for constellation lines
      const activeDots: Array<{ x: number; y: number; dist: number; intensity: number }> = [];
      const CURSOR_INTERACT_RADIUS = 190;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = c * DOT_SPACING;
          const py = r * DOT_SPACING;

          let drawX = px;
          let drawY = py;
          let extraRadius = 0;
          let extraAlpha = 0;
          let cursorInfluence = 0;

          if (mouse.isActive) {
            const dx = px - mouse.x;
            const dy = py - mouse.y;
            const dist = Math.hypot(dx, dy);

            if (dist < CURSOR_INTERACT_RADIUS) {
              cursorInfluence = 1 - dist / CURSOR_INTERACT_RADIUS;
              // Elastic magnetic push away from cursor
              const push = Math.sin(cursorInfluence * Math.PI) * 22;
              const angle = Math.atan2(dy, dx);
              drawX = px + Math.cos(angle) * push;
              drawY = py + Math.sin(angle) * push;

              extraRadius = cursorInfluence * 2.4;
              extraAlpha = cursorInfluence * 0.75;

              activeDots.push({
                x: drawX,
                y: drawY,
                dist,
                intensity: cursorInfluence,
              });
            }
          }

          const bIdx = Math.min(Math.floor((px / width) * NUM_BANDS), NUM_BANDS - 1);
          const hue = renderedHues[bIdx];

          const pulse = Math.sin(time * 1.6 + r * 0.35 + c * 0.45) * 0.5 + 0.5;
          const a = Math.min(1, DOT_ALPHA * (0.5 + pulse * 0.5) + extraAlpha);

          // Hue shift towards active theme accent when cursor is near
          const targetHue = cursorInfluence > 0 
            ? (cursorInfluence > 0.5 ? lerpHue(hue, (renderedPrimaryHue + 40) % 360, 0.7) : hue) 
            : hue;
          const sat = 62 + pulse * 24 + cursorInfluence * 34;
          const lig = 60 + pulse * 20 + cursorInfluence * 25;

          bgCtx.beginPath();
          bgCtx.arc(drawX, drawY, DOT_RADIUS + extraRadius, 0, Math.PI * 2);
          bgCtx.fillStyle = `hsla(${targetHue}, ${sat}%, ${lig}%, ${a.toFixed(3)})`;
          bgCtx.fill();
        }
      }

      // 1f. Holographic Constellation Lines between activated dots near cursor
      if (activeDots.length > 1) {
        bgCtx.lineWidth = 1.1;
        const maxLinkDist = DOT_SPACING * 1.65;

        for (let i = 0; i < activeDots.length; i++) {
          const d1 = activeDots[i];

          // Connect very close activated dots together
          for (let j = i + 1; j < activeDots.length; j++) {
            const d2 = activeDots[j];
            const distBetween = Math.hypot(d1.x - d2.x, d1.y - d2.y);

            if (distBetween < maxLinkDist) {
              const lineAlpha = (1 - distBetween / maxLinkDist) * d1.intensity * d2.intensity * 0.55;
              bgCtx.strokeStyle = `rgba(${currentAccentRgb}, ${lineAlpha.toFixed(3)})`;
              bgCtx.beginPath();
              bgCtx.moveTo(d1.x, d1.y);
              bgCtx.lineTo(d2.x, d2.y);
              bgCtx.stroke();
            }
          }

          // Subtle beam linking the closest dots to the cursor center
          if (d1.dist < 85) {
            const beamAlpha = (1 - d1.dist / 85) * 0.38;
            bgCtx.strokeStyle = `rgba(${currentBeamRgb}, ${beamAlpha.toFixed(3)})`;
            bgCtx.beginPath();
            bgCtx.moveTo(d1.x, d1.y);
            bgCtx.lineTo(mouse.x, mouse.y);
            bgCtx.stroke();
          }
        }
      }

      // 1g. Top vignette & bottom deep shadow
      const topVig = bgCtx.createLinearGradient(0, 0, 0, height * 0.55);
      topVig.addColorStop(0, "rgba(0,0,0,0.55)");
      topVig.addColorStop(0.45, "rgba(0,0,0,0)");
      bgCtx.fillStyle = topVig;
      bgCtx.fillRect(0, 0, width, height);

      const btmVig = bgCtx.createLinearGradient(0, height * 0.6, 0, height);
      btmVig.addColorStop(0, "rgba(0,0,0,0)");
      btmVig.addColorStop(1, "rgba(0,0,0,0.72)");
      bgCtx.fillStyle = btmVig;
      bgCtx.fillRect(0, 0, width, height);

      // ─────────────────────────────────────────────────────────────
      // LAYER 2: Foreground Cursor Motion Graphics Canvas
      // (Fluid Aura Glow, Streamer Ribbon Trail, Floating Tech Particles)
      // ─────────────────────────────────────────────────────────────
      fgCtx.clearRect(0, 0, width, height);

      if (mouse.isActive) {
        // 2a. Dynamic Fluid Cursor Aura / Spotlight
        const auraRadius = 140 + Math.min(mouse.speed * 4, 80);
        const auraGrad = fgCtx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          auraRadius
        );
        const auraAlpha = Math.min(0.18, 0.08 + (mouse.speed / 40) * 0.1);

        auraGrad.addColorStop(0, `rgba(${currentAccentRgb}, ${auraAlpha * 1.5})`);
        auraGrad.addColorStop(0.35, `rgba(${currentBeamRgb}, ${auraAlpha})`);
        auraGrad.addColorStop(0.7, `rgba(${currentAccentRgb}, ${auraAlpha * 0.4})`);
        auraGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        fgCtx.fillStyle = auraGrad;
        fgCtx.beginPath();
        fgCtx.arc(mouse.x, mouse.y, auraRadius, 0, Math.PI * 2);
        fgCtx.fill();

        // 2b. Smooth Kinetic Ribbon Streamer
        if (trailPoints.length > 2) {
          fgCtx.save();
          fgCtx.lineCap = "round";
          fgCtx.lineJoin = "round";

          for (let i = 0; i < trailPoints.length - 1; i++) {
            const p1 = trailPoints[i];
            const p2 = trailPoints[i + 1];
            if (p1.alpha <= 0) continue;

            const progress = 1 - i / trailPoints.length;
            const lineWidth = Math.max(1, progress * 4.5);
            const lineAlpha = p1.alpha * progress * 0.45;

            fgCtx.lineWidth = lineWidth;
            fgCtx.strokeStyle = `rgba(${currentAccentRgb}, ${lineAlpha.toFixed(3)})`;

            fgCtx.beginPath();
            fgCtx.moveTo(p1.x, p1.y);
            fgCtx.lineTo(p2.x, p2.y);
            fgCtx.stroke();
          }
          fgCtx.restore();
        }

        // 2c. Sleek Follower Graphic Reticle / Micro-Crosshair
        const reticleRadius = 13 + Math.min(mouse.speed * 0.6, 10);
        fgCtx.save();
        fgCtx.strokeStyle = `rgba(${currentAccentRgb}, 0.5)`;
        fgCtx.lineWidth = 1.2;

        // Rotating micro-ring
        fgCtx.beginPath();
        fgCtx.arc(mouse.x, mouse.y, reticleRadius, 0, Math.PI * 2);
        fgCtx.stroke();

        // 4 subtle cardinal ticks
        const tickLen = 3.5;
        fgCtx.beginPath();
        fgCtx.moveTo(mouse.x - reticleRadius - tickLen, mouse.y);
        fgCtx.lineTo(mouse.x - reticleRadius + 1, mouse.y);
        fgCtx.moveTo(mouse.x + reticleRadius - 1, mouse.y);
        fgCtx.lineTo(mouse.x + reticleRadius + tickLen, mouse.y);
        fgCtx.moveTo(mouse.x, mouse.y - reticleRadius - tickLen);
        fgCtx.lineTo(mouse.x, mouse.y - reticleRadius + 1);
        fgCtx.moveTo(mouse.x, mouse.y + reticleRadius - 1);
        fgCtx.lineTo(mouse.x, mouse.y + reticleRadius + tickLen);
        fgCtx.stroke();
        fgCtx.restore();
      }

      // 2d. Render & Update Floating Motion Graphic Particles
      particles = particles.filter((p) => p.life > 0);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Physics updates
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.rotation += p.rotSpeed;
        p.life -= p.decay;

        const currentAlpha = Math.max(0, p.life * p.life);
        const currentSize = p.size * (0.4 + p.life * 0.6);

        fgCtx.save();
        fgCtx.translate(p.x, p.y);
        fgCtx.rotate(p.rotation);
        fgCtx.globalAlpha = currentAlpha;

        if (p.type === "diamond") {
          // Geometric diamond shard
          fgCtx.fillStyle = p.color;
          fgCtx.strokeStyle = "#ffffff";
          fgCtx.lineWidth = 0.8;
          fgCtx.beginPath();
          fgCtx.moveTo(0, -currentSize);
          fgCtx.lineTo(currentSize * 0.75, 0);
          fgCtx.lineTo(0, currentSize);
          fgCtx.lineTo(-currentSize * 0.75, 0);
          fgCtx.closePath();
          fgCtx.fill();
          fgCtx.stroke();
        } else if (p.type === "cross") {
          // Sleek vector crosshair / plus mark
          fgCtx.strokeStyle = p.color;
          fgCtx.lineWidth = 1.4;
          const arm = currentSize * 0.9;
          fgCtx.beginPath();
          fgCtx.moveTo(-arm, 0);
          fgCtx.lineTo(arm, 0);
          fgCtx.moveTo(0, -arm);
          fgCtx.lineTo(0, arm);
          fgCtx.stroke();
        } else if (p.type === "spark") {
          // Crisp 4-pointed radiant stardust glint
          fgCtx.fillStyle = p.color;
          fgCtx.beginPath();
          const r1 = currentSize;
          const r2 = currentSize * 0.28;
          for (let sp = 0; sp < 8; sp++) {
            const rad = (sp * Math.PI) / 4;
            const dist = sp % 2 === 0 ? r1 : r2;
            const sx = Math.cos(rad) * dist;
            const sy = Math.sin(rad) * dist;
            if (sp === 0) fgCtx.moveTo(sx, sy);
            else fgCtx.lineTo(sx, sy);
          }
          fgCtx.closePath();
          fgCtx.fill();
        } else if (p.type === "ring") {
          // Delicate expanding holographic shockwave ring
          const ringRad = currentSize * (1 + (1 - p.life) * 1.8);
          fgCtx.strokeStyle = p.color;
          fgCtx.lineWidth = Math.max(0.6, p.life * 1.6);
          fgCtx.beginPath();
          fgCtx.arc(0, 0, ringRad, 0, Math.PI * 2);
          fgCtx.stroke();
        }

        fgCtx.restore();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
      cancelAnimationFrame(animFrameId.current);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <>
      {/* Background Canvas: Rainbow spectrum curtain, magnetic dot-matrix & orbs */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      >
        <canvas ref={bgCanvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Foreground Canvas: Motion graphics particles, glowing cursor aura & holographic reticle */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-40 overflow-hidden select-none"
      >
        <canvas ref={fgCanvasRef} className="absolute inset-0 w-full h-full" />
      </div>
    </>
  );
}

