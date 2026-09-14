import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  PSEO_PAIRS,
  getPseoPairBySlug,
  getAllPseoSlugs,
} from "@/lib/pseo-registry";
import { PseoConverterClient } from "@/components/pseo/pseo-converter-client";

interface PageProps {
  params: Promise<{ pair: string }>;
}

export function generateStaticParams() {
  return getAllPseoSlugs().map((slug) => ({
    pair: slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { pair } = await params;
  const config = getPseoPairBySlug(pair);

  if (!config) {
    return {
      title: "File Converter | Switchr",
      description: "Convert files online for free directly in your browser with complete privacy.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchrx.vercel.app";
  const canonicalUrl = `${siteUrl}/convert/${config.slug}`;

  return {
    title: config.title,
    description: config.metaDescription,
    keywords: [
      `convert ${config.fromFormat.toLowerCase()} to ${config.toFormat.toLowerCase()}`,
      `${config.fromFormat.toLowerCase()} to ${config.toFormat.toLowerCase()} converter`,
      `free ${config.fromFormat.toLowerCase()} to ${config.toFormat.toLowerCase()} online`,
      `offline ${config.fromFormat.toLowerCase()} to ${config.toFormat.toLowerCase()}`,
      "switchr",
      "switchrx",
      "client side file converter",
      "private file converter",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: config.title,
      description: config.metaDescription,
      url: canonicalUrl,
      siteName: "Switchr",
      type: "website",
      images: [
        {
          url: "/logo.jpg",
          width: 512,
          height: 512,
          alt: config.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.metaDescription,
      images: ["/logo.jpg"],
      creator: "@switchrapp",
    },
  };
}

export default async function PseoConverterPage({ params }: PageProps) {
  const { pair } = await params;
  const config = getPseoPairBySlug(pair);

  if (!config) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchrx.vercel.app";
  const pageUrl = `${siteUrl}/convert/${config.slug}`;

  // Structured Data 1: WebApplication Schema
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${config.fromFormat} to ${config.toFormat} Converter - Switchr`,
    "url": pageUrl,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All (Web Browser, Chrome, Safari, Edge, Firefox)",
    "description": config.metaDescription,
    "browserRequirements": "Requires JavaScript. HTML5 Canvas & WebAssembly support.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
    },
    "featureList": [
      "100% Client-Side In-Browser Conversion",
      "Zero File Uploads to Cloud Servers",
      "No File Size Limits",
      "Lossless Quality Retention",
      "Offline Capable Progressive Web App",
    ],
  };

  // Structured Data 2: HowTo Schema (Google Rich Snippets)
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Convert ${config.fromFormat} to ${config.toFormat} Online Free`,
    "description": config.subtitle,
    "totalTime": "PT10S",
    "step": config.howTo.map((step, idx) => ({
      "@type": "HowToStep",
      "position": idx + 1,
      "name": step.name,
      "text": step.text,
      "url": `${pageUrl}#step-${idx + 1}`,
    })),
  };

  // Structured Data 3: FAQPage Schema (Google Rich Snippet Accordions)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": config.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <>
      {/* Search Engine Rich Snippet JSON-LD Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Main Interactive Converter Experience */}
      <PseoConverterClient pair={config} />
    </>
  );
}
