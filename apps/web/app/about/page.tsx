"use client";

import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  ShieldCheck,
  Lock,
  Zap,
  Heart,
  CheckCircle2,
  Terminal,
  WifiOff,
  ExternalLink,
  Code2,
  Cpu,
  Eye,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const smoothEase = [0.16, 1, 0.3, 1] as const;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: smoothEase },
  }),
};

export default function AboutPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-12">
      <Breadcrumbs items={[{ label: "About" }]} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: smoothEase }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          <span>Free Public Utility Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          About Switchr
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Switchr is a 100% in-browser, privacy-first file conversion and PDF management engine built with Next.js and WebAssembly. Your files are processed entirely on your device and are never transmitted to any server.
        </p>

        {/* GitHub link button */}
        <div className="pt-2 flex justify-center">
          <a
            href="https://github.com/agi-adii/switchr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card/80 hover:bg-card hover:border-primary/50 text-xs font-bold text-foreground transition-all shadow-xs"
          >
            <GithubIcon className="w-4 h-4" />
            <span>View Source on GitHub</span>
            <ExternalLink className="w-3 h-3 text-muted-foreground" />
          </a>
        </div>
      </motion.div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Lock,
            color: "bg-emerald-500/10 text-emerald-500",
            title: "100% Private Sandbox",
            desc: "All audio, video, image, document, and PDF processing happens locally via WebAssembly and Canvas APIs. No cloud storage, no data logging.",
          },
          {
            icon: CheckCircle2,
            color: "bg-blue-500/10 text-blue-500",
            title: "Completely Free",
            desc: "No paid subscriptions, no hidden daily file quotas, no account gates, and no watermarks. Every feature is free for all users.",
          },
          {
            icon: Zap,
            color: "bg-amber-500/10 text-amber-500",
            title: "Zero Queue Wait Times",
            desc: "Bypasses slow cloud queues. Conversions execute instantly with multi-threaded local hardware acceleration.",
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="bg-card border border-border rounded-3xl p-6 shadow-xs space-y-3"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Technical Architecture & E-E-A-T ── */}
      <section className="space-y-4 pt-6 border-t border-border" aria-label="Technical Architecture">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
            <Cpu className="w-3.5 h-3.5" />
            <span>Architecture &amp; Security</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            How Client-Side Conversion Works
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Traditional online converters force you to upload your files to cloud servers where they sit on third-party hard drives. Switchr is fundamentally different:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-500" />
              WebAssembly (WASM) Cores
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We compile industry-standard native engines (like FFmpeg for multimedia, libheif for Apple photos, and pdf-lib/pdf.js for document streams) into WebAssembly binaries that execute directly inside your browser process.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Zero Remote Memory Retention
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Files are held temporarily in browser ArrayBuffers during transcoding. As soon as you download or clear your file, your browser garbage-collects the memory buffers immediately.
            </p>
          </div>
        </div>
      </section>

      {/* ── How to Verify Your Files Never Leave Your Device (Audit Guide) ── */}
      <section className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/5 via-card to-card p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold">
            <Eye className="w-3.5 h-3.5" />
            <span>Independent Verification</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground">
            How to Verify Your Files Never Leave Your Device
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            You don't have to take our word for it. You can inspect network activity yourself in 30 seconds using your browser's built-in developer tools:
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              step: "1",
              title: "Open Developer Tools",
              desc: "On Chrome, Edge, or Brave, press F12 (or right-click anywhere and select 'Inspect'). On macOS, press Cmd + Option + I.",
            },
            {
              step: "2",
              title: "Navigate to the Network Tab",
              desc: "Click on the 'Network' tab at the top of the DevTools panel and select the 'Fetch/XHR' filter button to isolate data transfers.",
            },
            {
              step: "3",
              title: "Upload & Convert Any File",
              desc: "Drop a photo, video, audio file, or PDF into any Switchr converter and click Convert.",
            },
            {
              step: "4",
              title: "Observe Zero Network Uploads",
              desc: "Watch the Network panel: Notice that 0 POST requests, 0 file streams, and 0 bytes are transmitted over the network. The conversion completes entirely within your browser memory.",
            },
            {
              step: "5",
              title: "Bonus: Test Airplane Mode",
              desc: "Disconnect your Wi-Fi or turn on Airplane mode after loading the page: You will see that core conversions and compression continue working completely offline!",
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4 p-4 rounded-2xl bg-card/60 border border-border">
              <span className="w-7 h-7 rounded-xl bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0">
                {item.step}
              </span>
              <div className="space-y-0.5">
                <h3 className="font-bold text-xs sm:text-sm text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Navigation Links to Trust Pages */}
      <div className="pt-6 border-t border-border flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-muted-foreground">
        <Link href="/privacy" className="hover:text-primary transition-colors">
          Privacy Policy
        </Link>
        <span>•</span>
        <Link href="/terms" className="hover:text-primary transition-colors">
          Terms of Service
        </Link>
        <span>•</span>
        <Link href="/contact" className="hover:text-primary transition-colors">
          Contact Us
        </Link>
        <span>•</span>
        <Link href="/faq" className="hover:text-primary transition-colors">
          Full FAQ
        </Link>
      </div>
    </div>
  );
}
