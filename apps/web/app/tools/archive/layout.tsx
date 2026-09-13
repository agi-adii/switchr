import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Archive Tool - Extract & Create ZIP, TAR Files",
  description:
    "Extract and create ZIP and TAR archives in your browser with zero server uploads. Lightning fast, unlimited file sizes, 100% private.",
  keywords: [
    "zip extractor",
    "create zip online",
    "tar extractor",
    "uncompress zip online free",
    "archive tool",
    "extract zip in browser",
  ],
  alternates: {
    canonical: "/tools/archive",
  },
  openGraph: {
    title: "In-Browser Archive Tool (ZIP, TAR) | Switchr",
    description: "Extract and package ZIP and TAR files directly in your browser with total privacy.",
    url: "/tools/archive",
  },
};

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
