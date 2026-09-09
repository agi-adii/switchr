import jsPDF from "jspdf";

export interface ImagesToPdfOptions {
  orientation?: "portrait" | "landscape" | "auto";
  margin?: number;
  quality?: number;
}

export async function imagesToPdf(
  files: File[],
  options: ImagesToPdfOptions = {},
  onProgress?: (p: number) => void
): Promise<Blob> {
  if (files.length === 0) throw new Error("No images provided for PDF generation");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = options.margin ?? 10;
  const availWidth = pageWidth - margin * 2;
  const availHeight = pageHeight - margin * 2;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (i > 0) pdf.addPage();

    await new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let orientation = options.orientation;
          if (!orientation || orientation === "auto") {
            orientation = img.naturalWidth > img.naturalHeight ? "landscape" : "portrait";
          }

          // Compute aspect ratio fitting
          const imgRatio = img.naturalWidth / img.naturalHeight;
          let renderWidth = availWidth;
          let renderHeight = availWidth / imgRatio;

          if (renderHeight > availHeight) {
            renderHeight = availHeight;
            renderWidth = availHeight * imgRatio;
          }

          const x = margin + (availWidth - renderWidth) / 2;
          const y = margin + (availHeight - renderHeight) / 2;

          const ext = file.name.split(".").pop()?.toUpperCase() || "JPEG";
          const format = ext === "PNG" ? "PNG" : ext === "WEBP" ? "WEBP" : "JPEG";

          pdf.addImage(img, format, x, y, renderWidth, renderHeight);
          if (onProgress) onProgress((i + 1) / files.length);
          resolve();
        };

        img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
      reader.readAsDataURL(file);
    });
  }

  return pdf.output("blob");
}

export async function textToPdf(text: string, title = "Document"): Promise<Blob> {
  const pdf = new jsPDF({
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text(title, margin, 20);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  const lines = pdf.splitTextToSize(text, maxWidth);
  let y = 30;
  const lineHeight = 5.5;

  for (let i = 0; i < lines.length; i++) {
    if (y > 280) {
      pdf.addPage();
      y = 20;
    }
    pdf.text(lines[i], margin, y);
    y += lineHeight;
  }

  return pdf.output("blob");
}
