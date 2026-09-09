import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20 text-xs text-muted-foreground mt-auto">
      <div className="container mx-auto px-4 md:px-8 py-12 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg overflow-hidden">
                <Image src="/logo.jpg" alt="Switchr Logo" width={24} height={24} className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-foreground text-sm">Switchr</span>
            </div>
            <p className="text-muted-foreground/80 leading-relaxed text-[11px]">
              Free, fast, and private file conversion for everyone. No registration, no paywalls, zero artificial limits.
            </p>
            <div className="flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Privacy Guaranteed</span>
            </div>
          </div>

          {/* Converters */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
              Converters
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/convert/images" className="hover:text-foreground hover:underline">Image Converter</Link></li>
              <li><Link href="/convert/documents" className="hover:text-foreground hover:underline">Document Converter</Link></li>
              <li><Link href="/convert/audio" className="hover:text-foreground hover:underline">Audio Converter</Link></li>
              <li><Link href="/convert/video" className="hover:text-foreground hover:underline">Video Converter</Link></li>
              <li><Link href="/convert/data" className="hover:text-foreground hover:underline">Data Converter</Link></li>
            </ul>
          </div>

          {/* PDF & Tools */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
              Tools
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/pdf-tools" className="hover:text-foreground hover:underline">PDF Toolbox</Link></li>
              <li><Link href="/compress" className="hover:text-foreground hover:underline">File Compressor</Link></li>
              <li><Link href="/tools/archive" className="hover:text-foreground hover:underline">ZIP Archive Tools</Link></li>
              <li><Link href="/tools" className="hover:text-foreground hover:underline">All Tools Directory</Link></li>
              <li><Link href="/history" className="hover:text-foreground hover:underline">Conversion History</Link></li>
            </ul>
          </div>

          {/* About & Trust */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
              About
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/about" className="hover:text-foreground hover:underline">About &amp; Privacy</Link></li>
              <li><Link href="/account" className="hover:text-foreground hover:underline">Account Dashboard</Link></li>
              <li><Link href="/about#faq" className="hover:text-foreground hover:underline">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p>© {new Date().getFullYear()} Switchr. A free public utility platform.</p>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>Built with care for universal accessibility</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
