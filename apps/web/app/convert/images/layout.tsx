import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Image Converter - WebP, PNG, JPG, AVIF, HEIC, SVG",
  description:
    "Convert images online in seconds. Convert WebP to PNG, HEIC to JPG, PNG to SVG, and more locally without uploading images to any server.",
  keywords: [
    "image converter",
    "webp to png",
    "heic to jpg",
    "png to jpg",
    "jpg to webp",
    "avif converter",
    "svg converter",
    "convert images free",
  ],
  alternates: {
    canonical: "https://switchrx.vercel.app/convert/images",
  },
  openGraph: {
    title: "Free Online Image Converter | Switchr",
    description: "Convert WebP, PNG, JPG, AVIF, HEIC, and SVG locally with zero server uploads.",
    url: "https://switchrx.vercel.app/convert/images",
    images: [
      {
        url: "/api/og?title=Image%20Converter&badge=Privacy-First%20WASM",
        width: 1200,
        height: 630,
        alt: "Switchr Image Converter",
      },
    ],
  },
};

export default function ConvertImagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
