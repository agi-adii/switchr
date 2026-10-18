"use client";

import { ConverterTemplate } from "@/components/converter-template";
import JSZip from "jszip";
import { textToPdf } from "@/lib/converters/pdf-tools";

export default function EbooksConverterPage() {
  const handleConvert = async (
    file: File,
    toFormat: string,
    onProgress: (p: number) => void
  ) => {
    onProgress(0.2);
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    if (ext === "epub") {
      const zip = new JSZip();
      const loaded = await zip.loadAsync(file);
      onProgress(0.5);

      const htmlFiles = Object.keys(loaded.files)
        .filter((name) => /\.(x?html|xml)$/i.test(name) && !name.includes("toc"))
        .sort();

      let fullText = "";
      let fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${file.name}</title></head><body>`;

      for (const name of htmlFiles) {
        const content = await loaded.files[name].async("text");
        fullHtml += `<div class="chapter">${content}</div><hr/>`;
        // Strip XML/HTML tags for text
        const plain = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
        fullText += plain + "\n\n";
      }
      fullHtml += `</body></html>`;
      onProgress(0.8);

      if (toFormat === "pdf") {
        const pdfBlob = await textToPdf(fullText, file.name);
        onProgress(1.0);
        return {
          url: URL.createObjectURL(pdfBlob),
          newSize: pdfBlob.size,
        };
      }

      if (toFormat === "html") {
        const blob = new Blob([fullHtml], { type: "text/html" });
        onProgress(1.0);
        return {
          url: URL.createObjectURL(blob),
          newSize: blob.size,
        };
      }

      // Default: txt
      const blob = new Blob([fullText], { type: "text/plain" });
      onProgress(1.0);
      return {
        url: URL.createObjectURL(blob),
        newSize: blob.size,
      };
    }

    // Fallback for text/markdown-like books
    const text = await file.text();
    onProgress(0.8);
    const blob = new Blob([text], { type: "text/plain" });
    onProgress(1.0);
    return {
      url: URL.createObjectURL(blob),
      newSize: blob.size,
    };
  };

  return (
    <ConverterTemplate
      title="E-Book Converter"
      description="Convert EPUB e-books directly into clean TXT, HTML, or PDF documents right in your browser."
      breadcrumbs={[{ label: "Convert", href: "/convert" }, { label: "E-Books" }]}
      accept=".epub,.txt,.fb2"
      recommendedFormats={["pdf", "txt", "html"]}
      defaultTarget="pdf"
      category="document"
      onConvert={handleConvert}
    />
  );
}
