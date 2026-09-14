/**
 * Switchr AI Photo Enhancer Engine v2.0
 * Accurate multi-component computational photography pipeline:
 * 1. Zone-based Tonal Components (Exposure, Contrast, Highlights, Shadows, Whites, Blacks)
 * 2. Color Science & White Balance (Temperature, Tint, Smart Vibrance, Saturation)
 * 3. Detail & Spatial Texture (Clarity, Edge Acuity Sharpening, Dehaze)
 * 4. Noise Suppression (Bilateral edge-preserving denoise)
 * 5. Luminance-preserved color math (prevents hue distortion and clipping)
 * 6. AI Auto-Calibration: scans image histogram & sets exact optimal component values
 * 7. Super-resolution upscaling (2x / 4x)
 */

export interface EnhanceSettings {
  preset: "magic" | "portrait" | "hdr" | "night" | "sharp" | "custom";
  strength: number; // 0 to 100%

  // Tone Components
  exposure: number; // -100 to +100
  contrast: number; // -100 to +100
  highlights: number; // -100 to +100
  shadows: number; // -100 to +100
  whites: number; // -100 to +100
  blacks: number; // -100 to +100

  // Color Components
  temperature: number; // -100 (cool) to +100 (warm)
  tint: number; // -100 (green) to +100 (magenta)
  vibrance: number; // -100 to +100
  saturation: number; // -100 to +100

  // Detail & Texture Components
  clarity: number; // 0 to 100 (micro-contrast)
  sharpness: number; // 0 to 100 (high-pass edge acuity)
  dehaze: number; // -100 to +100 (atmospheric depth)
  denoise: number; // 0 to 100 (bilateral edge-preserving)

  // Super-Resolution
  scale: 1 | 2 | 4;
}

export const DEFAULT_SETTINGS: EnhanceSettings = {
  preset: "custom",
  strength: 100,
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  temperature: 0,
  tint: 0,
  vibrance: 0,
  saturation: 0,
  clarity: 0,
  sharpness: 0,
  dehaze: 0,
  denoise: 0,
  scale: 1,
};

export const ENHANCE_PRESETS: Record<string, EnhanceSettings> = {
  magic: {
    preset: "magic",
    strength: 90,
    exposure: 12,
    contrast: 18,
    highlights: -15,
    shadows: 38,
    whites: 10,
    blacks: -8,
    temperature: 4,
    tint: 0,
    vibrance: 32,
    saturation: 8,
    clarity: 50,
    sharpness: 65,
    dehaze: 14,
    denoise: 20,
    scale: 1,
  },
  portrait: {
    preset: "portrait",
    strength: 85,
    exposure: 15,
    contrast: 10,
    highlights: -20,
    shadows: 30,
    whites: 8,
    blacks: -5,
    temperature: 8,
    tint: 2,
    vibrance: 16,
    saturation: 4,
    clarity: 25,
    sharpness: 55,
    dehaze: 5,
    denoise: 45,
    scale: 1,
  },
  hdr: {
    preset: "hdr",
    strength: 95,
    exposure: 8,
    contrast: 30,
    highlights: -45,
    shadows: 65,
    whites: 20,
    blacks: -18,
    temperature: 5,
    tint: -2,
    vibrance: 45,
    saturation: 15,
    clarity: 75,
    sharpness: 75,
    dehaze: 35,
    denoise: 25,
    scale: 1,
  },
  night: {
    preset: "night",
    strength: 90,
    exposure: 28,
    contrast: 22,
    highlights: -35,
    shadows: 75,
    whites: 15,
    blacks: -20,
    temperature: -5,
    tint: 4,
    vibrance: 25,
    saturation: 10,
    clarity: 60,
    sharpness: 60,
    dehaze: 25,
    denoise: 65,
    scale: 1,
  },
  sharp: {
    preset: "sharp",
    strength: 90,
    exposure: 5,
    contrast: 20,
    highlights: -10,
    shadows: 25,
    whites: 12,
    blacks: -10,
    temperature: 0,
    tint: 0,
    vibrance: 20,
    saturation: 5,
    clarity: 85,
    sharpness: 95,
    dehaze: 20,
    denoise: 15,
    scale: 1,
  },
  custom: {
    ...DEFAULT_SETTINGS,
    preset: "custom",
  },
};

