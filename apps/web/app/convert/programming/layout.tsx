import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Developer & Code Converter - YAML, JSON, Markdown, TOML",
  description:
    "Convert developer configurations and documents including YAML to JSON, Markdown to HTML, and TSV to CSV directly in your browser.",
  keywords: [
    "yaml to json",
    "json to yaml",
    "markdown to html",
    "code converter",
    "developer tools",
    "free config converter",
  ],
  alternates: {
    canonical: "https://switchrx.vercel.app/convert/programming",
  },
  openGraph: {
    title: "Free Developer Format Converter | Switchr",
    description: "Convert YAML, JSON, Markdown, and configuration formats right in your browser.",
    url: "https://switchrx.vercel.app/convert/programming",
  },
};

export default function ProgrammingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
