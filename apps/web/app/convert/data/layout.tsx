import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Format Converter - JSON, CSV, XML, YAML",
  description:
    "Instantly convert and beautify structured data formats between JSON, CSV, XML, and YAML in your browser.",
  keywords: [
    "data converter",
    "json to csv",
    "csv to json",
    "yaml to json",
    "xml to json",
    "format json online",
  ],
  alternates: {
    canonical: "/convert/data",
  },
  openGraph: {
    title: "Instant Data Converter (JSON, CSV, YAML, XML) | Switchr",
    description: "Convert and transform structured data files right in your browser.",
    url: "/convert/data",
  },
};

export default function ConvertDataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
