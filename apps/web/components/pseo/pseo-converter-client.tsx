"use client";

import { useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ConverterTemplate } from "@/components/converter-template";
import { convertImage } from "@/lib/converters/image-converter";
import { imagesToPdf, pdfToImages, createImagesZip } from "@/lib/converters/pdf-tools";
import {
  presentationToPdf,
  presentationToDocx,
  docxToPdf,
} from "@/lib/converters/presentation-converter";
import { jsonToCsv, csvToJson } from "@/lib/converters/data-converter";
import { loadFfmpeg, convertFile } from "@/lib/ffmpeg";
import { PseoConversionPair, getRelatedPseoPairs } from "@/lib/pseo-registry";
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
  Layers,
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
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const isPpt = ext === "pptx" || ext === "ppt" || pair.fromFormat.toLowerCase().includes("ppt");
    const isDocx = ext === "docx" || pair.fromFormat.toLowerCase().includes("docx");

    // 1. Data conversions: JSON <-> CSV
    if (pair.slug === "json-to-csv" || toFormat.toLowerCase() === "csv") {
      const text = await file.text();
      onProgress(0.5);
      const csvStr = jsonToCsv(text);
      onProgress(1.0);
      const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
      return {
        url: URL.createObjectURL(blob),
        newSize: blob.size,
      };
    }

    if (pair.slug === "csv-to-json" || toFormat.toLowerCase() === "json") {
      const text = await file.text();
      onProgress(0.5);
      const jsonArr = csvToJson(text);
      onProgress(1.0);
      const blob = new Blob([JSON.stringify(jsonArr, null, 2)], {
        type: "application/json;charset=utf-8;",
      });
      return {
        url: URL.createObjectURL(blob),
        newSize: blob.size,
      };
    }

    // 2. PDF Tools: Compress PDF / Merge PDF
    if (pair.slug === "compress-pdf" && ext === "pdf") {
      onProgress(0.3);
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      onProgress(0.7);
      const pdfBytes = await doc.save({ useObjectStreams: true });
      onProgress(1.0);
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      return {
        url: URL.createObjectURL(blob),
        newSize: blob.size,
      };
    }

    if (pair.slug === "merge-pdf" && ext === "pdf") {
      onProgress(0.3);
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      onProgress(0.7);
      const pdfBytes = await doc.save({ useObjectStreams: true });
      onProgress(1.0);
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      return {
        url: URL.createObjectURL(blob),
        newSize: blob.size,
      };
    }

    // 3. PDF to Images (pdf-to-jpg, pdf-to-png)
    if (
      ext === "pdf" &&
      (toFormat.toLowerCase() === "jpg" ||
        toFormat.toLowerCase() === "jpeg" ||
        toFormat.toLowerCase() === "png" ||
        toFormat.toLowerCase() === "webp")
    ) {
      const format = toFormat.toLowerCase() === "jpg" ? "jpeg" : (toFormat.toLowerCase() as "png" | "jpeg" | "webp");
      const pages = await pdfToImages(file, { format, scale: 1.5, quality: 0.92 }, onProgress);
      if (pages.length === 1) {
        return {
          url: pages[0].dataUrl,
          newSize: pages[0].blob.size,
        };
      }
      const zipBlob = await createImagesZip(pages, file.name, format);
      return {
        url: URL.createObjectURL(zipBlob),
        newSize: zipBlob.size,
      };
    }

    // 4. DOCX Output
    if (toFormat.toLowerCase() === "docx") {
      if (isPpt) {
        const docxBlob = await presentationToDocx(file, onProgress);
        return {
          url: URL.createObjectURL(docxBlob),
          newSize: docxBlob.size,
        };
      }
    }

    // 5. PDF Output (Presentations, Word docs, Images)
    if (toFormat.toLowerCase() === "pdf") {
      if (isPpt) {
        const pdfBlob = await presentationToPdf(file, {}, onProgress);
        return {
          url: URL.createObjectURL(pdfBlob),
          newSize: pdfBlob.size,
        };
      }
      if (isDocx) {
        const pdfBlob = await docxToPdf(file, onProgress);
        return {
          url: URL.createObjectURL(pdfBlob),
          newSize: pdfBlob.size,
        };
      }
      const pdfBlob = await imagesToPdf([file], {}, onProgress);
      return {
        url: URL.createObjectURL(pdfBlob),
        newSize: pdfBlob.size,
      };
    }

    // 6. Video or Audio Conversion via FFmpeg WASM
    if (pair.category === "video" || pair.category === "audio") {
      const ffmpeg = await loadFfmpeg();
      const url = await convertFile(ffmpeg, file, toFormat, onProgress);
      return { url };
    }

    // 7. Image Conversion (JPG, PNG, WebP, HEIC, etc.)
    const res = await convertImage(
      file,
      {
        toFormat,
        quality: 0.92,
        maintainAspectRatio: true,
      },
      onProgress
    );

    return {
      url: res.url,
      newSize: res.newSize,
    };
  };

  const relatedPairs = getRelatedPseoPairs(pair.slug, 6);

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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-1 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>
            {pair.fromFormat} &rarr; {pair.toFormat} Dedicated Engine
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
          {pair.h1}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {pair.subtitle}
        </p>

        {/* Accurate Trust Badges (No misleading claims) */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-card/80 border border-border text-[11px] font-semibold text-foreground shadow-xs">
            <Lock className="w-3 h-3 text-emerald-500" />
            100% Client-Side Private
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-card/80 border border-border text-[11px] font-semibold text-foreground shadow-xs">
            <ShieldCheck className="w-3 h-3 text-sky-500" />
            Zero Server Uploads
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-card/80 border border-border text-[11px] font-semibold text-foreground shadow-xs">
            <Zap className="w-3 h-3 text-amber-500" />
            Local Device Memory Processing
          </span>
        </div>
      </div>

      {/* ── 3. Embedded Converter (Above the fold) ── */}
      <section aria-label="Converter Widget" className="min-h-[380px]">
        <ConverterTemplate
          title={`${pair.fromFormat} to ${pair.toFormat} Converter`}
          description={`Convert ${pair.fromFormat} files directly into ${pair.toFormat} format.`}
          breadcrumbs={[]}
          accept={pair.accept}
          recommendedFormats={pair.recommendedFormats}
          moreFormats={pair.moreFormats}
          defaultTarget={pair.defaultTarget}
          category={pair.category === "data" || pair.category === "pdf" ? "document" : pair.category}
          onConvert={handleConvert}
        />
      </section>

      {/* ── 4. Key Benefits Cards ── */}
      <section className="space-y-4" aria-label="Why Use Switchr">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            Why Convert {pair.fromFormat} to {pair.toFormat} with Switchr?
          </h2>
          <p className="text-xs text-muted-foreground">
            Engineered from the ground up for maximum privacy, speed, and reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pair.benefits.map((b, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-card/60 backdrop-blur-md border border-border shadow-xs hover:border-primary/40 hover:bg-card/80 transition-all space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                0{idx + 1}
              </div>
              <h3 className="text-sm font-bold text-foreground">{b.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Step-by-Step How-To Guide ── */}
      <section className="space-y-4" aria-label="How to Convert">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            How to Convert {pair.fromFormat} to {pair.toFormat} in 3 Easy Steps
          </h2>
          <p className="text-xs text-muted-foreground">
            No software installation or account registration needed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pair.howTo.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-card/60 backdrop-blur-md border border-border shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Step {idx + 1}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground mb-1">{step.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. In-Depth Editorial Guide & Comparison Table (150-300 Words Unique Copy) ── */}
      <section className="space-y-6 pt-4 border-t border-border/80" aria-label="Format Technical Overview">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
            <Layers className="w-3.5 h-3.5" />
            <span>Format Technical Guide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            Understanding {pair.fromFormat} vs {pair.toFormat}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-card/50 border border-border/80 space-y-2">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              About {pair.fromFormat}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {pair.editorial.aboutFrom}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card/50 border border-border/80 space-y-2">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              About {pair.toFormat}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {pair.editorial.aboutTo}
            </p>
          </div>
        </div>

        {/* When to use which */}
        <div className="p-5 rounded-2xl bg-card/50 border border-border/80 space-y-2">
          <h3 className="text-sm font-bold text-foreground">
            When to Use {pair.fromFormat} vs {pair.toFormat}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {pair.editorial.whenToUse}
          </p>
        </div>

        {/* Quality & Compression Notes */}
        <div className="p-5 rounded-2xl bg-card/50 border border-border/80 space-y-2">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-500" />
            Quality &amp; Fidelity Retention Notes
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {pair.editorial.qualityNotes}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-border bg-card/40">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 border-b border-border text-[11px] font-bold text-foreground uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Feature / Specification</th>
                <th className="py-3 px-4">{pair.fromFormat}</th>
                <th className="py-3 px-4">{pair.toFormat}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {pair.editorial.comparisonTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-foreground">{row.feature}</td>
                  <td className="py-3 px-4 text-muted-foreground">{row.fromVal}</td>
                  <td className="py-3 px-4 text-primary font-medium">{row.toVal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 7. Rich FAQ Accordion ── */}
      <section className="space-y-4 max-w-3xl mx-auto" aria-label="Frequently Asked Questions">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {pair.faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card/60 backdrop-blur-md overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-primary" : ""
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
                      <div className="px-4 pb-4 pt-1 text-xs text-muted-foreground border-t border-border/40 leading-relaxed">
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

      {/* ── 8. Related Popular Converters Grid (SEO Cross-links) ── */}
      <section className="space-y-4 pt-4 border-t border-border/80" aria-label="Related Conversions">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-foreground">
            Related Conversions
          </h2>
          <Link
            href="/convert"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>All Converters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {relatedPairs.map((op) => (
            <Link
              key={op.slug}
              href={`/convert/${op.slug}`}
              className="p-3.5 rounded-2xl bg-card/60 backdrop-blur-md border border-border hover:border-primary/50 hover:bg-card transition-all text-center group block shadow-xs"
            >
              <span className="text-xs font-bold text-foreground block group-hover:text-primary transition-colors">
                {op.fromFormat} &rarr; {op.toFormat}
              </span>
              <span className="text-[10px] text-muted-foreground block mt-0.5">Free Online</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