export interface ImageAnalysis {
  meanLuma: number;
  minLuma: number;
  maxLuma: number;
  dynamicRange: number;
  shadowClip: number; // % pixels in deep shadow
  highlightClip: number; // % pixels in blown highlights
  averageSaturation: number;
  colorCast: { r: number; g: number; b: number };
  sharpnessScore: number;
}

export interface ImageHistogramData {
  r: Uint32Array;
  g: Uint32Array;
  b: Uint32Array;
  luma: Uint32Array;
  maxCount: number;
}

/**
 * Computes live histogram data for RGB and Luminance channels
 */
export function computeImageHistogram(data: ImageData): ImageHistogramData {
  const rHist = new Uint32Array(256);
  const gHist = new Uint32Array(256);
  const bHist = new Uint32Array(256);
  const lumaHist = new Uint32Array(256);

  const pixels = data.data;
  const len = pixels.length;
  let maxCount = 0;

  for (let i = 0; i < len; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const y = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

    rHist[r]++;
    gHist[g]++;
    bHist[b]++;
    lumaHist[y]++;

    if (rHist[r] > maxCount) maxCount = rHist[r];
    if (gHist[g] > maxCount) maxCount = gHist[g];
    if (bHist[b] > maxCount) maxCount = bHist[b];
  }

  return { r: rHist, g: gHist, b: bHist, luma: lumaHist, maxCount };
}

/**
 * Deep statistical analysis of the image to drive AI auto-calibration
 */
export function analyzeImageComprehensive(data: ImageData): ImageAnalysis {
  const pixels = data.data;
  const len = pixels.length;
  const numPixels = len / 4;

  let sumLuma = 0;
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let sumSat = 0;
  let shadowClipCount = 0;
  let highlightClipCount = 0;

  const lumaHist = new Uint32Array(256);

  // Gradient magnitude sample for sharpness
  let gradientSum = 0;
  let gradientSamples = 0;
  const width = data.width;

  for (let i = 0; i < len; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const y = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

    sumR += r;
    sumG += g;
    sumB += b;
    sumLuma += y;
    lumaHist[y]++;

    if (y < 12) shadowClipCount++;
    if (y > 244) highlightClipCount++;

    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const sat = maxC === 0 ? 0 : (maxC - minC) / maxC;
    sumSat += sat;

    // Edge sharpness calculation on 2x2 grid
    const pxIdx = i / 4;
    const x = pxIdx % width;
    if (x < width - 1 && i + width * 4 < len) {
      const nextX = pixels[i + 4];
      const nextY = pixels[i + width * 4];
      const diff = Math.abs(r - nextX) + Math.abs(r - nextY);
      gradientSum += diff;
      gradientSamples++;
    }
  }

  const meanLuma = sumLuma / numPixels;
  const avgR = sumR / numPixels;
  const avgG = sumG / numPixels;
  const avgB = sumB / numPixels;

  let minLuma = 0;
  let maxLuma = 255;
  let count = 0;
  const p1 = Math.floor(numPixels * 0.01);
  const p99 = Math.floor(numPixels * 0.99);

  for (let i = 0; i < 256; i++) {
    count += lumaHist[i];
    if (minLuma === 0 && count >= p1) minLuma = i;
    if (count >= p99) {
      maxLuma = i;
      break;
    }
  }

  return {
    meanLuma,
    minLuma,
    maxLuma: Math.max(minLuma + 10, maxLuma),
    dynamicRange: maxLuma - minLuma,
    shadowClip: (shadowClipCount / numPixels) * 100,
    highlightClip: (highlightClipCount / numPixels) * 100,
    averageSaturation: sumSat / numPixels,
    colorCast: { r: avgR, g: avgG, b: avgB },
    sharpnessScore: gradientSamples > 0 ? gradientSum / gradientSamples : 10,
  };
}

/**
 * AI Auto-Calibration: Automatically measures photo flaws and sets optimal component values
 */
