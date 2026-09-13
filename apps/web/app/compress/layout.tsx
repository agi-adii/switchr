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
    canonical: "/compress",
  },
  openGraph: {
    title: "Free Client-Side File Compressor | Switchr",
    description: "Shrink image, video, and PDF file sizes directly in your browser with zero quality loss.",
    url: "/compress",
  },
};

export default function CompressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
