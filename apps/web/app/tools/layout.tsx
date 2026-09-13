import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Utility Tools - Image Enhancer, Archive Extractor & Converters",
  description:
    "Explore Switchr's privacy-first browser tools: AI photo enhancement, archive compression, PDF utilities, and file format converters.",
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
    canonical: "/tools",
  },
  openGraph: {
    title: "Privacy-First Web Utilities & Tools | Switchr",
    description: "AI photo enhancer, archive extractor, PDF tools, and file converters.",
    url: "/tools",
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
