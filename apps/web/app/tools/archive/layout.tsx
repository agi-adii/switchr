import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Archive Tool - Extract & Create ZIP, TAR Files",
  description:
    "Extract and create ZIP and TAR archives in your browser with zero server uploads. Lightning fast client-side archiving with 100% privacy.",
  keywords: [
    "zip extractor",
    "create zip online",
    "tar extractor",
    "uncompress zip online free",
    "archive tool",
    "extract zip in browser",
  ],
  alternates: {
    canonical: "https://switchrx.vercel.app/tools/archive",
  },
  openGraph: {
    title: "In-Browser Archive Tool (ZIP, TAR) | Switchr",
    description: "Extract and package ZIP and TAR files directly in your browser with total privacy.",
    url: "https://switchrx.vercel.app/tools/archive",
    images: [
      {
        url: "/api/og?title=ZIP%20%26%20Archive%20Studio&badge=ZIP%20%2B%20TAR%20%2B%20Unpack",
        width: 1200,
        height: 630,
        alt: "Switchr Archive Studio",
      },
    ],
  },
};

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
