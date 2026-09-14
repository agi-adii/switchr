"use client";

import { useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ConverterTemplate } from "@/components/converter-template";
import { convertImage } from "@/lib/converters/image-converter";
import { imagesToPdf } from "@/lib/converters/pdf-tools";
import { loadFfmpeg, convertFile } from "@/lib/ffmpeg";
import { PseoConversionPair, PSEO_PAIRS } from "@/lib/pseo-registry";
import {
  ShieldCheck,
  Zap,
  Lock,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  pair: PseoConversionPair;
}

export function PseoConverterClient({ pair }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleConvert = async (
    file: File,
    toFormat: string,
    onProgress: (p: number) => void
  ) => {
    // 1. PDF Output from image
    if (toFormat.toLowerCase() === "pdf") {
      const pdfBlob = await imagesToPdf([file], {}, onProgress);
      return {
        url: URL.createObjectURL(pdfBlob),
        newSize: pdfBlob.size,
      };
    }

    // 2. Video or Audio Conversion via FFmpeg WASM
    if (pair.category === "video" || pair.category === "audio") {
      const ffmpeg = await loadFfmpeg();
      const url = await convertFile(ffmpeg, file, toFormat, onProgress);
      return { url };
    }

    // 3. Image Conversion (JPG, PNG, WebP, HEIC, etc.)
    const res = await convertImage(
      file,
      {
        toFormat,
        quality: 0.9,
        maintainAspectRatio: true,
      },
      onProgress
    );

    return {
      url: res.url,
      newSize: res.newSize,
    };
  };

  // Other related conversions for internal SEO cross-linking
  const otherPairs = PSEO_PAIRS.filter((p) => p.slug !== pair.slug).slice(0, 6);

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-12">
      {/* ── 1. Breadcrumbs ── */}
      <Breadcrumbs
        items={[
          { label: "Convert", href: "/convert" },
          { label: `${pair.fromFormat} to ${pair.toFormat}` },
        ]}
      />

      {/* ── 2. Hero Header ── */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold mb-1 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>
            {pair.fromFormat} &rarr; {pair.toFormat} Dedicated Engine
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          {pair.h1}
        </h1>
        <p className="text-xs sm:text-sm text-white/70 max-w-2xl mx-auto leading-relaxed">
          {pair.subtitle}
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-white/90">
            <Lock className="w-3 h-3 text-emerald-400" />
            100% Client-Side Private
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-white/90">
            <Zap className="w-3 h-3 text-amber-400" />
            No File Size Limits
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-white/90">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            Zero Server Upload
          </span>
        </div>
      </div>

      {/* ── 3. Converter Workspace ── */}
      <section aria-label="File Converter Workspace">
        <ConverterTemplate
          title={`${pair.fromFormat} to ${pair.toFormat} Converter`}
          description={`Convert ${pair.fromFormat} files directly into ${pair.toFormat} format.`}
          breadcrumbs={[]}
          accept={pair.accept}
          recommendedFormats={pair.recommendedFormats}
          moreFormats={pair.moreFormats}
          defaultTarget={pair.defaultTarget}
          category={pair.category}
          onConvert={handleConvert}
        />
      </section>

      {/* ── 4. Key Benefits Cards ── */}
      <section className="space-y-4" aria-label="Why Use Switchr">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Why Convert {pair.fromFormat} to {pair.toFormat} with Switchr?
          </h2>
          <p className="text-xs text-white/60">
            Engineered from the ground up for maximum privacy, speed, and reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pair.benefits.map((b, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-sm hover:border-white/40 hover:bg-white/15 transition-all space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/20 text-white flex items-center justify-center font-bold text-xs">
                0{idx + 1}
              </div>
              <h3 className="text-sm font-bold text-white">{b.title}</h3>
              <p className="text-xs text-white/70 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Step-by-Step How-To Guide ── */}
      <section className="space-y-4" aria-label="How to Convert">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            How to Convert {pair.fromFormat} to {pair.toFormat} in 3 Easy Steps
          </h2>
          <p className="text-xs text-white/60">
            No software installation or account registration needed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pair.howTo.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white/15 text-white border border-white/25">
                  Step {idx + 1}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{step.name}</h3>
                <p className="text-xs text-white/70 leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Rich FAQ Accordion ── */}
      <section className="space-y-4 max-w-3xl mx-auto" aria-label="Frequently Asked Questions">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80">
            <HelpCircle className="w-3.5 h-3.5 text-white" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {pair.faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-white/90"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/70 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-4 pt-1 text-xs text-white/70 border-t border-white/10 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 7. Related Popular Converters Grid (SEO Cross-links) ── */}
      <section className="space-y-4 pt-4 border-t border-white/15" aria-label="Other Popular Tools">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-white">
            Other Popular Conversions
          </h2>
          <Link
            href="/convert"
            className="text-xs font-bold text-white hover:underline flex items-center gap-1"
          >
            <span>All Converters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {otherPairs.map((op) => (
            <Link
              key={op.slug}
              href={`/convert/${op.slug}`}
              className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all text-center group block shadow-xs"
            >
              <span className="text-xs font-bold text-white block group-hover:text-white transition-colors">
                {op.fromFormat} &rarr; {op.toFormat}
              </span>
              <span className="text-[10px] text-white/60 block mt-0.5">Free Online</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
