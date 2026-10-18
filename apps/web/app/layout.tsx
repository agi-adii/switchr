import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { PwaProvider } from "@/lib/pwa-context";
import { PwaInstallBanner } from "@/components/pwa-install-banner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

import { JsonLd } from "@/components/seo/json-ld";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchrx.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Switchr - Free Universal File Converter & PDF Suite",
    template: "%s | Switchr",
  },
  description:
    "Free, lightning-fast in-browser file converter. Convert images, video, audio, PDFs, and docs locally with WebAssembly. Zero uploads and total privacy.",
  keywords: [
    "file converter",
    "free file converter",
    "online file converter",
    "convert files online",
    "image converter",
    "video converter",
    "audio converter",
    "pdf tools",
    "free pdf converter",
    "merge pdf online",
    "compress pdf free",
    "image compressor",
    "video compressor",
    "webp to png",
    "png to jpg",
    "heic to jpg",
    "mp4 to webm",
    "mp3 converter",
    "client-side file converter",
    "webassembly converter",
    "private file converter",
    "switchr",
  ],
  authors: [{ name: "Switchr" }],
  creator: "Switchr",
  publisher: "Switchr",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "tmqaM3yKYddbFFhrHWett8KIfDMxuujgomlHbUN5RL4",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Switchr",
    title: "Switchr - Free Universal File Converter & PDF Suite",
    description:
      "Convert images, videos, audio, documents, and PDFs directly in your browser. 100% free, private, zero server uploads.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Switchr - Universal In-Browser File Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Switchr - Free Universal File Converter & PDF Suite",
    description:
      "Convert images, videos, audio, documents, and PDFs right in your browser. 100% free, private, zero server uploads.",
    images: ["/api/og"],
    creator: "@switchrapp",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Switchr",
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="tmqaM3yKYddbFFhrHWett8KIfDMxuujgomlHbUN5RL4" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground font-sans antialiased m-0 p-0 overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <PwaProvider>
            {/* Structured Data for Search Engine Rich Snippets */}
            <JsonLd />

            <main className="w-full min-h-screen m-0 p-0">{children}</main>

            {/* PWA Floating Install Banner and Offline Notice */}
            <PwaInstallBanner />

            <Toaster richColors position="top-center" />
          </PwaProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
