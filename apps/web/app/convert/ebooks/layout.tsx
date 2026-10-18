import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free E-Book Converter - EPUB, TXT, HTML, PDF",
  description:
    "Convert e-books from EPUB to TXT, HTML, and PDF directly in your browser without uploading to external servers.",
  keywords: [
    "ebook converter",
    "epub to pdf",
    "epub to txt",
    "epub to html",
    "free epub converter",
  ],
  alternates: {
    canonical: "https://switchrx.vercel.app/convert/ebooks",
  },
  openGraph: {
    title: "Free Online E-Book Converter | Switchr",
    description: "Convert EPUB e-books to clean readable text, HTML, and PDF documents.",
    url: "https://switchrx.vercel.app/convert/ebooks",
  },
};

export default function EbooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
