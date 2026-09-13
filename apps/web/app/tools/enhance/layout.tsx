import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Photo Enhancer & Upscaler - Enhance Image Quality Online",
  description:
    "Enhance photos, upscale resolution, reduce noise, and sharpen details in your browser with hardware-accelerated shaders and AI.",
  keywords: [
    "photo enhancer",
    "ai image upscaler",
    "upscale photo free",
    "image quality enhancer",
    "enhance resolution",
    "unblur image online",
    "sharpen photo free",
  ],
  alternates: {
    canonical: "/tools/enhance",
  },
  openGraph: {
    title: "AI Photo Enhancer & Upscaler | Switchr",
    description: "Upscale images and enhance quality right in your browser with zero uploads.",
    url: "/tools/enhance",
  },
};

export default function EnhanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
