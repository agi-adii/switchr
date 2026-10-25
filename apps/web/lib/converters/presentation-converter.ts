import jsPDF from "jspdf";
import JSZip from "jszip";
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
  ImageRun,
  AlignmentType,
  BorderStyle,
} from "docx";

export interface PresentationSlide {
  slideNumber: number;
  title: string;
  subtitles: string[];
  bulletPoints: string[];
  bodyParagraphs: string[];
  notes?: string;
  images: Array<{
    name: string;
    dataUrl: string;
    mimeType: string;
    uint8Array?: Uint8Array;
    width?: number;
    height?: number;
  }>;
}

export interface ParsedPresentation {
  title: string;
  slideCount: number;
  slides: PresentationSlide[];
  widthMm: number;
  heightMm: number;
  orientation: "landscape" | "portrait";
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. PPTX OpenXML Parsing
// ─────────────────────────────────────────────────────────────────────────────

export async function parsePptx(file: File): Promise<ParsedPresentation> {
  const zip = await JSZip.loadAsync(file);
  const domParser = new DOMParser();

  // 1. Determine presentation dimensions from ppt/presentation.xml
  let widthMm = 297; // Default 16:9 landscape widescreen width (approx A4 landscape)
  let heightMm = 167;
  let orientation: "landscape" | "portrait" = "landscape";

  const presXmlFile = zip.file("ppt/presentation.xml");
  if (presXmlFile) {
    try {
      const presXml = await presXmlFile.async("text");
      const presDoc = domParser.parseFromString(presXml, "text/xml");
      const sldSz = presDoc.getElementsByTagName("p:sldSz")[0];
      if (sldSz) {
        const cx = parseInt(sldSz.getAttribute("cx") || "9144000", 10);
        const cy = parseInt(sldSz.getAttribute("cy") || "5143500", 10);
        // 1 inch = 914400 EMUs, 1 mm = 36000 EMUs
        widthMm = Math.round(cx / 36000);
        heightMm = Math.round(cy / 36000);
        orientation = widthMm >= heightMm ? "landscape" : "portrait";
      }
    } catch (e) {
      console.warn("Could not parse presentation.xml dimensions:", e);
    }
  }

  // 2. Discover slides in order
  const slideFileRegex = /^ppt\/slides\/slide(\d+)\.xml$/i;
  const discoveredSlideFiles = Object.keys(zip.files).filter((path) =>
    slideFileRegex.test(path)
  );

  // Sort discovered slides numerically (slide1, slide2, ..., slide10)
  discoveredSlideFiles.sort((a, b) => {
    const numA = parseInt(a.match(slideFileRegex)?.[1] || "0", 10);
    const numB = parseInt(b.match(slideFileRegex)?.[1] || "0", 10);
    return numA - numB;
  });

  const slidePaths = discoveredSlideFiles;
  const slides: PresentationSlide[] = [];

  for (let sIdx = 0; sIdx < slidePaths.length; sIdx++) {
    const slidePath = slidePaths[sIdx];
    const slideFile = zip.file(slidePath);
    if (!slideFile) continue;

    const slideNumber = sIdx + 1;
    const slideXmlText = await slideFile.async("text");
    const slideDoc = domParser.parseFromString(slideXmlText, "text/xml");

    let slideTitle = "";
    const subtitles: string[] = [];
    const bulletPoints: string[] = [];
    const bodyParagraphs: string[] = [];

    // Parse slide image relationships (ppt/slides/_rels/slideX.xml.rels)
    const slideRelPath = slidePath.replace("ppt/slides/", "ppt/slides/_rels/") + ".rels";
    const slideRelsFile = zip.file(slideRelPath);
    const imageTargetMap: Record<string, string> = {};

    if (slideRelsFile) {
      try {
        const sRelsXml = await slideRelsFile.async("text");
        const sRelsDoc = domParser.parseFromString(sRelsXml, "text/xml");
        const rels = sRelsDoc.getElementsByTagName("Relationship");
        for (let r = 0; r < rels.length; r++) {
          const id = rels[r].getAttribute("Id");
          const target = rels[r].getAttribute("Target");
          const type = rels[r].getAttribute("Type");
          if (id && target && type && type.includes("image")) {
            const cleanTarget = target.replace(/^\.\.\//, "ppt/");
            imageTargetMap[id] = cleanTarget;
          }
        }
      } catch (e) {
        console.warn(`Could not parse relations for ${slidePath}:`, e);
      }
    }

    // Extract shapes (<p:sp>)
    const shapes = slideDoc.getElementsByTagName("p:sp");
    for (let spIdx = 0; spIdx < shapes.length; spIdx++) {
      const sp = shapes[spIdx];

      const ph = sp.getElementsByTagName("p:ph")[0];
      const phType = ph ? ph.getAttribute("type") || "" : "";
      const isTitleShape =
        phType === "title" || phType === "ctrTitle" || (!slideTitle && spIdx === 0);
      const isSubTitleShape = phType === "subTitle";

      const txBody = sp.getElementsByTagName("p:txBody")[0];
      if (!txBody) continue;

      const paragraphs = txBody.getElementsByTagName("a:p");
      for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
        const p = paragraphs[pIdx];

        const textRuns = p.getElementsByTagName("a:t");
        let paraText = "";
        for (let t = 0; t < textRuns.length; t++) {
          paraText += textRuns[t].textContent || "";
        }
        paraText = paraText.trim();
        if (!paraText) continue;

        if (isTitleShape && !slideTitle) {
          slideTitle = paraText;
        } else if (isSubTitleShape) {
          subtitles.push(paraText);
        } else {
          const pPr = p.getElementsByTagName("a:pPr")[0];
          const lvl = pPr ? parseInt(pPr.getAttribute("lvl") || "0", 10) : 0;
          const hasBuChar = pPr?.getElementsByTagName("a:buChar").length || 0;
          const hasBuAutoNum = pPr?.getElementsByTagName("a:buAutoNum").length || 0;

          if (lvl > 0 || hasBuChar > 0 || hasBuAutoNum > 0 || paraText.startsWith("•") || paraText.startsWith("-")) {
            const cleanBullet = paraText.replace(/^[•\-\*\s]+/, "").trim();
            if (cleanBullet) bulletPoints.push(cleanBullet);
          } else {
            bodyParagraphs.push(paraText);
          }
        }
      }
    }

    // Also extract text from tables (<a:tbl>)
    const tables = slideDoc.getElementsByTagName("a:tbl");
    for (let tb = 0; tb < tables.length; tb++) {
      const rows = tables[tb].getElementsByTagName("a:tr");
      for (let r = 0; r < rows.length; r++) {
        const cells = rows[r].getElementsByTagName("a:tc");
        const cellTexts: string[] = [];
        for (let c = 0; c < cells.length; c++) {
          const tRuns = cells[c].getElementsByTagName("a:t");
          let cellText = "";
          for (let tr = 0; tr < tRuns.length; tr++) {
            cellText += tRuns[tr].textContent || "";
          }
          if (cellText.trim()) cellTexts.push(cellText.trim());
        }
        if (cellTexts.length > 0) {
          bodyParagraphs.push(cellTexts.join("  |  "));
        }
      }
    }

    // Extract embedded slide images
    const images: PresentationSlide["images"] = [];
    const pics = slideDoc.getElementsByTagName("p:pic");
    for (let picIdx = 0; picIdx < pics.length; picIdx++) {
      const pic = pics[picIdx];
      const blip = pic.getElementsByTagName("a:blip")[0];
      if (!blip) continue;
      const embedId = blip.getAttribute("r:embed") || blip.getAttribute("embed") || "";
      const mediaPath = imageTargetMap[embedId];
      if (!mediaPath) continue;

      const mediaFile = zip.file(mediaPath);
      if (!mediaFile) continue;

      try {
        const ext = mediaPath.split(".").pop()?.toLowerCase() || "png";
        const mimeType = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "webp" ? "image/webp" : "image/png";
        const uint8 = await mediaFile.async("uint8array");
        const base64 = await mediaFile.async("base64");
        const dataUrl = `data:${mimeType};base64,${base64}`;

        images.push({
          name: mediaPath.split("/").pop() || `image-${picIdx + 1}.${ext}`,
          dataUrl,
          mimeType,
          uint8Array: uint8,
        });
      } catch (imgErr) {
        console.warn(`Could not load media ${mediaPath}:`, imgErr);
      }
    }

    // Extract speaker notes if present
    let notes = "";
    const noteFile = zip.file(`ppt/notesSlides/notesSlide${slideNumber}.xml`);
    if (noteFile) {
      try {
        const noteXml = await noteFile.async("text");
        const noteDoc = domParser.parseFromString(noteXml, "text/xml");
        const noteTexts = noteDoc.getElementsByTagName("a:t");
        const noteArr: string[] = [];
        for (let nt = 0; nt < noteTexts.length; nt++) {
          const t = (noteTexts[nt].textContent || "").trim();
          if (t && !noteArr.includes(t)) noteArr.push(t);
        }
        notes = noteArr.join(" ");
      } catch (e) {
        console.warn(`Could not parse notes for slide ${slideNumber}:`, e);
      }
    }

    // Default title fallback if none found
    if (!slideTitle) {
      slideTitle = bodyParagraphs.length > 0 ? bodyParagraphs[0].slice(0, 40) : `Slide ${slideNumber}`;
      if (bodyParagraphs.length > 0 && slideTitle === bodyParagraphs[0].slice(0, 40)) {
        bodyParagraphs.shift();
      }
    }

    slides.push({
      slideNumber,
      title: slideTitle,
      subtitles,
      bulletPoints,
      bodyParagraphs,
      notes: notes || undefined,
      images,
    });
  }

  const docTitle =
    slides.length > 0 && slides[0].title
      ? slides[0].title
      : file.name.replace(/\.[^/.]+$/, "");

  return {
    title: docTitle,
    slideCount: slides.length,
    slides,
    widthMm,
    heightMm,
    orientation,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Legacy PPT (Binary) Parsing
// ─────────────────────────────────────────────────────────────────────────────

export async function parseLegacyPpt(file: File): Promise<ParsedPresentation> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const extractedStrings: string[] = [];

  // UTF-16LE extraction
  let utf16Buf: number[] = [];
  for (let i = 0; i < bytes.length - 1; i += 2) {
    const b1 = bytes[i];
    const b2 = bytes[i + 1];
    if (b2 === 0 && b1 >= 32 && b1 <= 126) {
      utf16Buf.push(b1);
    } else {
      if (utf16Buf.length >= 3) {
        extractedStrings.push(String.fromCharCode(...utf16Buf));
      }
      utf16Buf = [];
    }
  }
  if (utf16Buf.length >= 3) {
    extractedStrings.push(String.fromCharCode(...utf16Buf));
  }

  // ASCII extraction
  let asciiBuf: number[] = [];
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    if (b >= 32 && b <= 126) {
      asciiBuf.push(b);
    } else {
      if (asciiBuf.length >= 4) {
        extractedStrings.push(String.fromCharCode(...asciiBuf));
      }
      asciiBuf = [];
    }
  }
  if (asciiBuf.length >= 4) {
    extractedStrings.push(String.fromCharCode(...asciiBuf));
  }

  const ignoredWords = new Set([
    "PowerPoint Document",
    "Current User",
    "Times New Roman",
    "Arial",
    "Calibri",
    "Tahoma",
    "Verdana",
    "Microsoft PowerPoint",
    "DocumentSummaryInformation",
    "SummaryInformation",
    "Title",
    "Default Design",
  ]);

  const validLines: string[] = [];
  for (const str of extractedStrings) {
    const trimmed = str.trim();
    if (trimmed.length > 2 && !ignoredWords.has(trimmed) && !trimmed.startsWith("<?xml") && !trimmed.startsWith("<")) {
      if (!validLines.includes(trimmed)) {
        validLines.push(trimmed);
      }
    }
  }

  const slides: PresentationSlide[] = [];
  const chunkSize = Math.max(3, Math.min(6, Math.ceil(validLines.length / 5) || 4));

  for (let i = 0; i < validLines.length; i += chunkSize) {
    const chunk = validLines.slice(i, i + chunkSize);
    const slideNumber = Math.floor(i / chunkSize) + 1;
    const title = chunk[0] || `Slide ${slideNumber}`;
    const rest = chunk.slice(1);

    const bulletPoints: string[] = [];
    const bodyParagraphs: string[] = [];

    rest.forEach((line) => {
      if (line.length < 80) {
        bulletPoints.push(line);
      } else {
        bodyParagraphs.push(line);
      }
    });

    slides.push({
      slideNumber,
      title,
      subtitles: [],
      bulletPoints,
      bodyParagraphs,
      images: [],
    });
  }

  if (slides.length === 0) {
    slides.push({
      slideNumber: 1,
      title: file.name.replace(/\.[^/.]+$/, ""),
      subtitles: ["PowerPoint Presentation Document"],
      bulletPoints: ["Document converted via Switchr in-browser presentation engine."],
      bodyParagraphs: [],
      images: [],
    });
  }

  return {
    title: slides[0].title || file.name.replace(/\.[^/.]+$/, ""),
    slideCount: slides.length,
    slides,
    widthMm: 297,
    heightMm: 167,
    orientation: "landscape",
  };
}

export async function parsePresentation(file: File): Promise<ParsedPresentation> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "pptx") {
    try {
      return await parsePptx(file);
    } catch (err) {
      console.warn("PPTX XML parsing encountered an issue, falling back to stream parsing:", err);
      return await parseLegacyPpt(file);
    }
  }
  return await parseLegacyPpt(file);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Presentation to PDF (Landscape Presentation Deck)
