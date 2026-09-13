import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Document Converter - PDF, DOCX, TXT, Markdown",
  description:
    "Convert documents quickly and securely without data leaks. Fast conversion between PDF, Word, Markdown, and text formats.",
  keywords: [
    "document converter",
    "pdf converter",
    "docx to pdf",
    "markdown converter",
    "txt to pdf",
    "convert documents free",
  ],
  alternates: {
    canonical: "/convert/documents",
  },
  openGraph: {
    title: "Secure Document Converter | Switchr",
    description: "Convert documents locally with complete confidentiality. No uploads to third-party servers.",
    url: "/convert/documents",
  },
};

export default function ConvertDocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
