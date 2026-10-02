import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free File Compressor - Reduce Size of Images, Videos & PDFs",
  description:
    "Compress images, videos, and PDFs right in your browser. Shrink file sizes dramatically without sacrificing visual quality or privacy.",
  keywords: [
    "file compressor",
    "compress image",
    "compress video",
    "reduce file size",
    "shrink pdf free",
    "compress mp4",
    "compress png",
    "compress jpeg",
  ],
  alternates: {
    canonical: "https://switchrx.vercel.app/compress",
  },
  openGraph: {
    title: "Free Client-Side File Compressor | Switchr",
    description: "Shrink image, video, and PDF file sizes directly in your browser with optimized compression algorithms.",
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
