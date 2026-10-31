import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchrx.vercel.app";

export const metadata: Metadata = {
  title: "Free File Compressor Online - Compress Images, PDF & Media",
  description:
    "Compress images and PDF documents directly in your browser. Shrink file sizes by up to 80% with smart quantization, zero uploads, and complete privacy.",
  keywords: [
    "file compressor online",
    "free file compressor",
    "compress image online",
    "compress pdf free",
    "reduce pdf file size",
    "shrink png free",
    "shrink jpg online",
    "reduce image size without losing quality",
    "webp compressor",
    "client-side file compression",
    "switchr compressor",
  ],
  alternates: {
    canonical: `${siteUrl}/compress`,
  },
  openGraph: {
    title: "Free File Compressor Online - Compress Images & PDF | Switchr",
    description:
      "Shrink image and PDF file sizes by up to 80% directly in your browser with smart adaptive quantization and complete privacy.",
    url: `${siteUrl}/compress`,
    siteName: "Switchr",
    type: "website",
    images: [
      {
        url: "/api/og?title=Smart%20File%20Compressor&subtitle=Reduce%20Image%20%26%20PDF%20File%20Size%20Locally%20with%20Zero%20Uploads",
        width: 1200,
        height: 630,
        alt: "Switchr Smart File Compressor - Free In-Browser Compression",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free File Compressor Online - Compress Images & PDF | Switchr",
    description: "Shrink image and PDF file sizes by up to 80% with complete privacy and zero server uploads.",
    images: ["/api/og?title=Smart%20File%20Compressor&subtitle=Reduce%20Image%20%26%20PDF%20File%20Size%20Locally%20with%20Zero%20Uploads"],
  },
};

export default function CompressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
