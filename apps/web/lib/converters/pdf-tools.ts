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

    const rawExt = file.name.split(".").pop()?.toLowerCase() || "";
    const isHeic = rawExt === "heic" || rawExt === "heif" || file.type === "image/heic" || file.type === "image/heif";

    let imageBlob: Blob = file;
    if (isHeic) {
      if (onProgress) onProgress((i + 0.3) / files.length);
      try {
        const heic2anyModule = await import("heic2any");
        const heic2any = heic2anyModule.default || heic2anyModule;
        const converted = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: options.quality ?? 0.92,
        });
        imageBlob = Array.isArray(converted) ? converted[0] : converted;
      } catch (heicErr) {
        console.error("HEIC decoding error:", heicErr);
        throw new Error(`Failed to decode HEIC file "${file.name}". Please ensure it is a valid HEIC/HEIF photo.`);
      }
    }

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

          const ext = isHeic ? "JPEG" : (file.name.split(".").pop()?.toUpperCase() || "JPEG");
          const format = ext === "PNG" ? "PNG" : ext === "WEBP" ? "WEBP" : "JPEG";

          pdf.addImage(img, format, x, y, renderWidth, renderHeight);
          if (onProgress) onProgress((i + 1) / files.length);
          resolve();
        };

        img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
      reader.readAsDataURL(imageBlob);
    });
  }

  return pdf.output("blob");
}

export async function heicToPdf(
  file: File,
  options: ImagesToPdfOptions = {},
  onProgress?: (p: number) => void
): Promise<Blob> {
  return imagesToPdf([file], options, onProgress);
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

export interface PdfToImageOptions {
  format?: "png" | "jpeg" | "webp";
  quality?: number; // 0.1 to 1.0 (applies to jpeg/webp)
  scale?: number; // 1.0 = standard, 1.5 = HD, 2.0 = Ultra HD / 300 DPI
  pageNumbers?: number[]; // Optional list of 1-indexed page numbers to convert
}

export interface ConvertedPdfPage {
  pageNumber: number;
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
}

export interface PdfMetadata {
  pageCount: number;
  firstPageWidth: number;
  firstPageHeight: number;
}

export async function getPdfJs() {
  if (typeof window === "undefined") {
    throw new Error("PDF processing is only supported in browser environments.");
  }
  const pdfjs = await import("pdfjs-dist");
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
  }
  return pdfjs;
}

export async function getPdfMetadata(file: File): Promise<PdfMetadata> {
  const pdfjs = await getPdfJs();
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
  const doc = await loadingTask.promise;
  const firstPage = await doc.getPage(1);
  const viewport = firstPage.getViewport({ scale: 1.0 });

  return {
    pageCount: doc.numPages,
    firstPageWidth: Math.round(viewport.width),
    firstPageHeight: Math.round(viewport.height),
  };
}

export async function pdfToImages(
  file: File,
  options: PdfToImageOptions = {},
  onProgress?: (progress: number, currentPage: number, totalPages: number) => void
): Promise<ConvertedPdfPage[]> {
  const { format = "png", quality = 0.92, scale = 1.5, pageNumbers } = options;
  const pdfjs = await getPdfJs();
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;

  const targetPages =
    pageNumbers && pageNumbers.length > 0
      ? pageNumbers.filter((p) => p >= 1 && p <= totalPages)
      : Array.from({ length: totalPages }, (_, i) => i + 1);

  const results: ConvertedPdfPage[] = [];
  const mimeType = format === "png" ? "image/png" : format === "webp" ? "image/webp" : "image/jpeg";

  for (let i = 0; i < targetPages.length; i++) {
    const pageNum = targetPages[i];
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not initialize 2D canvas context for PDF rendering");

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    // Render with white background so transparent PDFs don't look black in JPEG
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error(`Failed to convert page ${pageNum} to image blob`));
        },
        mimeType,
        quality
      );
    });

    const dataUrl = canvas.toDataURL(mimeType, quality);

    results.push({
      pageNumber: pageNum,
      blob,
      dataUrl,
      width: canvas.width,
      height: canvas.height,
    });

    if (onProgress) {
      onProgress((i + 1) / targetPages.length, i + 1, targetPages.length);
    }
  }

  return results;
}

