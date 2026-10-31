import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchrx.vercel.app";

export const metadata: Metadata = {
  title: "Free ZIP Tool Online - Extract, Unzip & Create ZIP Files",
  description:
    "Extract and create ZIP and TAR archives directly in your browser. 100% private, client-side unzipping with zero cloud uploads and no software installation.",
  keywords: [
    "free zip tool online",
    "extract zip online free",
    "unzip files online",
    "create zip online free",
    "zip opener online",
    "open zip file without winrar",
    "tar extractor online",
    "uncompress zip free",
    "online archive tool",
    "extract zip in browser",
    "switchr archive",
  ],
  alternates: {
    canonical: `${siteUrl}/tools/archive`,
  },
  openGraph: {
    title: "Free Online ZIP Tool - Extract & Create ZIP Archives | Switchr",
    description:
      "Open, extract, inspect, and bundle ZIP and TAR archives in-browser with complete privacy and zero server uploads.",
    url: `${siteUrl}/tools/archive`,
    siteName: "Switchr",
    type: "website",
    images: [
      {
        url: "/api/og?title=Free%20ZIP%20%26%20Archive%20Studio&subtitle=Extract%2C%20Inspect%20%26%20Create%20ZIP%20Archives%20Locally%20with%20Zero%20Uploads",
        width: 1200,
        height: 630,
        alt: "Switchr Archive Studio - Free In-Browser ZIP Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online ZIP Tool - Extract & Create ZIP Archives | Switchr",
    description: "Extract, unzip, and create ZIP archives directly in your browser with 100% privacy.",
    images: ["/api/og?title=Free%20ZIP%20%26%20Archive%20Studio&subtitle=Extract%2C%20Inspect%20%26%20Create%20ZIP%20Archives%20Locally%20with%20Zero%20Uploads"],
  },
};

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
