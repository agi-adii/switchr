import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Tools - Multi-Image to PDF, Extract, Protect & Unlock",
  description:
    "Free in-browser PDF tools. Convert photos to PDF, extract high-res images, password-protect & encrypt PDFs, and unlock protected documents with 100% privacy and zero server uploads.",
  keywords: [
    "pdf tools",
    "image to pdf",
    "pdf to image",
    "protect pdf",
    "encrypt pdf",
    "unlock pdf",
    "text to pdf",
    "free pdf editor",
    "switchr pdf",
  ],
  alternates: {
    canonical: "https://switchrx.vercel.app/pdf-tools",
  },
  openGraph: {
    title: "Free In-Browser PDF Tools Suite | Switchr",
    description: "Convert photos to PDF, extract images, protect & unlock PDF files directly in your browser. 100% free and private.",
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
