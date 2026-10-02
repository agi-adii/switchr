import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { HelpCircle, ShieldCheck, Zap, HardDrive, Wifi, Layers, Lock } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Switchr",
  description:
    "Everything you need to know about Switchr: zero server uploads, privacy architecture, supported formats, file limits, and offline capability.",
  alternates: {
    canonical: "https://switchrx.vercel.app/faq",
  },
};

const FAQ_ITEMS = [
  {
    category: "Privacy & Security",
    icon: Lock,
    questions: [
      {
        q: "Are my files ever uploaded to any cloud server?",
        a: "No, never. Switchr executes 100% inside your browser sandbox using HTML5 Canvas, WebAssembly, and local JavaScript APIs. Your documents, photos, and videos never leave your device.",
      },
      {
        q: "How can I verify that Switchr does not upload my files?",
        a: "You can independently verify this in any modern browser. Open Developer Tools (press F12), click on the 'Network' tab, filter by 'Fetch/XHR', and convert any file. You will see zero POST requests and zero bytes uploaded over the network.",
      },
      {
        q: "Do you use cookies, analytics, or third-party trackers?",
        a: "No. Switchr does not use Google Analytics, Facebook Pixels, or advertising cookies. We do not track users or build advertising profiles.",
      },
    ],
  },
  {
    category: "Capabilities & File Limits",
    icon: Zap,
    questions: [
      {
        q: "What is the maximum file size limit for conversion?",
        a: "Because there are no remote cloud servers, there are zero artificial server limits. Your conversion capacity is determined solely by your computer or phone's available RAM and browser memory (typically handling files from 500 MB to 2 GB comfortably).",
      },
      {
        q: "Does image or PDF compression cause quality loss?",
        a: "Switchr uses smart adaptive compression. For lossless formats (like PNG, WebP lossless, and ZIP), data is preserved bit-for-bit. For lossy formats (like JPG and WebM), perceptual compression eliminates redundant visual data while keeping typography and textures crisp.",
      },
      {
        q: "Can I convert multiple files at once in batch?",
        a: "Yes. Many of our tools, including PDF merger, Images to PDF, and ZIP studio, allow uploading multiple files and downloading the combined result or a clean ZIP archive.",
      },
    ],
  },
  {
    category: "Formats & Codecs",
    icon: Layers,
    questions: [
      {
        q: "Which file formats does Switchr support?",
        a: "Switchr supports over 200 formats across images (WebP, PNG, JPG, AVIF, HEIC, SVG, BMP), video (MP4, WebM, MOV, GIF, AVI), audio (MP3, WAV, FLAC, AAC, OGG), documents (PDF, DOCX, PPTX, PPT, TXT, HTML), and data (JSON, CSV, XML).",
      },
      {
        q: "How does Apple HEIC conversion work on Windows?",
        a: "Windows often lacks the native HEVC codec needed to open iPhone photos. Switchr includes an in-browser libheif WebAssembly decoder that decodes HEIC photos directly on Windows and Linux without paid codec extensions.",
      },
      {
        q: "How does video transcoding work without cloud servers?",
        a: "We package an optimized WebAssembly build of FFmpeg that runs multi-threaded encoding directly on your device CPU, transcoding video and audio tracks right inside your browser tab.",
      },
    ],
  },
  {
    category: "Offline & PWA",
    icon: Wifi,
    questions: [
      {
        q: "Does Switchr work offline?",
        a: "Yes. Switchr is engineered as a Progressive Web App (PWA). Once the application shell and core conversion libraries are cached in your browser, core image transformations and PDF tools function without an active internet connection.",
      },
      {
        q: "How do I install Switchr on my desktop or phone?",
        a: "In Chrome, Edge, or Brave, click the Install icon in the address bar (or the Install App button in our header). On iOS Safari, tap Share and choose 'Add to Home Screen'.",
      },
      {
        q: "Is an account or login required?",
        a: "No. Switchr requires no sign-up, no email address, and no account. All features are open to everyone immediately.",
      },
    ],
  },
];

export default function FaqPage() {
  const allFaqs = FAQ_ITEMS.flatMap((cat) =>
    cat.questions.map((q) => ({ question: q.q, answer: q.a }))
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFaqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://switchrx.vercel.app",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "FAQ",
        "item": "https://switchrx.vercel.app/faq",
      },
    ],
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs items={[{ label: "FAQ" }]} />

      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
          Clear, straightforward answers about how Switchr operates, our privacy guarantees, and how to get the most out of our client-side tools.
        </p>
      </div>

      <div className="space-y-8">
        {FAQ_ITEMS.map((cat) => {
          const Icon = cat.icon;
          return (
            <section key={cat.category} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <Icon className="w-4 h-4 text-primary" />
                <h2 className="text-base font-bold text-foreground">{cat.category}</h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {cat.questions.map((q) => (
                  <div key={q.q} className="p-5 rounded-2xl bg-card border border-border space-y-2">
                    <h3 className="font-bold text-sm text-foreground">{q.q}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{q.a}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="p-6 rounded-2xl bg-card/60 border border-border text-center space-y-3">
        <h3 className="text-sm font-bold text-foreground">Still have questions?</h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Need a specific converter or want to verify our open source implementation? Visit our GitHub or get in touch.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/contact"
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors"
          >
            Contact Support
          </Link>
          <Link
            href="/about"
            className="px-4 py-2 rounded-xl border border-border bg-card font-bold text-xs text-foreground hover:bg-muted transition-colors"
          >
            Learn About Switchr
          </Link>
        </div>
      </div>
    </div>
  );
}
