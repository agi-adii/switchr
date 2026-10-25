import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Font Converter - TTF, OTF, WOFF, WOFF2",
  description:
    "Convert font files between TrueType (TTF), OpenType (OTF), and Web Open Font Format (WOFF) directly in your browser.",
  keywords: [
    "font converter",
    "ttf to otf",
    "otf to ttf",
    "ttf to woff",
    "web font converter",
    "free font converter",
  ],
  alternates: {
    canonical: "https://switchrx.vercel.app/convert/fonts",
  },
  openGraph: {
    title: "Free Online Font Converter | Switchr",
    description: "Convert font files between TTF, OTF, and WOFF right in your browser.",
    url: "https://switchrx.vercel.app/convert/fonts",
  },
};

export default function FontsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
