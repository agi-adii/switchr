import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchrx.vercel.app";

export const metadata: Metadata = {
  title: "Free Image Converter Online - WebP, PNG, JPG, HEIC, AVIF",
  description:
    "Convert images online in seconds. Convert WebP to PNG, HEIC to JPG, PNG to SVG, and AVIF locally without uploading images to any server. 100% free.",
  keywords: [
    "image converter online",
    "free image converter",
    "webp to png",
    "heic to jpg",
    "png to jpg",
    "jpg to webp",
    "png to webp",
    "webp to jpg",
    "avif to png",
    "svg to png",
    "convert images free",
    "batch image converter",
    "switchr image converter",
  ],
  alternates: {
    canonical: `${siteUrl}/convert/images`,
  },
  openGraph: {
    title: "Free Image Converter Online - WebP, PNG, JPG, HEIC | Switchr",
    description: "Convert WebP, PNG, JPG, AVIF, HEIC, and SVG locally with zero server uploads and total privacy.",
    url: `${siteUrl}/convert/images`,
    siteName: "Switchr",
    type: "website",
    images: [
      {
        url: "/api/og?title=Free%20Image%20Converter&subtitle=Convert%20WebP%2C%20PNG%2C%20JPG%2C%20HEIC%2C%20AVIF%20%26%20SVG%20Locally",
        width: 1200,
        height: 630,
        alt: "Switchr Image Converter - Free Online Image Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image Converter Online - WebP, PNG, JPG, HEIC | Switchr",
    description: "Convert WebP, PNG, JPG, AVIF, HEIC, and SVG locally with zero server uploads.",
    images: ["/api/og?title=Free%20Image%20Converter&subtitle=Convert%20WebP%2C%20PNG%2C%20JPG%2C%20HEIC%2C%20AVIF%20%26%20SVG%20Locally"],
  },
};

export default function ConvertImagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
