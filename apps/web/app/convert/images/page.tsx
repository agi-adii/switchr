import { ToolJsonLd } from "@/components/seo/json-ld";
import { ToolSeoContent } from "@/components/seo/tool-seo-content";
"use client";

import { useState } from "react";
import { ConverterTemplate } from "@/components/converter-template";
import { convertImage } from "@/lib/converters/image-converter";
import { imagesToPdf } from "@/lib/converters/pdf-tools";
import { Sliders, Sparkles } from "lucide-react";


const IMAGE_HOW_TO_STEPS = [
  {
    name: "Upload Image Files",
    text: "Drag and drop single or multiple JPG, PNG, WebP, AVIF, SVG, or Apple HEIC photos into the converter box.",
  },
  {
    name: "Choose Target Format & Quality",
    text: "Select your desired export format (WebP, PNG, JPG, or PDF) and calibrate quality or resize dimensions in Advanced Options.",
  },
  {
    name: "Download Converted Images",
    text: "Click convert to process images locally via HTML5 Canvas and download your converted files immediately.",
  },
];

const IMAGE_FAQS = [
  {
    question: "Can I convert Apple iPhone HEIC photos to JPG or PNG on Windows?",
    answer: "Yes! Switchr includes a built-in WebAssembly HEIC decoder that converts Apple iPhone and iPad photos directly in your browser without requiring paid Windows HEVC extensions.",
  },
  {
    question: "Does converting PNG to WebP preserve transparent backgrounds?",
    answer: "Yes. WebP fully supports 8-bit alpha channel transparency just like PNG, while reducing image file size by up to 80%.",
  },
  {
    question: "Are my personal pictures uploaded to any external server?",
    answer: "Never. All image decoding and re-encoding run 100% locally inside your browser memory sandbox. Zero image data is ever transmitted across the internet.",
  },
  {
    question: "Can I convert multiple images into a single PDF document?",
    answer: "Yes! Simply select PDF as your target format, and Switchr compiles your photos into a consolidated multi-page PDF document.",
  },
  {
    question: "What is the maximum file size limit for image conversion?",
    answer: "There are no arbitrary file caps or daily conversion limits. Processing capacity depends solely on your computer or phone's available RAM.",
  },
];

export default function ImageConverterPage() {
  const [quality, setQuality] = useState(85);
  const [resizeWidth, setResizeWidth] = useState<string>("");
  const [resizeHeight, setResizeHeight] = useState<string>("");

  const handleConvert = async (
    file: File,
    toFormat: string,
    onProgress: (p: number) => void
  ) => {
    if (toFormat === "pdf") {
      const pdfBlob = await imagesToPdf([file], {}, onProgress);
      return {
        url: URL.createObjectURL(pdfBlob),
        newSize: pdfBlob.size,
      };
    }

    const res = await convertImage(
      file,
      {
        toFormat,
        quality: quality / 100,
        width: resizeWidth ? Number(resizeWidth) : undefined,
        height: resizeHeight ? Number(resizeHeight) : undefined,
        maintainAspectRatio: true,
      },
      onProgress
    );

    return {
      url: res.url,
      newSize: res.newSize,
    };
  };

  const advancedOptions = (
    <div className="space-y-4 p-4 rounded-2xl bg-muted/40 border border-border text-xs">
      <div className="space-y-2">
        <div className="flex justify-between font-semibold">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Sliders className="w-3.5 h-3.5" /> Quality Setting:
          </span>
          <span className="font-mono text-primary">{quality}%</span>
        </div>
        <input
          type="range"
          min="20"
          max="100"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>High Compression</span>
          <span>Balanced</span>
          <span>Maximum Quality</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
        <div>
          <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
            Resize Width (px)
          </label>
          <input
            type="number"
            placeholder="Auto"
            value={resizeWidth}
            onChange={(e) => setResizeWidth(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs font-mono"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
            Resize Height (px)
          </label>
          <input
            type="number"
            placeholder="Auto"
            value={resizeHeight}
            onChange={(e) => setResizeHeight(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs font-mono"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-1 text-[11px]">
        <span className="text-muted-foreground">Looking to fix blurry, dark, or dull photos?</span>
        <a
          href="/tools/enhance"
          className="text-violet-500 font-bold hover:underline flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
          AI Photo Enhancer &rarr;
        </a>
      </div>
    </div>
  );

  return (
    <>
      <ToolJsonLd
        name="Free Online Image Converter"
        description="Convert JPG, PNG, WebP, AVIF, SVG, and iPhone HEIC photos directly in your browser with 100% privacy and zero uploads."
        url="/convert/images"
        category="MultimediaApplication"
        features={[
          "WebP, PNG, JPG, AVIF, HEIC, and SVG format support",
          "Alpha channel transparency preservation",
          "Custom quality and dimension resizing controls",
          "Compile images to multi-page PDF",
          "100% In-Browser client-side processing",
          "Zero file uploads to external servers",
        ]}
        howTo={IMAGE_HOW_TO_STEPS}
        faqs={IMAGE_FAQS}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Convert", url: "/convert" },
          { name: "Images", url: "/convert/images" },
        ]}
      />

      <ConverterTemplate
        title="Image Converter"
        description="Convert JPG, PNG, WEBP, and Apple HEIC photos directly to PDF, JPG, or modern web formats."
        breadcrumbs={[{ label: "Convert", href: "/convert" }, { label: "Images" }]}
        accept="image/*,.heic,.heif"
        recommendedFormats={["pdf", "webp", "png", "jpg"]}
        moreFormats={["bmp", "gif"]}
        defaultTarget="webp"
        category="image"
        advancedOptionsNode={advancedOptions}
        onConvert={handleConvert}
      />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
        <ToolSeoContent
          toolName="Switchr Image Converter"
          badge="100% In-Browser & Private"
          heading="Free Online Image Converter – WebP, PNG, JPG, HEIC & AVIF"
          subheading="Fast format transformation running entirely inside your browser. No server queues, zero file caps, and complete image confidentiality."
          overviewParagraphs={[
            "Switchr's Image Converter makes image format transformation instantaneous, secure, and private. Whether you need to convert Apple iPhone HEIC photos to universal JPG format for Windows, compress heavy PNGs into modern WebP for website speed, or turn vector SVGs into crisp PNGs, our client-side engine executes every pixel calculation in your local browser sandbox.",
            "Traditional converters force you to upload personal family memories or confidential designs to remote cloud storage. Switchr ensures zero bytes ever leave your device, giving you infinite conversion capacity with zero watermarks and no registration required.",
          ]}
          steps={IMAGE_HOW_TO_STEPS}
          faqs={IMAGE_FAQS}
          relatedLinks={[
            { label: "Convert WebP to PNG", href: "/convert/webp-to-png", desc: "Turn WebP into lossless PNG with transparency.", badge: "Popular" },
            { label: "Convert HEIC to JPG", href: "/convert/heic-to-jpg", desc: "Convert iPhone camera photos for universal viewing.", badge: "Top" },
            { label: "Convert PNG to WebP", href: "/convert/png-to-webp", desc: "Reduce file sizes by up to 80% for websites." },
            { label: "Convert JPG to WebP", href: "/convert/jpg-to-webp", desc: "Modernize JPEG photos for Google PageSpeed." },
            { label: "AI Photo Enhancer", href: "/tools/enhance", desc: "Upscale resolution to 4K with Real-ESRGAN.", badge: "AI" },
            { label: "Smart File Compressor", href: "/compress", desc: "Shrink image and PDF weights by up to 80%." },
          ]}
        />
      </div>
    </>
  );
}
