import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchrx.vercel.app";

export const metadata: Metadata = {
  title: "All In-Browser File Tools & PDF Utilities Directory",
  description:
    "Explore Switchr's suite of free, client-side tools: AI photo enhancer, PDF editor, smart compression, archive unpacker, and multi-format converters.",
  keywords: [
    "file tools online",
    "browser utilities",
    "free pdf editor",
    "ai photo enhancer",
    "online zip extractor",
    "smart file compressor",
    "universal file converter",
    "switchr tools",
  ],
  alternates: {
    canonical: `${siteUrl}/tools`,
  },
  openGraph: {
    title: "All In-Browser File Tools & PDF Utilities | Switchr",
    description: "Free, client-side photo enhancer, PDF tools, compressor, archive studio, and converters.",
    url: `${siteUrl}/tools`,
    siteName: "Switchr",
    type: "website",
    images: [
      {
        url: "/api/og?title=All%20In-Browser%20File%20Tools%20%26%20Utilities&subtitle=AI%20Photo%20Enhancer%2C%20PDF%20Suite%2C%20File%20Compressor%20%26%20Converters",
        width: 1200,
        height: 630,
        alt: "Switchr Tools Directory - Free In-Browser File Utilities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All In-Browser File Tools & PDF Utilities | Switchr",
    description: "Free, client-side photo enhancer, PDF tools, compressor, and converters.",
    images: ["/api/og?title=All%20In-Browser%20File%20Tools%20%26%20Utilities&subtitle=AI%20Photo%20Enhancer%2C%20PDF%20Suite%2C%20File%20Compressor%20%26%20Converters"],
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
