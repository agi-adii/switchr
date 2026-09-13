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
    canonical: "/about",
  },
  openGraph: {
    title: "About Switchr - Privacy-First File Conversion",
    description: "Discover why Switchr keeps your files 100% private with local WebAssembly processing.",
    url: "/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
