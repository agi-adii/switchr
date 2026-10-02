import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Heart, ExternalLink, Sparkles } from "lucide-react";

function GithubIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-border/80 bg-card/40 backdrop-blur-md text-xs text-muted-foreground mt-auto overflow-hidden">
      {/* Moving Accent Border Line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-moving-gradient pointer-events-none" />
      <div className="container mx-auto px-4 md:px-8 py-12 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg overflow-hidden">
                <Image
                  src="/logo.svg"
                  alt="Switchr Logo"
                  width={24}
                  height={24}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-extrabold text-foreground text-sm">Switchr</span>
            </div>
            <p className="text-muted-foreground/80 leading-relaxed text-[11px]">
              Free, fast, and private file conversion for everyone. 100% in-browser WebAssembly processing with zero server uploads.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side Privacy</span>
            </div>
          </div>

          {/* Popular Converters */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
              Popular Converters
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/convert/webp-to-png" className="hover:text-foreground hover:underline">WebP to PNG</Link></li>
              <li><Link href="/convert/heic-to-jpg" className="hover:text-foreground hover:underline">HEIC to JPG</Link></li>
              <li><Link href="/convert/png-to-jpg" className="hover:text-foreground hover:underline">PNG to JPG</Link></li>
              <li><Link href="/convert/mp4-to-webm" className="hover:text-foreground hover:underline">MP4 to WebM</Link></li>
              <li><Link href="/convert/mov-to-mp4" className="hover:text-foreground hover:underline">MOV to MP4</Link></li>
              <li><Link href="/convert/merge-pdf" className="hover:text-foreground hover:underline">Merge PDF Online</Link></li>
              <li><Link href="/convert" className="hover:text-foreground hover:underline font-bold text-primary">All 200+ Formats &rarr;</Link></li>
            </ul>
          </div>

          {/* PDF & Tools */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
              Specialized Tools
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/pdf-tools" className="hover:text-foreground hover:underline">PDF Management Suite</Link></li>
              <li><Link href="/compress" className="hover:text-foreground hover:underline">Smart File Compressor</Link></li>
              <li><Link href="/tools/enhance" className="hover:text-foreground hover:underline">AI Photo Enhancer</Link></li>
              <li><Link href="/tools/archive" className="hover:text-foreground hover:underline">ZIP Archive Tools</Link></li>
              <li><Link href="/convert/data" className="hover:text-foreground hover:underline">JSON &amp; CSV Data Studio</Link></li>
              <li><Link href="/tools" className="hover:text-foreground hover:underline font-bold text-primary">Tools Directory &rarr;</Link></li>
            </ul>
          </div>

          {/* About & Trust */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
              Trust &amp; Legal
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/about" className="hover:text-foreground hover:underline">About &amp; Security</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground hover:underline">Terms of Service</Link></li>
              <li><Link href="/faq" className="hover:text-foreground hover:underline">Frequently Asked Questions</Link></li>
              <li><Link href="/contact" className="hover:text-foreground hover:underline">Contact &amp; Support</Link></li>
              <li>
                <a
                  href="https://github.com/agi-adii/switchr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground hover:underline inline-flex items-center gap-1 text-primary"
                >
                  <GithubIcon className="w-3 h-3" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p>© {new Date().getFullYear()} Switchr. A free public client-side file transformation suite.</p>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span>Built by agi-adii</span>
            <span>•</span>
            <Link href="/about" className="hover:underline">DevTools Verification Guide</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