// ─────────────────────────────────────────────────────────────────────────────

export interface PresentationToPdfOptions {
  theme?: "modern-dark" | "clean-light";
  includeSlideNumbers?: boolean;
}

export async function presentationToPdf(
  file: File,
  options: PresentationToPdfOptions = {},
  onProgress?: (progress: number) => void
): Promise<Blob> {
  if (onProgress) onProgress(0.1);

  const presentation = await parsePresentation(file);
  if (onProgress) onProgress(0.35);

  const { slides, widthMm = 297, heightMm = 167 } = presentation;
  const isDark = options.theme === "modern-dark";

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [widthMm, heightMm],
  });

  const totalSlides = slides.length || 1;

  for (let s = 0; s < slides.length; s++) {
    const slide = slides[s];
    if (s > 0) {
      pdf.addPage([widthMm, heightMm], "landscape");
    }

    // ── 1. Background Styling ──
    if (isDark) {
      pdf.setFillColor(15, 23, 42); // slate-900
      pdf.rect(0, 0, widthMm, heightMm, "F");

      pdf.setFillColor(30, 41, 59); // slate-800
      pdf.roundedRect(8, 8, widthMm - 16, heightMm - 16, 4, 4, "F");

      pdf.setDrawColor(51, 65, 85); // slate-700
      pdf.setLineWidth(0.5);
      pdf.roundedRect(8, 8, widthMm - 16, heightMm - 16, 4, 4, "D");
    } else {
      pdf.setFillColor(248, 250, 252); // slate-50
      pdf.rect(0, 0, widthMm, heightMm, "F");

      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(8, 8, widthMm - 16, heightMm - 16, 4, 4, "F");

      pdf.setDrawColor(226, 232, 240); // slate-200
      pdf.setLineWidth(0.6);
      pdf.roundedRect(8, 8, widthMm - 16, heightMm - 16, 4, 4, "D");
    }

    // ── 2. Top Header Banner & Slide Title ──
    pdf.setFillColor(99, 102, 241); // indigo-500 accent
    pdf.rect(16, 16, 4, 16, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.setTextColor(isDark ? 248 : 15, isDark ? 250 : 23, isDark ? 252 : 42);

    const titleMaxWidth = widthMm - 75;
    const splitTitle = pdf.splitTextToSize(slide.title || `Slide ${slide.slideNumber}`, titleMaxWidth);
    pdf.text(splitTitle, 24, 23);

    let currentY = 25 + splitTitle.length * 6;
    if (slide.subtitles && slide.subtitles.length > 0) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(isDark ? 148 : 100, isDark ? 163 : 116, isDark ? 184 : 139);
      for (const sub of slide.subtitles) {
        pdf.text(sub, 24, currentY);
        currentY += 5.5;
      }
    }

    // Slide Number Badge
    if (options.includeSlideNumbers !== false) {
      const badgeText = `${slide.slideNumber} / ${totalSlides}`;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setFillColor(isDark ? 51 : 241, isDark ? 65 : 245, isDark ? 85 : 249);
      pdf.roundedRect(widthMm - 36, 16, 20, 7, 2, 2, "F");
      pdf.setTextColor(isDark ? 203 : 71, isDark ? 213 : 85, isDark ? 225 : 105);
      pdf.text(badgeText, widthMm - 26, 20.8, { align: "center" });
    }

    currentY = Math.max(currentY + 2, 34);
    pdf.setDrawColor(isDark ? 51 : 226, isDark ? 65 : 232, isDark ? 85 : 240);
    pdf.setLineWidth(0.3);
    pdf.line(16, currentY, widthMm - 16, currentY);
    currentY += 8;

    // ── 3. Content Layout ──
    const hasImages = slide.images && slide.images.length > 0;
    const contentWidth = hasImages ? (widthMm - 40) * 0.62 : widthMm - 40;
    const imageStartX = widthMm - 16 - ((widthMm - 40) * 0.35);

    // Bullet Points
    if (slide.bulletPoints && slide.bulletPoints.length > 0) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);

      for (let b = 0; b < slide.bulletPoints.length; b++) {
        if (currentY > heightMm - 24) break;

        const bullet = slide.bulletPoints[b];
        pdf.setFillColor(99, 102, 241);
        pdf.circle(20, currentY - 1.2, 1.3, "F");

        pdf.setTextColor(isDark ? 226 : 51, isDark ? 232 : 65, isDark ? 240 : 85);
        const splitBullet = pdf.splitTextToSize(bullet, contentWidth - 10);
        pdf.text(splitBullet, 25, currentY);
        currentY += splitBullet.length * 5.8 + 3.5;
      }
    }

    // Body Paragraphs
    if (slide.bodyParagraphs && slide.bodyParagraphs.length > 0) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(isDark ? 203 : 71, isDark ? 213 : 85, isDark ? 225 : 105);

      for (let p = 0; p < slide.bodyParagraphs.length; p++) {
        if (currentY > heightMm - 20) break;

        const para = slide.bodyParagraphs[p];
        const splitPara = pdf.splitTextToSize(para, contentWidth);
        pdf.text(splitPara, 20, currentY);
        currentY += splitPara.length * 5.2 + 4;
      }
    }

    // Render Embedded Image on right side
    if (hasImages && slide.images[0]) {
      try {
        const img = slide.images[0];
        const maxImgWidth = (widthMm - 40) * 0.35;
        const maxImgHeight = heightMm - 60;
        pdf.addImage(img.dataUrl, img.mimeType === "image/png" ? "PNG" : "JPEG", imageStartX, 42, maxImgWidth, maxImgHeight, undefined, "FAST");
      } catch (imgErr) {
        console.warn(`Failed to render slide image for slide ${slide.slideNumber}:`, imgErr);
      }
    }

    // ── 4. Slide Footer ──
    const footerY = heightMm - 12;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(isDark ? 100 : 148, isDark ? 116 : 163, isDark ? 139 : 184);
    pdf.text(presentation.title, 20, footerY);

    if (slide.notes) {
      pdf.text(`Notes: ${slide.notes.slice(0, 60)}...`, widthMm / 2, footerY, { align: "center" });
    }

    pdf.text("Converted with Switchr", widthMm - 20, footerY, { align: "right" });

    if (onProgress) {
      onProgress(0.35 + (0.6 * (s + 1)) / totalSlides);
    }
  }

  if (onProgress) onProgress(1.0);
  return pdf.output("blob");
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Presentation to DOCX (Microsoft Word Document)
// ─────────────────────────────────────────────────────────────────────────────

