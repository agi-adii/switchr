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
  );
}
