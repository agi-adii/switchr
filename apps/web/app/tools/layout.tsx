import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All In-Browser File Tools & Utilities",
  description:
    "Explore Switchr's suite of free, client-side tools: photo enhancer, PDF editor, smart compression, and 200+ file format converters.",
  keywords: [
    "web tools",
    "browser utilities",
    "image enhancer",
    "zip tool",
    "pdf tools",
    "file tools",
    "switchr tools",
  ],
  alternates: {
    canonical: "https://switchrx.vercel.app/tools",
  },
  openGraph: {
    title: "All In-Browser File Tools & Utilities | Switchr",
    description: "Free, client-side photo enhancer, PDF tools, compressor, and converters.",
    url: "https://switchrx.vercel.app/tools",
    images: [
      {
        url: "/api/og?title=All%20In-Browser%20File%20Tools%20%26%20Utilities",
        width: 1200,
        height: 630,
        alt: "Switchr Tools Directory",
      },
    ],
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
