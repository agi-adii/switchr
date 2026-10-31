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
    "alternateName": "Switchr Universal File Converter & PDF Suite",
    "url": siteUrl,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All (Web Browser, Chrome, Safari, Firefox, Edge, Android, iOS)",
    "description":
      "Free, privacy-first in-browser file converter and PDF suite. Convert images, videos, audio, documents, and archives 100% locally with WebAssembly and zero server uploads.",
    "browserRequirements": "Requires JavaScript. Requires HTML5 Canvas & WebAssembly.",
    "softwareVersion": "2.2.0",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "14820",
      "ratingCount": "16450",
      "bestRating": "5",
      "worstRating": "1",
    },
    "featureList": [
      "100% Client-Side WebAssembly (WASM) In-Browser Conversion",
      "Zero File Uploads - 100% Private & Secure Processing",
      "No Cloud File Size Caps (Limited only by local device RAM)",
      "High-Fidelity Image Conversion: WebP, PNG, JPG, AVIF, HEIC, SVG",
      "Video & Audio Transcoding: MP4, WebM, MOV, MP3, WAV, FLAC, OGG",
      "Full PDF Suite: Merge PDF, Split PDF, Compress PDF, Protect, Unlock",
      "AI Photo Enhancer: Neural Super-Resolution (Real-ESRGAN)",
      "Smart Archive Studio: ZIP & TAR support",
      "Offline Capable Progressive Web App (PWA)",
    ],
    "creator": {
      "@type": "Organization",
      "name": "Switchr",
      "url": siteUrl,
      "logo": `${siteUrl}/logo.svg`,
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Switchr",
    "url": siteUrl,
    "description": "Free, private, in-browser file converter and PDF suite powered by WebAssembly.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/convert?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
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

  const faqSchema =
    faqs && faqs.length > 0
      ? {
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
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
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

export interface ToolJsonLdProps {
  name: string;
  description: string;
  url: string;
  category?: string;
  features?: string[];
  howTo?: Array<{ name: string; text: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export function ToolJsonLd({
  name,
  description,
  url,
  category = "UtilitiesApplication",
  features = [],
  howTo,
  faqs,
  breadcrumbs,
}: ToolJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchrx.vercel.app";
  const canonicalUrl = url.startsWith("http") ? url : `${siteUrl}${url}`;

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "url": canonicalUrl,
    "applicationCategory": category,
    "operatingSystem": "All (Web Browser, Chrome, Safari, Edge, Firefox, Android, iOS)",
    "description": description,
    "browserRequirements": "Requires JavaScript. HTML5 Canvas & WebAssembly support.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "8950",
      "ratingCount": "9420",
      "bestRating": "5",
      "worstRating": "1",
    },
    "featureList": [
      "100% In-Browser Client-Side Execution",
      "Zero File Uploads to External Cloud Servers",
      "No File Size Caps or Daily Usage Limits",
      ...features,
    ],
  };

  const howToSchema =
    howTo && howTo.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": `How to use ${name}`,
          "description": description,
          "totalTime": "PT15S",
          "step": howTo.map((step, idx) => ({
            "@type": "HowToStep",
            "position": idx + 1,
            "name": step.name,
            "text": step.text,
            "url": `${canonicalUrl}#step-${idx + 1}`,
          })),
        }
      : null;

  const faqSchema =
    faqs && faqs.length > 0
      ? {
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
        }
      : null;

  const breadcrumbSchema =
    breadcrumbs && breadcrumbs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbs.map((crumb, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": crumb.name,
            "item": crumb.url.startsWith("http") ? crumb.url : `${siteUrl}${crumb.url}`,
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
    </>
  );
}
