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
    canonical: "https://switchrx.vercel.app/tools/enhance",
  },
  openGraph: {
    title: "AI Photo Enhancer & Neural Upscaler | Switchr",
    description: "Upscale images and enhance quality right in your browser with Real-ESRGAN and zero uploads.",
    url: "https://switchrx.vercel.app/tools/enhance",
    images: [
      {
        url: "/api/og?title=AI%20Photo%20Enhancer&badge=Real-ESRGAN%20%2B%20WebGPU",
        width: 1200,
        height: 630,
        alt: "Switchr AI Photo Enhancer",
      },
    ],
  },
};

export default function EnhanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
