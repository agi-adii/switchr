import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Tools - Merge, Split, Compress & Convert PDF Online",
  description:
    "Free in-browser PDF tools. Merge PDFs, split pages, compress files, and convert PDF to images with 100% privacy and zero server uploads.",
  keywords: [
    "pdf tools",
    "merge pdf",
    "split pdf",
    "compress pdf",
    "pdf to image",
    "image to pdf",
    "free pdf editor",
    "switchr pdf",
    "combine pdfs free",
  ],
  alternates: {
    canonical: "https://switchrx.vercel.app/pdf-tools",
  },
  openGraph: {
    title: "Free In-Browser PDF Tools Suite | Switchr",
    description: "Merge, compress, split, and convert PDF files directly in your browser. 100% free and private.",
    url: "https://switchrx.vercel.app/pdf-tools",
    images: [
      {
        url: "/api/og?title=PDF%20Management%20Suite&badge=Merge%20%2B%20Compress%20%2B%20Split",
        width: 1200,
        height: 630,
        alt: "Switchr PDF Suite",
      },
    ],
  },
};

export default function PdfToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