export async function presentationToDocx(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  if (onProgress) onProgress(0.15);

  const presentation = await parsePresentation(file);
  if (onProgress) onProgress(0.4);

  const docChildren: Paragraph[] = [];

  // Document Title Header
  docChildren.push(
    new Paragraph({
      text: presentation.title || "PowerPoint Presentation",
      heading: HeadingLevel.TITLE,
      spacing: { after: 240 },
    })
  );

  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Extracted from "${file.name}" • Total Slides: ${presentation.slideCount} • Generated by Switchr`,
          italics: true,
          color: "666666",
          size: 20,
        }),
      ],
      spacing: { after: 400 },
      border: {
        bottom: {
          color: "CCCCCC",
          space: 4,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
    })
  );

  for (let s = 0; s < presentation.slides.length; s++) {
    const slide = presentation.slides[s];

    // Slide Section Heading
    docChildren.push(
      new Paragraph({
        text: `Slide ${slide.slideNumber}: ${slide.title}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 180 },
      })
    );

    // Subtitles
    if (slide.subtitles && slide.subtitles.length > 0) {
      for (const sub of slide.subtitles) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: sub,
                italics: true,
                color: "4B5563",
                size: 22,
              }),
            ],
            spacing: { after: 120 },
          })
        );
      }
    }

    // Bullet points
    if (slide.bulletPoints && slide.bulletPoints.length > 0) {
      for (const bullet of slide.bulletPoints) {
        docChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: bullet,
                size: 22,
              }),
            ],
            spacing: { after: 100 },
          })
        );
      }
    }

    // Body Paragraphs
    if (slide.bodyParagraphs && slide.bodyParagraphs.length > 0) {
      for (const para of slide.bodyParagraphs) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: para,
                size: 22,
              }),
            ],
            spacing: { after: 140 },
          })
        );
      }
    }

    // Embed slide image if present
    if (slide.images && slide.images.length > 0) {
      for (const img of slide.images) {
        if (img.uint8Array) {
          try {
            docChildren.push(
              new Paragraph({
                children: [
                  new ImageRun({
                    data: img.uint8Array,
                    transformation: {
                      width: 480,
                      height: 270,
                    },
                    type: (img.mimeType === "image/jpeg" ? "jpg" : "png") as "jpg" | "png",
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 180, after: 200 },
              })
            );
          } catch (imgErr) {
            console.warn(`Could not embed image into DOCX:`, imgErr);
          }
        }
      }
    }

    // Slide Notes
    if (slide.notes) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Speaker Notes: ",
              bold: true,
              size: 20,
              color: "6B7280",
            }),
            new TextRun({
              text: slide.notes,
              italics: true,
              size: 20,
              color: "6B7280",
            }),
          ],
          spacing: { before: 100, after: 200 },
        })
      );
    }

    if (onProgress) {
      onProgress(0.4 + (0.5 * (s + 1)) / presentation.slides.length);
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  if (onProgress) onProgress(1.0);
  return blob;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. DOCX to PDF Conversion
// ─────────────────────────────────────────────────────────────────────────────

export async function docxToPdf(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  if (onProgress) onProgress(0.15);

  const zip = await JSZip.loadAsync(file);
  const docXmlFile = zip.file("word/document.xml");
  if (!docXmlFile) {
    throw new Error("Invalid DOCX file: word/document.xml not found");
  }

  const docXmlText = await docXmlFile.async("text");
  const domParser = new DOMParser();
  const docDoc = domParser.parseFromString(docXmlText, "text/xml");

  if (onProgress) onProgress(0.4);

  const pdf = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  let currentY = 25;

  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - margin) {
      pdf.addPage();
      currentY = margin;
    }
  };

  // Document Title Header
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.setTextColor(30, 41, 59);

  const cleanFileName = file.name.replace(/\.[^/.]+$/, "");
  pdf.text(cleanFileName, margin, currentY);
  currentY += 8;

  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.5);
  pdf.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  const paragraphs = docDoc.getElementsByTagName("w:p");
  const totalParas = paragraphs.length;

  for (let i = 0; i < totalParas; i++) {
    const p = paragraphs[i];

    const pStyle = p.getElementsByTagName("w:pStyle")[0]?.getAttribute("w:val") || "";
    const isHeading1 = pStyle.toLowerCase().includes("heading1") || pStyle.toLowerCase().includes("title");
    const isHeading2 = pStyle.toLowerCase().includes("heading2");
    const isHeading3 = pStyle.toLowerCase().includes("heading3");

    const numPr = p.getElementsByTagName("w:numPr")[0];
    const isBullet = !!numPr;

    const tRuns = p.getElementsByTagName("w:t");
    let fullParaText = "";
    for (let t = 0; t < tRuns.length; t++) {
      fullParaText += tRuns[t].textContent || "";
    }
    fullParaText = fullParaText.trim();
    if (!fullParaText) continue;

    if (isHeading1) {
      checkPageBreak(16);
      currentY += 4;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(15);
      pdf.setTextColor(15, 23, 42);
      const lines = pdf.splitTextToSize(fullParaText, contentWidth);
      pdf.text(lines, margin, currentY);
      currentY += lines.length * 6.5 + 4;
    } else if (isHeading2) {
      checkPageBreak(14);
      currentY += 3;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.setTextColor(30, 41, 59);
      const lines = pdf.splitTextToSize(fullParaText, contentWidth);
      pdf.text(lines, margin, currentY);
      currentY += lines.length * 5.8 + 3;
    } else if (isHeading3) {
      checkPageBreak(12);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(51, 65, 85);
      const lines = pdf.splitTextToSize(fullParaText, contentWidth);
      pdf.text(lines, margin, currentY);
      currentY += lines.length * 5.2 + 2;
    } else if (isBullet) {
      checkPageBreak(10);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10.5);
      pdf.setTextColor(51, 65, 85);

      pdf.setFillColor(99, 102, 241);
      pdf.circle(margin + 2, currentY - 1, 0.8, "F");

      const lines = pdf.splitTextToSize(fullParaText, contentWidth - 8);
      pdf.text(lines, margin + 6, currentY);
      currentY += lines.length * 5.0 + 2.5;
    } else {
      checkPageBreak(10);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(71, 85, 105);
      const lines = pdf.splitTextToSize(fullParaText, contentWidth);
      pdf.text(lines, margin, currentY);
      currentY += lines.length * 4.8 + 3;
    }

    if (onProgress) {
      onProgress(0.4 + (0.55 * (i + 1)) / totalParas);
    }
  }

  if (onProgress) onProgress(1.0);
  return pdf.output("blob");
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Presentation to Plain Text Outline & HTML
// ─────────────────────────────────────────────────────────────────────────────

