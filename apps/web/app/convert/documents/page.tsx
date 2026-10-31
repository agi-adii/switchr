import { ToolJsonLd } from "@/components/seo/json-ld";
import { ToolSeoContent } from "@/components/seo/tool-seo-content";
"use client";

import { ConverterTemplate } from "@/components/converter-template";
import { textToPdf } from "@/lib/converters/pdf-tools";
import {
  presentationToPdf,
  presentationToDocx,
  docxToPdf,
  presentationToText,
  presentationToHtml,
} from "@/lib/converters/presentation-converter";


const DOCUMENT_HOW_TO_STEPS = [
  {
    name: "Upload Document File",
    text: "Select or drop your PowerPoint (PPTX, PPT), Word (DOCX, DOC), or plain text file into the converter box.",
  },
  {
    name: "Choose Target Document Format",
    text: "Select PDF for printing and formal submissions, DOCX for editable Word documents, or TXT/HTML for web rendering.",
  },
  {
    name: "Download Converted Document",
    text: "Click convert to parse OpenXML trees client-side and download your finished document immediately with zero data leaks.",
  },
];

const DOCUMENT_FAQS = [
  {
    question: "Can I convert PowerPoint presentations (PPTX and PPT) to PDF without Microsoft Office?",
    answer: "Yes! Switchr unpacks presentation slides and constructs high-resolution vector PDF pages directly inside your browser without needing PowerPoint or an Office 365 license.",
  },
  {
    question: "Can I extract presentation slides into an editable Word DOCX file?",
    answer: "Yes! Selecting DOCX as your target extracts slide titles, bullets, and speaker notes into structured Word headings and paragraphs.",
  },
  {
    question: "Are my confidential pitch decks, resumes, and legal contracts safe?",
    answer: "100% confidential. All parsing and document synthesis execute locally in your browser memory sandbox. Zero bytes ever leave your machine.",
  },
  {
    question: "Does the converted PDF maintain font formatting and page breaks?",
    answer: "Yes, our client-side document compiler paginates content according to standard A4/Letter dimensions with uniform margins.",
  },
  {
    question: "Is there any cost, subscription, or page limit?",
    answer: "No. Switchr is completely free with no limits, no watermarks, and no sign-ups required.",
  },
];

