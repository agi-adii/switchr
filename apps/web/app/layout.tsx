import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
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

export const metadata: Metadata = {
  title: "Switchr - Universal File Converter",
  description: "A premium, lightning-fast file converter right in your browser. 100% free with zero limits.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Switchr",
  },
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased flex flex-col pb-16 md:pb-0`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />

          {/* Mobile Bottom Navigation (Section 23 of prompt: Home | Convert | Tools | History) */}
          <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border flex items-center justify-around py-2 px-1">
            <Link
              href="/"
              className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-muted-foreground hover:text-primary transition-colors py-1 px-3"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/convert"
              className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-muted-foreground hover:text-primary transition-colors py-1 px-3"
            >
              <Repeat className="w-4 h-4" />
              <span>Convert</span>
            </Link>
            <Link
              href="/tools"
              className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-muted-foreground hover:text-primary transition-colors py-1 px-3"
            >
              <Wrench className="w-4 h-4" />
              <span>Tools</span>
            </Link>
            <Link
              href="/history"
              className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-muted-foreground hover:text-primary transition-colors py-1 px-3"
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </Link>
          </nav>

          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
