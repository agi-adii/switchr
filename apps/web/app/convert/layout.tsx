import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchrx.vercel.app";

export const metadata: Metadata = {
  title: "Online File Converter - Convert Images, Videos, Audio & Docs Free",
  description:
    "Batch convert files online directly in your browser. Fast, 100% free format transformation with complete privacy and zero server uploads.",
  keywords: [
    "online file converter",
    "batch convert files",
    "free file conversion",
    "format converter online",
    "client-side file converter",
    "private file converter",
    "convert files free",
    "switchr convert",
  ],
  alternates: {
    canonical: `${siteUrl}/convert`,
  },
  openGraph: {
    title: "Online File Converter - Fast, Free & Private | Switchr",
    description:
      "Batch convert files online directly in your browser. Fast, 100% free format transformation with complete privacy and zero server uploads.",
    url: `${siteUrl}/convert`,
    siteName: "Switchr",
    type: "website",
    images: [
      {
        url: "/api/og?title=Universal%20File%20Converter&subtitle=Batch%20Convert%20Images%2C%20Videos%2C%20Audio%2C%20PDFs%20%26%20Docs%20Locally",
        width: 1200,
        height: 630,
        alt: "Switchr Universal File Converter - Online Free File Conversion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Online File Converter - Fast, Free & Private | Switchr",
    description: "Batch convert files online directly in your browser with complete privacy.",
    images: ["/api/og?title=Universal%20File%20Converter&subtitle=Batch%20Convert%20Images%2C%20Videos%2C%20Audio%2C%20PDFs%20%26%20Docs%20Locally"],
  },
};

export default function ConvertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
