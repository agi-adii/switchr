import React from "react";

interface JsonLdProps {
  type?: "website" | "app" | "faq";
  faqs?: Array<{ question: string; answer: string }>;
}

export function JsonLd({ type = "website", faqs }: JsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchrx.vercel.app";

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Switchr",
    "alternateName": "Switchr Universal File Converter",
    "url": siteUrl,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All (Web Browser, Chrome, Safari, Firefox, Edge)",
    "description":
      "Free, privacy-first in-browser file converter and PDF suite. Convert images, videos, audio, documents, and archives 100% locally with WebAssembly and zero server uploads.",
    "browserRequirements": "Requires JavaScript. Requires HTML5 Canvas & WebAssembly.",
    "softwareVersion": "2.1.0",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
    },
    "featureList": [
      "100% Client-Side WebAssembly (WASM) Conversion",
      "Zero File Uploads - Private & Secure In-Browser Processing",
      "No Cloud Storage Limits (Capacity determined by device memory)",
      "Image Conversion: WebP, PNG, JPG, AVIF, HEIC, SVG",
      "Video & Audio Conversion: MP4, WebM, MP3, WAV, FLAC, OGG",
      "Comprehensive PDF Tools: Merge, Split, Compress, Convert",
      "Archive Tool: ZIP & TAR support",
      "Offline Capable Progressive Web App (PWA)",
    ],
    "creator": {
      "@type": "Organization",
      "name": "Switchr",
      "url": siteUrl,
      "logo": `${siteUrl}/logo.svg`,
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Switchr",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.svg`,
    "description": "Provider of client-side privacy-first web utilities and file transformation tools.",
    "sameAs": [
      "https://github.com/agi-adii/switchr",
    ],
  };

  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer,
      },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
