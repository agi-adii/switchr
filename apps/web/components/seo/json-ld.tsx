import React from "react";

interface JsonLdProps {
  type?: "website" | "app" | "faq";
}

export function JsonLd({ type = "website" }: JsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchr.app";

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Switchr",
    "alternateName": "Switchr Universal File Converter",
    "url": siteUrl,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All (Web Browser, Chrome, Safari, Firefox, Edge)",
    "description":
      "Free, lightning-fast in-browser file converter and PDF suite. Convert images, videos, audio, documents, and archives 100% locally with zero file size limits and complete privacy.",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "2.0.0",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
    },
    "featureList": [
      "100% Client-Side WebAssembly (WASM) Conversion",
      "Zero File Uploads - 100% Private & Secure",
      "No File Size Limits",
      "Image Conversion: WebP, PNG, JPG, AVIF, HEIC, SVG",
      "Video & Audio Conversion: MP4, WebM, MP3, WAV, FLAC, OGG",
      "Comprehensive PDF Tools: Merge, Split, Compress, Convert",
      "Archive Tool: ZIP & TAR support",
      "Offline Capable Progressive Web App (PWA)"
    ],
    "creator": {
      "@type": "Organization",
      "name": "Switchr",
      "url": siteUrl,
      "logo": `${siteUrl}/logo.jpg`,
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Switchr",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.jpg`,
    "description": "Provider of client-side privacy-first web utilities and file transformation tools.",
    "sameAs": [
      "https://github.com/switchr",
      "https://twitter.com/switchrapp"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is Switchr completely free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Switchr is 100% free with no hidden paywalls, no subscription fees, no ads, and no file size limits."
        }
      },
      {
        "@type": "Question",
        "name": "Are my files uploaded to a remote server?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Switchr processes all file conversions and manipulations locally on your device using WebAssembly (WASM) and modern Web APIs. Your files never leave your browser."
        }
      },
      {
        "@type": "Question",
        "name": "Which file formats does Switchr support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Switchr supports 100+ formats across images (PNG, JPG, WebP, AVIF, SVG, HEIC, GIF), video (MP4, WebM, MKV, AVI, MOV), audio (MP3, WAV, FLAC, AAC, OGG), documents (PDF, DOCX, TXT, Markdown), and archives (ZIP, TAR)."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use Switchr offline?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Switchr is engineered as an offline-first Progressive Web App (PWA). Once loaded, core image transformations and PDF tools work without an internet connection."
        }
      },
      {
        "@type": "Question",
        "name": "How does Switchr compare to other online converters?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Traditional converters upload your files to remote cloud servers, which is slow, consumes bandwidth, and poses privacy risks. Switchr processes everything in your browser instantly with zero wait times in cloud queues."
        }
      }
    ]
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
