import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online File Converter - Convert Images, Videos, Audio & Docs Free",
  description:
    "Batch convert files online directly in your browser. Fast, 100% free format transformation with complete privacy and zero file size limits.",
  keywords: [
    "online file converter",
    "batch convert files",
    "free file conversion",
    "format converter",
    "convert files free",
    "switchr convert",
  ],
  alternates: {
    canonical: "/convert",
  },
  openGraph: {
    title: "Online File Converter - Free & Unlimited | Switchr",
    description:
      "Batch convert files online directly in your browser. Fast, 100% free format transformation with complete privacy.",
    url: "/convert",
  },
};

export default function ConvertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