export function autoCalibrateImage(data: ImageData): EnhanceSettings {
  const analysis = analyzeImageComprehensive(data);
  const settings: EnhanceSettings = { ...DEFAULT_SETTINGS, preset: "magic" };

  // 1. Exposure & Shadow compensation
  if (analysis.meanLuma < 90) {
    // Underexposed
    settings.exposure = Math.min(35, Math.round((115 - analysis.meanLuma) * 0.45));
    settings.shadows = Math.min(65, Math.round((100 - analysis.meanLuma) * 0.6) + 15);
    settings.contrast = 15;
  } else if (analysis.meanLuma > 165) {
    // Overexposed
    settings.exposure = Math.max(-25, Math.round((140 - analysis.meanLuma) * 0.35));
    settings.highlights = -35;
    settings.contrast = 20;
  } else {
    // Balanced exposure
    settings.exposure = 8;
    settings.shadows = 32;
    settings.highlights = -15;
    settings.contrast = 18;
  }

  // 2. Dynamic range expansion
  if (analysis.dynamicRange < 190) {
    settings.whites = 14;
    settings.blacks = -12;
    settings.dehaze = 18;
  } else {
    settings.whites = 8;
    settings.blacks = -6;
  }

  // 3. Color Temperature & White balance normalization
  const r = analysis.colorCast.r;
  const b = analysis.colorCast.b;
  const g = analysis.colorCast.g;

  if (r > b + 15) {
    // Too warm / indoor yellow cast -> cool down slightly
    settings.temperature = Math.max(-15, Math.round((b - r) * 0.3));
  } else if (b > r + 15) {
    // Too cold / overcast blue -> warm up slightly
    settings.temperature = Math.min(20, Math.round((b - r) * 0.35));
  }

  // Tint correction
  const expectedG = (r + b) / 2;
  if (Math.abs(g - expectedG) > 8) {
    settings.tint = Math.round((expectedG - g) * 0.4);
  }

  // 4. Vibrance & Saturation
  if (analysis.averageSaturation < 0.25) {
    settings.vibrance = 38;
    settings.saturation = 10;
  } else if (analysis.averageSaturation < 0.45) {
    settings.vibrance = 25;
    settings.saturation = 5;
  } else {
    settings.vibrance = 12;
    settings.saturation = 0;
  }

  // 5. Clarity & Sharpness
  if (analysis.sharpnessScore < 15) {
    // Soft/blurry photo -> aggressive recovery
    settings.clarity = 65;
    settings.sharpness = 80;
    settings.denoise = 20;
  } else if (analysis.sharpnessScore > 35) {
    // Already sharp -> gentle micro-contrast
    settings.clarity = 35;
    settings.sharpness = 45;
    settings.denoise = 15;
  } else {
    settings.clarity = 50;
    settings.sharpness = 65;
    settings.denoise = 20;
  }

  settings.strength = 90;
  return settings;
}

/**
 * Accurate Tonal Luminance Curve Generator (Zone-System mapping)
 */
function buildToneLuminanceLUT(settings: EnhanceSettings): Float32Array {
  const lut = new Float32Array(256);
  const factor = settings.strength / 100;

  // Exposure shift: linear EV multiplier 2^(EV)
  const ev = (settings.exposure / 100) * 1.35 * factor;
  const evScale = Math.pow(2, ev);

  const contrastVal = (settings.contrast / 100) * factor;
  const contrastFactor = Math.tan(((contrastVal * 35 + 45) * Math.PI) / 180);

  const shadowBoost = (settings.shadows / 100) * 85 * factor;
  const highlightAdj = (settings.highlights / 100) * 75 * factor;
  const whiteAdj = (settings.whites / 100) * 45 * factor;
  const blackAdj = (settings.blacks / 100) * 45 * factor;

  for (let i = 0; i < 256; i++) {
    // 1. Exposure
    let y = i * evScale;

    // 2. Blacks (0 - 45 zone)
    if (y < 60) {
      const bWeight = Math.pow(1 - y / 60, 1.8);
      y += blackAdj * bWeight;
    }

    // 3. Shadows (0 - 140 zone)
    if (y < 160) {
      const sWeight = Math.pow(1 - y / 160, 1.5);
      y += shadowBoost * sWeight;
    }

    // 4. Highlights (110 - 255 zone)
    if (y > 100) {
      const hWeight = Math.pow((y - 100) / 155, 1.4);
      y += highlightAdj * hWeight;
    }

    // 5. Whites (180 - 255 zone)
    if (y > 175) {
      const wWeight = Math.pow((y - 175) / 80, 1.8);
      y += whiteAdj * wWeight;
    }

    // 6. Contrast (S-curve centered at midtone 128)
    const norm = (y - 128) / 128;
    y = (norm * contrastFactor) * 128 + 128;

    lut[i] = Math.max(0, Math.min(255, y));
  }

  return lut;
}