export async function createImagesZip(
  pages: ConvertedPdfPage[],
  baseName = "document",
  format: "png" | "jpeg" | "webp" = "png"
): Promise<Blob> {
  const JSZipModule = await import("jszip");
  const JSZip = JSZipModule.default || JSZipModule;
  const zip = new JSZip();
  const ext = format === "jpeg" ? "jpg" : format;
  const cleanName = baseName.replace(/\.[^/.]+$/, "");

  pages.forEach((page) => {
    const filename = `${cleanName}-page-${page.pageNumber}.${ext}`;
    zip.file(filename, page.blob);
  });

  return await zip.generateAsync({ type: "blob" });
}

export interface ProtectPdfOptions {
  userPassword: string;
  ownerPassword?: string;
  permissions?: {
    print?: boolean;
    copy?: boolean;
    modify?: boolean;
    annotForms?: boolean;
  };
}

export interface PdfSecurityInfo {
  isEncrypted: boolean;
  requiresPassword: boolean;
  numPages?: number;
}

export async function checkIsPdfEncrypted(file: File): Promise<PdfSecurityInfo> {
  const buffer = await file.arrayBuffer();
  const pdfjs = await getPdfJs();

  try {
    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
    const doc = await loadingTask.promise;
    return {
      isEncrypted: false,
      requiresPassword: false,
      numPages: doc.numPages,
    };
  } catch (err: any) {
    if (
      err?.name === "PasswordException" ||
      err?.code === 1 ||
      (err?.message && err.message.toLowerCase().includes("password"))
    ) {
      return {
        isEncrypted: true,
        requiresPassword: true,
      };
    }
    // Try pdf-lib as fallback check
    try {
      const { PDFDocument } = await import("pdf-lib");
      await PDFDocument.load(buffer);
      return { isEncrypted: false, requiresPassword: false };
    } catch (pdfLibErr: any) {
      if (pdfLibErr?.message?.toLowerCase().includes("encrypted")) {
        return { isEncrypted: true, requiresPassword: true };
      }
      throw err;
    }
  }
}

export async function protectPdf(
  file: File,
  options: ProtectPdfOptions,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const userPassword = options.userPassword.trim();
  if (!userPassword) {
    throw new Error("Please enter a password to protect the PDF.");
  }

  const ownerPassword = options.ownerPassword?.trim() || userPassword;
  const permissionsList: ("print" | "copy" | "modify" | "annot-forms")[] = [];
  if (options.permissions?.print !== false) permissionsList.push("print");
  if (options.permissions?.copy !== false) permissionsList.push("copy");
  if (options.permissions?.modify) permissionsList.push("modify");
  if (options.permissions?.annotForms) permissionsList.push("annot-forms");

  if (onProgress) onProgress(0.1);

  // Render pages using pdfjs-dist and rebuild encrypted PDF using jsPDF
  const pdfjs = await getPdfJs();
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;

  if (onProgress) onProgress(0.2);

  let pdf: jsPDF | null = null;

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const unscaledViewport = page.getViewport({ scale: 1.0 });
    const ptWidth = unscaledViewport.width;
    const ptHeight = unscaledViewport.height;
    const orientation: "l" | "p" = ptWidth > ptHeight ? "l" : "p";

    const viewport = page.getViewport({ scale: 2.0 }); // High-DPI render (300 DPI)

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context initialization failed");

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    const imgData = canvas.toDataURL("image/jpeg", 0.92);

    if (i === 1) {
      pdf = new jsPDF({
        orientation,
        unit: "pt",
        format: [ptWidth, ptHeight],
        encryption: {
          userPassword,
          ownerPassword,
          userPermissions: permissionsList,
        },
      });
      pdf.addImage(imgData, "JPEG", 0, 0, ptWidth, ptHeight);
    } else if (pdf) {
      pdf.addPage([ptWidth, ptHeight], orientation);
      pdf.addImage(imgData, "JPEG", 0, 0, ptWidth, ptHeight);
    }

    // Release canvas memory
    canvas.width = 0;
    canvas.height = 0;

    if (onProgress) onProgress(0.2 + (0.7 * i) / totalPages);
  }

  if (!pdf) throw new Error("Failed to process PDF pages for protection.");

  if (onProgress) onProgress(1.0);
  return pdf.output("blob");
}

