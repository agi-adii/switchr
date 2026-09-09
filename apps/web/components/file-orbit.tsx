"use client";

import { useState, type CSSProperties, type PointerEvent } from "react";
import { FileImage, FileText, Music2, Sparkles, Video } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

type TiltStyle = CSSProperties & {
  "--scene-tilt-x": string;
  "--scene-tilt-y": string;
};

export function FileOrbit() {
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    setTilt({ x: x * 10, y: y * -8 });
  };

  const sceneStyle: TiltStyle = {
    "--scene-tilt-x": `${tilt.y}deg`,
    "--scene-tilt-y": `${tilt.x}deg`,
  };

  return (
    <div
      aria-hidden="true"
      className="file-orbit-scene"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <motion.div
        className="file-orbit-tilt"
        style={sceneStyle}
        animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="file-orbit-grid" />
        <div className="file-orbit-aura" />
        <div className="file-orbit-ring file-orbit-ring-one" />
        <div className="file-orbit-ring file-orbit-ring-two" />

        <div className="file-orbit-document file-orbit-document-back">
          <div className="file-orbit-document-topline"><FileImage /><span>IMAGE</span></div>
          <div className="file-orbit-image-preview" />
          <div className="file-orbit-document-lines"><span /><span /></div>
        </div>

        <div className="file-orbit-document file-orbit-document-left">
          <div className="file-orbit-document-topline"><Music2 /><span>AUDIO</span></div>
          <div className="file-orbit-wave">
            {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
          </div>
          <div className="file-orbit-document-lines"><span /><span /></div>
        </div>

        <div className="file-orbit-document file-orbit-document-right">
          <div className="file-orbit-document-topline"><Video /><span>VIDEO</span></div>
          <div className="file-orbit-video-preview"><span /></div>
          <div className="file-orbit-document-lines"><span /><span /></div>
        </div>

        <div className="file-orbit-core">
          <div className="file-orbit-core-glow" />
          <div className="file-orbit-core-header"><span className="file-orbit-brand-mark">S</span><span>switchr</span><Sparkles /></div>
          <div className="file-orbit-core-copy"><span className="file-orbit-eyebrow">FILE FLOW</span><strong>Ready to convert</strong><small>Any format, instantly.</small></div>
          <div className="file-orbit-core-progress"><span /></div>
          <div className="file-orbit-core-footer"><FileText /><span>Unlimited possibilities</span></div>
        </div>

        <span className="file-orbit-particle file-orbit-particle-one" />
        <span className="file-orbit-particle file-orbit-particle-two" />
        <span className="file-orbit-particle file-orbit-particle-three" />
      </motion.div>
    </div>
  );
}