/**
 * Core Multi-Component Image Processor
 */
export function processEnhancedImageData(
  source: ImageData,
  settings: EnhanceSettings
): ImageData {
  const width = source.width;
  const height = source.height;
  const len = source.data.length;

  const output = new ImageData(new Uint8ClampedArray(source.data), width, height);
  const src = source.data;
  const dst = output.data;

  const factor = settings.strength / 100;
  const toneLUT = buildToneLuminanceLUT(settings);

  // White balance coefficients
  const tempShift = (settings.temperature / 100) * 28 * factor;
  const tintShift = (settings.tint / 100) * 20 * factor;

  const rColorMul = 1 + (tempShift * 0.015 + tintShift * 0.008);
  const gColorMul = 1 - (tintShift * 0.015);
  const bColorMul = 1 - (tempShift * 0.018 - tintShift * 0.008);

  // Dehaze & Vibrance
  const dehazeVal = (settings.dehaze / 100) * 30 * factor;
  const vibranceVal = (settings.vibrance / 100) * 1.3 * factor;
  const satVal = (settings.saturation / 100) * 1.1 * factor;

  const lumaBuffer = new Float32Array(width * height);

  // PASS 1: Luminance Tone Mapping, Color Balancing & Perceptual Vibrance
  for (let i = 0, px = 0; i < len; i += 4, px++) {
    let r = src[i];
    let g = src[i + 1];
    let b = src[i + 2];

    // Dehaze black-point subtraction on hazy midtones
    if (dehazeVal !== 0) {
      const minChannel = Math.min(r, g, b);
      const hazeFactor = (minChannel / 255) * dehazeVal;
      r = Math.max(0, r - hazeFactor);
      g = Math.max(0, g - hazeFactor);
      b = Math.max(0, b - hazeFactor);
    }

    // Input luminance
    const origLuma = 0.299 * r + 0.587 * g + 0.114 * b;
    const lumaIdx = Math.max(0, Math.min(255, Math.round(origLuma)));
    const targetLuma = toneLUT[lumaIdx];

    // Scale RGB by luminance ratio to strictly preserve chromaticity
    if (origLuma > 0.001) {
      const ratio = targetLuma / origLuma;
      r = r * ratio;
      g = g * ratio;
      b = b * ratio;
    } else {
      r = targetLuma;
      g = targetLuma;
      b = targetLuma;
    }

    // Apply White Balance (Temperature & Tint)
    r *= rColorMul;
    g *= gColorMul;
    b *= bColorMul;

    // Smart Vibrance & Saturation
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const currentSat = maxC === 0 ? 0 : (maxC - minC) / maxC;

    // Skin-tone detection for preservation
    const isSkin = r > g && g > b && (r - b) > 18 && r > 55;
    const skinFactor = isSkin ? 0.45 : 1.0;

    const vibFactor = 1 + (1 - currentSat) * vibranceVal * skinFactor + satVal * 0.75;
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    r = gray + (r - gray) * vibFactor;
    g = gray + (g - gray) * vibFactor;
    b = gray + (b - gray) * vibFactor;

    dst[i] = Math.max(0, Math.min(255, r));
    dst[i + 1] = Math.max(0, Math.min(255, g));
    dst[i + 2] = Math.max(0, Math.min(255, b));
    dst[i + 3] = src[i + 3];

    lumaBuffer[px] = 0.299 * dst[i] + 0.587 * dst[i + 1] + 0.114 * dst[i + 2];
  }

  // PASS 2: Local Clarity & Edge Acuity Sharpening
  const clarityVal = (settings.clarity / 100) * 0.85 * factor;
  const sharpnessVal = (settings.sharpness / 100) * 0.95 * factor;

  if (clarityVal > 0.02 || sharpnessVal > 0.02) {
    const detailBuffer = new Float32Array(width * height);

    for (let y = 1; y < height - 1; y++) {
      const row = y * width;
      for (let x = 1; x < width - 1; x++) {
        const idx = row + x;
        const center = lumaBuffer[idx];

        // 3x3 Laplacian edge filter
        const top = lumaBuffer[idx - width];
        const bottom = lumaBuffer[idx + width];
        const left = lumaBuffer[idx - 1];
        const right = lumaBuffer[idx + 1];

        const laplacian = 4 * center - (top + bottom + left + right);
        const absLap = Math.abs(laplacian);

        // Noise gate: ignore subtle sensor noise (< 2.5), focus on texture and boundaries
        if (absLap > 2.5 && absLap < 110) {
          const boost = laplacian * (sharpnessVal * 0.4 + clarityVal * 0.35);
          detailBuffer[idx] = boost;
        }
      }
    }

    // Add high-pass detail back to channels
    for (let i = 0, px = 0; i < len; i += 4, px++) {
      const delta = detailBuffer[px];
      if (delta !== 0) {
        dst[i] = Math.max(0, Math.min(255, dst[i] + delta));
        dst[i + 1] = Math.max(0, Math.min(255, dst[i + 1] + delta));
        dst[i + 2] = Math.max(0, Math.min(255, dst[i + 2] + delta));
      }
    }
  }

  // PASS 3: Bilateral Denoising
  const denoiseVal = (settings.denoise / 100) * factor;
  if (denoiseVal > 0.1) {
    const copy = new Uint8ClampedArray(dst);
    const thresh = 22 * (1 - denoiseVal * 0.4);

    for (let y = 1; y < height - 1; y++) {
      const row = y * width * 4;
      for (let x = 1; x < width - 1; x++) {
        const idx = row + x * 4;
        const cR = copy[idx];
        const cG = copy[idx + 1];
        const cB = copy[idx + 2];

        let sumR = cR * 2;
        let sumG = cG * 2;
        let sumB = cB * 2;
        let weightSum = 2;

        const neighbors = [idx - 4, idx + 4, idx - width * 4, idx + width * 4];
        for (let n = 0; n < 4; n++) {
          const nIdx = neighbors[n];
          const nR = copy[nIdx];
          const nG = copy[nIdx + 1];
          const nB = copy[nIdx + 2];

          const diff = Math.abs(cR - nR) + Math.abs(cG - nG) + Math.abs(cB - nB);
          if (diff < thresh) {
            const w = 1.0 - diff / thresh;
            sumR += nR * w;
            sumG += nG * w;
            sumB += nB * w;
            weightSum += w;
          }
        }

        const blend = denoiseVal * 0.45;
        dst[idx] = dst[idx] * (1 - blend) + (sumR / weightSum) * blend;
        dst[idx + 1] = dst[idx + 1] * (1 - blend) + (sumG / weightSum) * blend;
        dst[idx + 2] = dst[idx + 2] * (1 - blend) + (sumB / weightSum) * blend;
      }
    }
  }

  return output;
}

