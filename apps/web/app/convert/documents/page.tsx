"use client";

import { ConverterTemplate } from "@/components/converter-template";
import { textToPdf } from "@/lib/converters/pdf-tools";

export default function DocumentConverterPage() {
  const handleConvert = async (
    file: File,
    toFormat: string,
    onProgress: (p: number) => void
  ) => {
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
      description="Convert documents and plain text files to clean, printable PDFs and formatted files."
      breadcrumbs={[{ label: "Convert", href: "/convert" }, { label: "Documents" }]}
      accept=".docx,.doc,.txt,.rtf,.html,.odt"
      recommendedFormats={["pdf", "txt", "html"]}
      defaultTarget="pdf"
      category="document"
      onConvert={handleConvert}
    />
  );
}
