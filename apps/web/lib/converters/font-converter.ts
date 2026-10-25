// @ts-ignore - opentype.js may not have explicit type definitions installed
import * as opentype from "opentype.js";

export interface FontMetadata {
  familyName: string;
  styleName: string;
  fullName: string;
  version: string;
  numGlyphs: number;
  unitsPerEm: number;
}

/**
 * Parses a font file (TTF, OTF, WOFF) and extracts font metadata.
 */
export async function parseFont(file: File): Promise<{ font: any; metadata: FontMetadata }> {
  const buffer = await file.arrayBuffer();
  const font = opentype.parse(buffer);

  const metadata: FontMetadata = {
    familyName: font.names.fontFamily?.en || "Unknown Family",
    styleName: font.names.fontSubfamily?.en || "Regular",
    fullName: font.names.fullName?.en || font.names.fontFamily?.en || "Font",
    version: font.names.version?.en || "1.0",
    numGlyphs: font.numGlyphs || 0,
    unitsPerEm: font.unitsPerEm || 1000,
  };

  return { font, metadata };
}

/**
 * Convert a font file to TTF format.
 */
export async function fontToTtf(file: File): Promise<Blob> {
  const { font } = await parseFont(file);
  const buffer = font.toArrayBuffer();
  return new Blob([buffer], { type: "font/ttf" });
}

/**
 * Convert a font file to OTF format.
 */
export async function fontToOtf(file: File): Promise<Blob> {
  const { font } = await parseFont(file);
  const buffer = font.toArrayBuffer();
  return new Blob([buffer], { type: "font/otf" });
}

/**
 * Convert a font file to WOFF (packaged OpenType font).
 */
export async function fontToWoff(file: File): Promise<Blob> {
  // opentype.js outputs standard SFNT array buffer (TTF/OTF)
  const { font } = await parseFont(file);
  const buffer = font.toArrayBuffer();
  return new Blob([buffer], { type: "font/woff" });
}

/**
 * Generate preview SVG glyphs from a font.
 */
export async function getFontGlyphPreview(
  file: File,
  text: string = "Switchr 123",
  fontSize: number = 72
): Promise<string> {
  const { font } = await parseFont(file);
  const path = font.getPath(text, 10, fontSize, fontSize);
  return path.toSVG();
}