/**
 * Super-resolution upscaling (2x / 4x) with directional edge reconstruction
 */
export function upscaleCanvas(
  sourceCanvas: HTMLCanvasElement,
  scale: 1 | 2 | 4
): HTMLCanvasElement {
  if (scale === 1) return sourceCanvas;

  const targetWidth = sourceCanvas.width * scale;
  const targetHeight = sourceCanvas.height * scale;

  const upCanvas = document.createElement("canvas");
  upCanvas.width = targetWidth;
  upCanvas.height = targetHeight;
  const ctx = upCanvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return sourceCanvas;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);

  // High-order directional edge reconstruction
  const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const data = imgData.data;
  const edgeSharpen = 0.35 * (scale === 4 ? 0.45 : 0.35);

  for (let y = 1; y < targetHeight - 1; y++) {
    const rowOffset = y * targetWidth * 4;
    for (let x = 1; x < targetWidth - 1; x++) {
      const idx = rowOffset + x * 4;

      for (let c = 0; c < 3; c++) {
        const center = data[idx + c];
        const top = data[idx - targetWidth * 4 + c];
        const bottom = data[idx + targetWidth * 4 + c];
        const left = data[idx - 4 + c];
        const right = data[idx + 4 + c];

        const delta = (4 * center - (top + bottom + left + right)) * edgeSharpen;
        if (Math.abs(delta) > 1 && Math.abs(delta) < 45) {
          data[idx + c] = Math.max(0, Math.min(255, center + delta));
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return upCanvas;
}

/**
 * Detects if a Blob or File is in HEIC/HEIF format by checking:
 * 1. File name extension (.heic, .heif)
 * 2. MIME type (image/heic, image/heif)
 * 3. ISOBMFF magic byte header ('ftyp' brand starting with 'hei', 'hev', 'mif1', 'msf1')
 */
export async function isHeicFormat(blob: Blob, fileName?: string): Promise<boolean> {
  const name = fileName || (blob instanceof File ? blob.name : "");
  if (/\.(heic|heif)$/i.test(name)) return true;
  if (/image\/(heic|heif)/i.test(blob.type)) return true;

  if (blob.size >= 12) {
    try {
      const buffer = await blob.slice(0, 16).arrayBuffer();
      const view = new DataView(buffer);
      // Bytes 4-7 must be ASCII 'ftyp'
      const ftyp = String.fromCharCode(
        view.getUint8(4),
        view.getUint8(5),
        view.getUint8(6),
        view.getUint8(7)
      );
      if (ftyp === "ftyp") {
        const brand = String.fromCharCode(
          view.getUint8(8),
          view.getUint8(9),
          view.getUint8(10),
          view.getUint8(11)
        ).toLowerCase();
        if (
          brand.startsWith("hei") ||
          brand.startsWith("hev") ||
          brand === "mif1" ||
          brand === "msf1"
        ) {
          return true;
        }
      }
    } catch {
      // ignore
    }
  }

  return false;
}

/**
 * Decodes a HEIC/HEIF Blob into a standard JPEG Blob using heic2any
 */
export async function decodeHeicBlob(blob: Blob, quality = 0.98): Promise<Blob> {
  const heic2anyModule = await import("heic2any");
  const heic2any = heic2anyModule.default || heic2anyModule;
  const converted = await heic2any({
    blob,
    toType: "image/jpeg",
    quality,
  });
  return Array.isArray(converted) ? converted[0] : converted;
}

/**
 * Full enhancement pipeline execution
 */
export async function enhanceImageFile(
  fileOrBlob: Blob,
  settings: EnhanceSettings,
  onProgress?: (p: number) => void
): Promise<{
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  histogram: ImageHistogramData;
}> {
  if (onProgress) onProgress(0.05);

  let activeBlob = fileOrBlob;
  if (await isHeicFormat(activeBlob)) {
    activeBlob = await decodeHeicBlob(activeBlob);
  }

  if (onProgress) onProgress(0.15);

  const img = new Image();
  const objectUrl = URL.createObjectURL(activeBlob);

  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image for enhancement"));
      img.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }

  const originalWidth = img.naturalWidth;
  const originalHeight = img.naturalHeight;

  if (onProgress) onProgress(0.25);

  const canvas = document.createElement("canvas");
  canvas.width = originalWidth;
  canvas.height = originalHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not initialize 2D context");

  ctx.drawImage(img, 0, 0);

  if (onProgress) onProgress(0.4);

  const srcData = ctx.getImageData(0, 0, originalWidth, originalHeight);
  const enhancedData = processEnhancedImageData(srcData, settings);
  ctx.putImageData(enhancedData, 0, 0);

  if (onProgress) onProgress(0.7);

  let finalCanvas = canvas;
  if (settings.scale > 1) {
    finalCanvas = upscaleCanvas(canvas, settings.scale);
  }

  if (onProgress) onProgress(0.85);

  const finalBlob = await new Promise<Blob>((resolve, reject) => {
    finalCanvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to export image"))),
      "image/jpeg",
      0.95
    );
  });

  const dataUrl = finalCanvas.toDataURL("image/jpeg", 0.95);
  const histogram = computeImageHistogram(enhancedData);

  if (onProgress) onProgress(1.0);

  return {
    blob: finalBlob,
    dataUrl,
    width: finalCanvas.width,
    height: finalCanvas.height,
    originalWidth,
    originalHeight,
    histogram,
  };
}
