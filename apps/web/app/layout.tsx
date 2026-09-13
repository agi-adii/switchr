import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { GlobalAmbientMotion } from "@/components/global-ambient-motion";
import { PageMotionWrapper } from "@/components/page-motion-wrapper";
import Link from "next/link";
import { Home, Repeat, Wrench, History } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  alternates: {
    canonical: "/",
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
        url: "/logo.jpg",
        width: 512,
        height: 512,
        alt: "Switchr - Universal File Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Switchr - Free Universal File Converter & PDF Suite",
    description:
      "Convert images, videos, audio, documents, and PDFs right in your browser. 100% free, private, and unlimited.",
    images: ["/logo.jpg"],
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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/logo.jpg", type: "image/jpeg", sizes: "512x512" },
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
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased flex flex-col pb-16 md:pb-0 relative overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Structured Data for Search Engine Rich Snippets */}
          <JsonLd />

          {/* Continuous Moving Background Motion on every page */}
          <GlobalAmbientMotion />

          <Navbar />

          {/* Smooth fluid page transition motion on every route */}
          <PageMotionWrapper>
            <main className="flex-1 relative z-10">{children}</main>
          </PageMotionWrapper>

          <Footer />

          {/* Mobile Bottom Navigation */}
          <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07071299]/95 backdrop-blur-xl border-t border-indigo-500/15 flex items-center justify-around py-3 px-2">
            <Link
              href="/"
              className="flex flex-col items-center gap-1.5 text-[10px] font-semibold text-zinc-500 hover:text-indigo-400 transition-colors"
            >
              <span className="icon-btn w-8 h-8 rounded-[0.5rem]"><Home className="w-3.5 h-3.5" /></span>
              <span>Home</span>
            </Link>
            <Link
              href="/convert"
              className="flex flex-col items-center gap-1.5 text-[10px] font-semibold text-zinc-500 hover:text-indigo-400 transition-colors"
            >
              <span className="icon-btn w-8 h-8 rounded-[0.5rem]"><Repeat className="w-3.5 h-3.5" /></span>
              <span>Convert</span>
            </Link>
            <Link
              href="/tools"
              className="flex flex-col items-center gap-1.5 text-[10px] font-semibold text-zinc-500 hover:text-indigo-400 transition-colors"
            >
              <span className="icon-btn w-8 h-8 rounded-[0.5rem]"><Wrench className="w-3.5 h-3.5" /></span>
              <span>Tools</span>
            </Link>
            <Link
              href="/history"
              className="flex flex-col items-center gap-1.5 text-[10px] font-semibold text-zinc-500 hover:text-indigo-400 transition-colors"
            >
              <span className="icon-btn w-8 h-8 rounded-[0.5rem]"><History className="w-3.5 h-3.5" /></span>
              <span>History</span>
            </Link>
          </nav>


          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
