import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Switchr - 100% Private, Client-Side File Conversion",
  description:
    "Learn how Switchr uses WebAssembly, Web Workers, and modern browser standards to deliver instant, secure, zero-server file conversions.",
  keywords: [
    "about switchr",
    "private file converter",
    "client-side file conversion",
    "webassembly file converter",
  ],
  alternates: {
    canonical: "https://switchrx.vercel.app/about",
  },
  openGraph: {
    title: "About Switchr - Privacy-First File Conversion",
    description: "Discover why Switchr keeps your files 100% private with local WebAssembly processing.",
    url: "https://switchrx.vercel.app/about",
    images: [
      {
        url: "/api/og?title=About%20Switchr&badge=Zero%20Server%20Uploads",
        width: 1200,
        height: 630,
        alt: "About Switchr",
      },
    ],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