export default function DocumentConverterPage() {
  const handleConvert = async (
    file: File,
    toFormat: string,
    onProgress: (p: number) => void
  ) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const isPresentation = ext === "pptx" || ext === "ppt";
    const isDocx = ext === "docx";

    // ── 1. PowerPoint Presentations (PPTX & PPT) ──
    if (isPresentation) {
      if (toFormat === "pdf") {
        const pdfBlob = await presentationToPdf(file, {}, onProgress);
        return {
          url: URL.createObjectURL(pdfBlob),
          newSize: pdfBlob.size,
        };
      }

      if (toFormat === "docx") {
        const docxBlob = await presentationToDocx(file, onProgress);
        return {
          url: URL.createObjectURL(docxBlob),
          newSize: docxBlob.size,
        };
      }

      if (toFormat === "html") {
        onProgress(0.3);
        const html = await presentationToHtml(file);
        onProgress(1.0);
        const blob = new Blob([html], { type: "text/html" });
        return {
          url: URL.createObjectURL(blob),
          newSize: blob.size,
        };
      }

      // Default presentation fallback: plain text outline
      onProgress(0.3);
      const text = await presentationToText(file);
      onProgress(1.0);
      const blob = new Blob([text], { type: "text/plain" });
      return {
        url: URL.createObjectURL(blob),
        newSize: blob.size,
      };
    }

    // ── 2. Word Documents (DOCX) ──
    if (isDocx && toFormat === "pdf") {
      const pdfBlob = await docxToPdf(file, onProgress);
      return {
        url: URL.createObjectURL(pdfBlob),
        newSize: pdfBlob.size,
      };
    }

    // ── 3. Plain Text / HTML / Markdown Documents ──
    onProgress(0.3);
    const textContent = await file.text();
    onProgress(0.6);

    if (toFormat === "pdf") {
      const pdfBlob = await textToPdf(textContent, file.name);
      onProgress(1.0);
      return {
        url: URL.createObjectURL(pdfBlob),
        newSize: pdfBlob.size,
      };
    }

    if (toFormat === "html") {
      const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${file.name}</title></head>
<body style="font-family:system-ui;max-width:800px;margin:40px auto;line-height:1.6;padding:0 20px;">
<pre style="white-space:pre-wrap;font-family:inherit;">${textContent.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
</body>
</html>`;
      const blob = new Blob([html], { type: "text/html" });
      onProgress(1.0);
      return {
        url: URL.createObjectURL(blob),
        newSize: blob.size,
      };
    }

    // Fallback: plain text
    const blob = new Blob([textContent], { type: "text/plain" });
    onProgress(1.0);
    return {
      url: URL.createObjectURL(blob),
      newSize: blob.size,
    };
  };

  return (
    <>
      <ToolJsonLd
        name="Free Online Document Converter"
        description="Convert PowerPoint PPTX, Word DOCX, and text files to PDF, Word, and HTML directly in your browser with complete privacy."
        url="/convert/documents"
        category="BusinessApplication"
        features={[
          "Convert PPTX and legacy PPT to PDF and DOCX",
          "Convert Word DOCX to standardized PDF",
          "Plain text and notes to printable PDF",
          "100% In-Browser OpenXML parsing",
          "Zero document uploads to external cloud servers",
        ]}
        howTo={DOCUMENT_HOW_TO_STEPS}
        faqs={DOCUMENT_FAQS}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Convert", url: "/convert" },
          { name: "Documents", url: "/convert/documents" },
        ]}
      />

      <ConverterTemplate
        title="Document Converter"
        description="Convert presentations, Word documents, and text files to clean PDFs, DOCX, and formatted files."
        breadcrumbs={[{ label: "Convert", href: "/convert" }, { label: "Documents" }]}
        accept=".pptx,.ppt,.docx,.doc,.txt,.rtf,.html,.odt"
        recommendedFormats={["pdf", "docx", "txt", "html"]}
        defaultTarget="pdf"
        category="document"
        onConvert={handleConvert}
      />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
        <ToolSeoContent
          toolName="Switchr Document Converter"
          badge="100% In-Browser & Private"
          heading="Free Online Document Converter – PDF, DOCX, PPTX & TXT"
          subheading="Transform corporate presentations, resumes, and manuscripts without software dependencies or privacy risks."
          overviewParagraphs={[
            "Switchr's Document Converter bridges the gap between Microsoft Office formats and universal open standards. Convert PowerPoint presentations (PPTX and legacy PPT) into print-ready PDF decks, extract slide notes into editable Word documents, or turn Word files into locked PDFs for ATS job submissions and formal proposals.",
            "Because our OpenXML parser runs entirely inside your browser tab, sensitive commercial contracts, pitch decks, and personal resumes remain strictly on your machine. Enjoy instant processing, zero cloud queues, and complete peace of mind.",
          ]}
          steps={DOCUMENT_HOW_TO_STEPS}
          faqs={DOCUMENT_FAQS}
          relatedLinks={[
            { label: "Convert PPTX to PDF", href: "/convert/pptx-to-pdf", desc: "Turn PowerPoint slides into printable PDFs.", badge: "Popular" },
            { label: "Convert DOCX to PDF", href: "/convert/docx-to-pdf", desc: "Lock in Word formatting for job applications.", badge: "Top" },
            { label: "Convert PPTX to DOCX", href: "/convert/pptx-to-docx", desc: "Extract slide notes into study guides." },
            { label: "Convert Text to PDF", href: "/convert/text-to-pdf", desc: "Paginate plain text into clean PDF pages." },
            { label: "PDF Tools Suite", href: "/pdf-tools", desc: "Merge, split, protect, and extract PDF pages." },
            { label: "Smart File Compressor", href: "/compress", desc: "Shrink heavy PDF documents for email." },
          ]}
        />
      </div>
    </>
  );
}
