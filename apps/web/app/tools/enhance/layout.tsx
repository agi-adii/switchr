import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchrx.vercel.app";

export const metadata: Metadata = {
  title: "AI Photo Enhancer & 4K Upscaler Online Free (Real-ESRGAN)",
  description:
    "Enhance photo quality, unblur images, reduce noise, and upscale resolution to 4K online. 100% private in-browser AI with Real-ESRGAN & WebGPU, zero uploads.",
  keywords: [
    "ai photo enhancer",
    "ai image upscaler free",
    "upscale image 4k online",
    "unblur image free",
    "enhance photo quality online",
    "real esrgan online",
    "super resolution ai",
    "sharpen image online",
    "photo quality enhancer free",
    "restore old photos ai",
    "denoise photo online",
    "switchr ai enhancer",
  ],
  alternates: {
    canonical: `${siteUrl}/tools/enhance`,
  },
  openGraph: {
    title: "AI Photo Enhancer & 4K Upscaler Online Free | Switchr",
    description:
      "Upscale images to 4K, sharpen blurry photos, and calibrate tone locally with Real-ESRGAN neural networks and zero cloud uploads.",
    url: `${siteUrl}/tools/enhance`,
    siteName: "Switchr",
    type: "website",
    images: [
      {
        url: "/api/og?title=AI%20Photo%20Enhancer%20%26%204K%20Upscaler&subtitle=Real-ESRGAN%20Neural%20Super-Resolution%20Directly%20in%20Your%20Browser",
        width: 1200,
        height: 630,
        alt: "Switchr AI Photo Enhancer - Free In-Browser AI Upscaling",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Photo Enhancer & 4K Upscaler Online Free | Switchr",
    description: "Upscale resolution, unblur photos, and enhance details in-browser with Real-ESRGAN AI and zero uploads.",
    images: ["/api/og?title=AI%20Photo%20Enhancer%20%26%204K%20Upscaler&subtitle=Real-ESRGAN%20Neural%20Super-Resolution%20Directly%20in%20Your%20Browser"],
  },
};

export default function EnhanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
