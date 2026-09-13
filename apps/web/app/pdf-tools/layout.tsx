import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Tools - Merge, Split, Compress & Convert PDF Online",
  description:
    "Free in-browser PDF tools. Merge PDFs, split pages, compress files, and convert PDF to images with 100% privacy and zero file size limits.",
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
    canonical: "/pdf-tools",
  },
  openGraph: {
    title: "Free In-Browser PDF Tools Suite | Switchr",
    description: "Merge, compress, split, and convert PDF files directly in your browser. 100% free and private.",
    url: "/pdf-tools",
  },
};

export default function PdfToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