export async function unlockPdf(
  file: File,
  password?: string,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const buffer = await file.arrayBuffer();
  if (onProgress) onProgress(0.1);

  // Method 1: If the document is NOT encrypted, use lossless direct page copying with pdf-lib.
  // (Note: pdf-lib does NOT decrypt encrypted streams. We must NEVER copy pages if isEncrypted is true!)
  try {
    const { PDFDocument } = await import("pdf-lib");
    const loadedDoc = await PDFDocument.load(buffer);

    if (!loadedDoc.isEncrypted) {
      if (onProgress) onProgress(0.5);
      const unlockedDoc = await PDFDocument.create();
      const copiedPages = await unlockedDoc.copyPages(loadedDoc, loadedDoc.getPageIndices());
      copiedPages.forEach((p) => unlockedDoc.addPage(p));

      if (onProgress) onProgress(0.9);
      const pdfBytes = await unlockedDoc.save();
      if (onProgress) onProgress(1.0);

      return new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
    }
  } catch {
    // Document is encrypted or restricted; fall through to pdfjs decryption engine
  }

  // Method 2: Decrypt with pdfjs-dist and rebuild a high-resolution, unencrypted PDF
  const pdfjs = await getPdfJs();
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(buffer),
    password: password || "",
  });

  let pdfDoc;
  try {
    pdfDoc = await loadingTask.promise;
  } catch (err: any) {
    if (
      err?.name === "PasswordException" ||
      err?.code === 1 ||
      err?.code === 2 ||
      (err?.message && err.message.toLowerCase().includes("password"))
    ) {
      if (!password) {
        throw new Error("This PDF is password-protected. Please enter the password to unlock it.");
      } else {
        throw new Error("Incorrect password. Please verify your password and try again.");
      }
    }
    throw err;
  }

  const totalPages = pdfDoc.numPages;
  if (totalPages === 0) {
    throw new Error("The decrypted PDF document contains no pages.");
  }

  let pdf: jsPDF | null = null;

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const unscaledViewport = page.getViewport({ scale: 1.0 });
    const ptWidth = unscaledViewport.width;
    const ptHeight = unscaledViewport.height;
    const orientation: "l" | "p" = ptWidth > ptHeight ? "l" : "p";

    // 2.0x scale ensures crisp 144-150 DPI render for text and vector clarity
    const renderScale = 2.0;
    const renderViewport = page.getViewport({ scale: renderScale });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context initialization failed");

    canvas.width = Math.floor(renderViewport.width);
    canvas.height = Math.floor(renderViewport.height);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport: renderViewport,
    }).promise;

    const imgData = canvas.toDataURL("image/jpeg", 0.92);

    if (i === 1) {
      pdf = new jsPDF({
        orientation,
        unit: "pt",
        format: [ptWidth, ptHeight],
      });
      pdf.addImage(imgData, "JPEG", 0, 0, ptWidth, ptHeight);
    } else if (pdf) {
      pdf.addPage([ptWidth, ptHeight], orientation);
      pdf.addImage(imgData, "JPEG", 0, 0, ptWidth, ptHeight);
    }

    // Free canvas backing buffer to prevent memory leaks on large multi-page PDFs
    canvas.width = 0;
    canvas.height = 0;

    if (onProgress) onProgress(0.1 + (0.85 * i) / totalPages);
  }

  if (!pdf) throw new Error("Could not unlock or render PDF pages.");

  if (onProgress) onProgress(1.0);
  return pdf.output("blob");
}


