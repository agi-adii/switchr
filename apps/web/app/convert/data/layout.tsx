import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchrx.vercel.app";

export const metadata: Metadata = {
  title: "Free Data Converter Online - JSON to CSV, CSV to JSON, XML",
  description:
    "Instantly convert and beautify structured data formats between JSON, CSV, and XML in your browser. 100% private with RFC 4180 parsing and zero server uploads.",
  keywords: [
    "data converter online",
    "json to csv free",
    "csv to json online",
    "xml to json",
    "format json online",
    "convert spreadsheet to json",
    "private data converter",
    "switchr data converter",
  ],
  alternates: {
    canonical: `${siteUrl}/convert/data`,
  },
  openGraph: {
    title: "Instant Free Data Converter Online (JSON, CSV, XML) | Switchr",
    description: "Convert and transform structured data files right in your browser with complete privacy.",
    url: `${siteUrl}/convert/data`,
    siteName: "Switchr",
    type: "website",
    images: [
      {
        url: "/api/og?title=Free%20Data%20Converter&subtitle=Transform%20JSON%2C%20CSV%20%26%20XML%20Datasets%20Locally%20with%20Zero%20Uploads",
        width: 1200,
        height: 630,
        alt: "Switchr Data Converter - Free In-Browser Data Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instant Free Data Converter Online (JSON, CSV, XML) | Switchr",
    description: "Convert and transform structured data files right in your browser with complete privacy.",
    images: ["/api/og?title=Free%20Data%20Converter&subtitle=Transform%20JSON%2C%20CSV%20%26%20XML%20Datasets%20Locally%20with%20Zero%20Uploads"],
  },
};

export default function ConvertDataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
