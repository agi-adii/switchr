import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchrx.vercel.app";

export const metadata: Metadata = {
  title: "Free Document Converter Online - PDF, DOCX, PPTX, TXT",
  description:
    "Convert documents quickly and securely without data leaks. Fast, free in-browser conversion between PDF, Word DOCX, PowerPoint PPTX, and text formats.",
  keywords: [
    "document converter online",
    "free document converter",
    "docx to pdf",
    "pptx to pdf",
    "ppt to pdf",
    "pptx to docx",
    "text to pdf",
    "convert documents online",
    "confidential document converter",
    "switchr documents",
  ],
  alternates: {
    canonical: `${siteUrl}/convert/documents`,
  },
  openGraph: {
    title: "Secure Free Document Converter Online | Switchr",
    description: "Convert documents locally with complete confidentiality. No uploads to third-party servers.",
    url: `${siteUrl}/convert/documents`,
    siteName: "Switchr",
    type: "website",
    images: [
      {
        url: "/api/og?title=Free%20Document%20Converter&subtitle=Convert%20PDF%2C%20DOCX%2C%20PPTX%2C%20PPT%20%26%20TXT%20Locally%20with%20Zero%20Uploads",
        width: 1200,
        height: 630,
        alt: "Switchr Document Converter - Free In-Browser Document Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Secure Free Document Converter Online | Switchr",
    description: "Convert documents locally with complete confidentiality. No uploads to third-party servers.",
    images: ["/api/og?title=Free%20Document%20Converter&subtitle=Convert%20PDF%2C%20DOCX%2C%20PPTX%2C%20PPT%20%26%20TXT%20Locally%20with%20Zero%20Uploads"],
  },
};

export default function ConvertDocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
