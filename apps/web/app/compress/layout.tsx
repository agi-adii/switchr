import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free File Compressor - Reduce Size of Images & PDFs",
  description:
    "Compress images and PDF documents directly in your browser. Shrink file sizes with client-side quality calibration and complete privacy.",
  keywords: [
    "file compressor",
    "compress image",
    "reduce file size",
    "shrink pdf free",
    "compress png",
    "compress jpeg",
    "compress webp",
  ],
  alternates: {
    canonical: "https://switchrx.vercel.app/compress",
  },
  openGraph: {
    title: "Free Client-Side File Compressor | Switchr",
    description: "Shrink image and PDF file sizes directly in your browser with optimized compression algorithms.",
    url: "https://switchrx.vercel.app/compress",
    images: [
      {
        url: "/api/og?title=Smart%20File%20Compressor&badge=Images%20%2B%20Video%20%2B%20PDF",
        width: 1200,
        height: 630,
        alt: "Switchr Smart File Compressor",
      },
    ],
  },
};

export default function CompressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