export async function presentationToText(file: File): Promise<string> {
  const pres = await parsePresentation(file);
  let text = `====================================================\n`;
  text += `${pres.title.toUpperCase()}\n`;
  text += `Total Slides: ${pres.slideCount}\n`;
  text += `====================================================\n\n`;

  for (const slide of pres.slides) {
    text += `----------------------------------------------------\n`;
    text += `SLIDE ${slide.slideNumber}: ${slide.title}\n`;
    text += `----------------------------------------------------\n`;

    if (slide.subtitles.length > 0) {
      text += `Subtitle: ${slide.subtitles.join(" | ")}\n\n`;
    }

    if (slide.bulletPoints.length > 0) {
      for (const b of slide.bulletPoints) {
        text += `  • ${b}\n`;
      }
      text += `\n`;
    }

    if (slide.bodyParagraphs.length > 0) {
      for (const p of slide.bodyParagraphs) {
        text += `${p}\n\n`;
      }
    }

    if (slide.notes) {
      text += `[Speaker Notes]: ${slide.notes}\n\n`;
    }
  }

  return text;
}

export async function presentationToHtml(file: File): Promise<string> {
  const pres = await parsePresentation(file);

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${pres.title}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 40px 20px; }
    .container { max-width: 900px; margin: 0 auto; }
    h1 { font-size: 2rem; color: #fff; border-bottom: 2px solid #334155; padding-bottom: 12px; margin-bottom: 30px; }
    .slide-card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .slide-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 16px; }
    .slide-title { font-size: 1.3rem; font-weight: 700; color: #818cf8; margin: 0; }
    .slide-badge { background: #334155; color: #94a3b8; font-size: 0.8rem; font-weight: 600; padding: 4px 10px; border-radius: 9999px; }
    .bullet-list { padding-left: 20px; line-height: 1.7; }
    .bullet-list li { margin-bottom: 8px; }
    .para { line-height: 1.6; color: #cbd5e1; margin-bottom: 12px; }
    .notes { background: #0f172a; border-left: 3px solid #6366f1; padding: 8px 14px; font-size: 0.9rem; color: #94a3b8; font-style: italic; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${pres.title}</h1>
`;

  for (const slide of pres.slides) {
    html += `    <div class="slide-card">
      <div class="slide-header">
        <h2 class="slide-title">Slide ${slide.slideNumber}: ${slide.title}</h2>
        <span class="slide-badge">Slide ${slide.slideNumber} of ${pres.slideCount}</span>
      </div>\n`;

    if (slide.bulletPoints.length > 0) {
      html += `      <ul class="bullet-list">\n`;
      for (const b of slide.bulletPoints) {
        html += `        <li>${b}</li>\n`;
      }
      html += `      </ul>\n`;
    }

    if (slide.bodyParagraphs.length > 0) {
      for (const p of slide.bodyParagraphs) {
        html += `      <p class="para">${p}</p>\n`;
      }
    }

    if (slide.notes) {
      html += `      <div class="notes"><strong>Speaker Notes:</strong> ${slide.notes}</div>\n`;
    }

    html += `    </div>\n`;
  }

  html += `  </div>
</body>
</html>`;

  return html;
}
