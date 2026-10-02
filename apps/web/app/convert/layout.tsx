import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online File Converter - Convert Images, Videos, Audio & Docs Free",
  description:
    "Batch convert files online directly in your browser. Fast, 100% free format transformation with complete privacy and zero server uploads.",
  keywords: [
    "online file converter",
    "batch convert files",
    "free file conversion",
    "format converter",
    "convert files free",
    "switchr convert",
  ],
  alternates: {
    canonical: "https://switchrx.vercel.app/convert",
  },
  openGraph: {
    title: "Online File Converter - Fast & Private | Switchr",
    description:
      "Batch convert files online directly in your browser. Fast, 100% free format transformation with complete privacy.",
    url: "https://switchrx.vercel.app/convert",
    images: [
      {
        url: "/api/og?title=Universal%20File%20Converter&badge=200%2B%20Formats%20Supported",
        width: 1200,
        height: 630,
        alt: "Switchr Universal File Converter",
      },
    ],
  },
};

export default function ConvertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
