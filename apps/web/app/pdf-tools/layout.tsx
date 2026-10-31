import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchrx.vercel.app";

export const metadata: Metadata = {
  title: "Free PDF Tools Online - Convert, Merge, Split, Protect & Edit PDF",
  description:
    "Free in-browser PDF suite. Convert photos to PDF, extract high-res PNG/JPG images, password protect, unlock, and compress PDFs with 100% privacy and zero uploads.",
  keywords: [
    "pdf tools",
    "free pdf tools",
    "merge pdf online",
    "split pdf online",
    "compress pdf free",
    "image to pdf",
    "pdf to image",
    "pdf to jpg",
    "pdf to png",
    "protect pdf online",
    "unlock pdf online",
    "text to pdf converter",
    "online pdf editor free",
    "private pdf tools",
    "switchr pdf",
  ],
  alternates: {
    canonical: `${siteUrl}/pdf-tools`,
  },
  openGraph: {
    title: "Free PDF Tools Online - Convert, Merge, Split & Protect | Switchr",
    description:
      "100% private in-browser PDF suite. Convert photos to PDF, extract images, protect & unlock PDF files directly on your device with zero server uploads.",
    url: `${siteUrl}/pdf-tools`,
    siteName: "Switchr",
    type: "website",
    images: [
      {
        url: "/api/og?title=Free%20PDF%20Tools%20Suite&subtitle=Merge%2C%20Split%2C%20Compress%2C%20Convert%20%26%20Protect%20PDFs%20Locally",
        width: 1200,
        height: 630,
        alt: "Switchr PDF Suite - Free In-Browser PDF Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Tools Online - Convert, Merge, Split & Protect | Switchr",
    description: "100% private in-browser PDF tools. Convert, merge, compress, protect and unlock PDFs locally.",
    images: ["/api/og?title=Free%20PDF%20Tools%20Suite&subtitle=Merge%2C%20Split%2C%20Compress%2C%20Convert%20%26%20Protect%20PDFs%20Locally"],
  },
};

export default function PdfToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
