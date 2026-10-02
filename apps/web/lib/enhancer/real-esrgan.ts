/**
 * Switchr Neural Super-Resolution Engine
 * Real-ESRGAN General x4v3 ONNX runner powered by ONNX Runtime Web.
 * 
 * Supports:
 * - Hardware-accelerated WebGPU inference with WASM SIMD fallback
 * - Memory-safe, seam-free tiled processing with trapezoidal feathering
 * - Dynamic 2x and 4x neural super-resolution
 */

import type * as OrtType from "onnxruntime-web";

let ortInstance: typeof OrtType | null = null;
let cachedSession: OrtType.InferenceSession | null = null;
let cachedProvider: "webgpu" | "wasm" = "wasm";
let initPromise: Promise<{ session: OrtType.InferenceSession; provider: "webgpu" | "wasm" }> | null = null;

export interface NeuralEngineInfo {
  isSupported: boolean;
  webgpuAvailable: boolean;
  activeProvider: "webgpu" | "wasm";
  modelName: string;
  isLoaded: boolean;
}

/**
 * Check browser neural hardware capabilities
 */
export function checkNeuralHardware(): { webgpu: boolean } {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return { webgpu: false };
  }
  return {
    webgpu: Boolean((navigator as any).gpu),
  };
}

/**
 * Returns diagnostic info about the Real-ESRGAN engine
 */
export function getNeuralEngineInfo(): NeuralEngineInfo {
  const hw = checkNeuralHardware();
  return {
    isSupported: typeof window !== "undefined",
    webgpuAvailable: hw.webgpu,
    activeProvider: cachedProvider,
    modelName: "Real-ESRGAN General x4v3 (ONNX)",
    isLoaded: cachedSession !== null,
  };
}

/**
 * Initialize or retrieve the cached Real-ESRGAN ONNX session
 */
export async function getRealEsrganSession(
  onStatusUpdate?: (status: string) => void
): Promise<{ session: OrtType.InferenceSession; provider: "webgpu" | "wasm" }> {
  if (cachedSession) {
    return { session: cachedSession, provider: cachedProvider };
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    if (onStatusUpdate) onStatusUpdate("Loading ONNX Runtime Web...");

    if (!ortInstance) {
      const ortModule = await import("onnxruntime-web");
      ortInstance = (ortModule.default || ortModule) as typeof OrtType;
    }

    const ort = ortInstance;

    // Configure WASM paths
    if (typeof window !== "undefined") {
      try {
        ort.env.wasm.wasmPaths = "/models/ort/";
        ort.env.wasm.numThreads = Math.min(
          4,
          typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 2 : 2
        );
        ort.env.wasm.simd = true;
      } catch (e) {
        console.warn("WASM configuration notice:", e);
      }
    }

    const modelLocalPath = "/models/realesr-general-x4v3.onnx";
    const modelCdnPath =
      "https://huggingface.co/Heliosoph/realesrgan-onnx/resolve/main/realesr-general-x4v3.onnx";

    const hw = checkNeuralHardware();
    let session: OrtType.InferenceSession | null = null;
    let providerUsed: "webgpu" | "wasm" = "wasm";

    // 1. Try WebGPU first if supported
    if (hw.webgpu) {
      try {
        if (onStatusUpdate) onStatusUpdate("Compiling WebGPU neural shaders...");
        session = await ort.InferenceSession.create(modelLocalPath, {
          executionProviders: ["webgpu"],
          graphOptimizationLevel: "all",
        });
        providerUsed = "webgpu";
      } catch (webgpuErr) {
        console.warn("WebGPU initialization failed, falling back to WASM:", webgpuErr);
      }
    }

    // 2. Fallback to WASM
    if (!session) {
      if (onStatusUpdate) onStatusUpdate("Initializing WASM neural engine...");
      try {
        session = await ort.InferenceSession.create(modelLocalPath, {
          executionProviders: ["wasm"],
          graphOptimizationLevel: "all",
        });
        providerUsed = "wasm";
      } catch (localErr) {
        console.warn("Local model load failed, attempting CDN fallback:", localErr);
        if (onStatusUpdate) onStatusUpdate("Downloading Real-ESRGAN weights...");
        session = await ort.InferenceSession.create(modelCdnPath, {
          executionProviders: ["wasm"],
          graphOptimizationLevel: "all",
        });
        providerUsed = "wasm";
      }
    }

    cachedSession = session;
    cachedProvider = providerUsed;
    return { session, provider: providerUsed };
  })();

  try {
    return await initPromise;
  } finally {
    initPromise = null;
  }
}

/**
 * Runs Real-ESRGAN 4x super-resolution on an individual image patch/tile.
 * Input format: [1, 3, height, width] with float32 in [0, 1]
 * Output format: [1, 3, 4*height, 4*width] with float32 in [0, 1]
 */
async function runTileInference(
  session: OrtType.InferenceSession,
  ort: typeof OrtType,
  tileData: ImageData
): Promise<{ data: Float32Array; width: number; height: number }> {
  const { width, height, data } = tileData;
  const channelSize = width * height;
  const floatArr = new Float32Array(3 * channelSize);

  // RGB planar layout [1, 3, H, W]
  for (let i = 0; i < channelSize; i++) {
    const px = i * 4;
    floatArr[i] = data[px] / 255.0; // R
    floatArr[channelSize + i] = data[px + 1] / 255.0; // G
    floatArr[2 * channelSize + i] = data[px + 2] / 255.0; // B
  }

  const tensor = new ort.Tensor("float32", floatArr, [1, 3, height, width]);
  const inputName = session.inputNames[0] || "input";
  const outputName = session.outputNames[0] || "output";

  const results = await session.run({ [inputName]: tensor });
  const outTensor = results[outputName];
  const outData = outTensor.data as Float32Array;

  return {
    data: outData,
    width: width * 4,
    height: height * 4,
  };
}

/**
 * Seamless Tiled Real-ESRGAN Neural Super-Resolution
 * Automatically divides large images into memory-safe tiles,
 * runs deep-learning super-resolution, and seamlessly blends borders.
 */
export async function realEsrganUpscale(
  sourceCanvas: HTMLCanvasElement,
  scale: 2 | 4,
  onProgress?: (progress: number, statusText?: string) => void
): Promise<HTMLCanvasElement> {
  const { session, provider } = await getRealEsrganSession((status) => {
    if (onProgress) onProgress(0.1, status);
  });

  const ort = ortInstance!;
  const srcW = sourceCanvas.width;
  const srcH = sourceCanvas.height;

  const srcCtx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!srcCtx) throw new Error("Could not acquire 2D source context");

  const dstW = srcW * 4;
  const dstH = srcH * 4;

  const outCanvas4x = document.createElement("canvas");
  outCanvas4x.width = dstW;
  outCanvas4x.height = dstH;
  const outCtx = outCanvas4x.getContext("2d", { willReadFrequently: true });
  if (!outCtx) throw new Error("Could not acquire 2D target context");

  // If small enough, run whole image in single inference pass
  if (srcW <= 256 && srcH <= 256) {
    if (onProgress) {
      onProgress(
        0.3,
        `Neural Super-Resolution (${provider.toUpperCase()})...`
      );
    }

    const srcImgData = srcCtx.getImageData(0, 0, srcW, srcH);
    const { data: outFloats, width: outW, height: outH } = await runTileInference(
      session,
      ort,
      srcImgData
    );

    const outImgData = outCtx.createImageData(outW, outH);
    const outPx = outImgData.data;
    const chSize = outW * outH;

    for (let i = 0; i < chSize; i++) {
      const idx = i * 4;
      outPx[idx] = Math.max(0, Math.min(255, Math.round(outFloats[i] * 255)));
      outPx[idx + 1] = Math.max(0, Math.min(255, Math.round(outFloats[chSize + i] * 255)));
      outPx[idx + 2] = Math.max(0, Math.min(255, Math.round(outFloats[2 * chSize + i] * 255)));
      outPx[idx + 3] = 255;
    }

    outCtx.putImageData(outImgData, 0, 0);
  } else {
    // Tiled Processing for larger images to prevent WebGPU/WASM out-of-memory
    const tileSize = 192;
    const tilePad = 16;
    const stride = tileSize - 2 * tilePad; // 160px step

    const xPoints: number[] = [];
    for (let x = 0; x < srcW; x += stride) {
      if (x + tileSize >= srcW) {
        xPoints.push(Math.max(0, srcW - tileSize));
        break;
      }
      xPoints.push(x);
    }

    const yPoints: number[] = [];
    for (let y = 0; y < srcH; y += stride) {
      if (y + tileSize >= srcH) {
        yPoints.push(Math.max(0, srcH - tileSize));
        break;
      }
      yPoints.push(y);
    }

    const totalTiles = xPoints.length * yPoints.length;
    let completedTiles = 0;

    // Accumulators for linear trapezoidal overlap blending
    const accR = new Float32Array(dstW * dstH);
    const accG = new Float32Array(dstW * dstH);
    const accB = new Float32Array(dstW * dstH);
    const weightSum = new Float32Array(dstW * dstH);

    const pad4 = tilePad * 4;

    for (let yi = 0; yi < yPoints.length; yi++) {
      const y0 = yPoints[yi];
      const th = Math.min(tileSize, srcH - y0);

      for (let xi = 0; xi < xPoints.length; xi++) {
        const x0 = xPoints[xi];
        const tw = Math.min(tileSize, srcW - x0);

        if (onProgress) {
          const pct = 0.2 + (completedTiles / totalTiles) * 0.75;
          onProgress(
            pct,
            `Real-ESRGAN Tile ${completedTiles + 1}/${totalTiles} (${provider.toUpperCase()})`
          );
        }

        const tileSrcData = srcCtx.getImageData(x0, y0, tw, th);
        const { data: tileOutFloats, width: outTw, height: outTh } = await runTileInference(
          session,
          ort,
          tileSrcData
        );

        const outDstX = x0 * 4;
        const outDstY = y0 * 4;
        const tileChSize = outTw * outTh;

        // Blend tile into canvas accumulators using trapezoidal edge feathering
        for (let ty = 0; ty < outTh; ty++) {
          let wy = 1;
          if (y0 > 0 && ty < pad4) {
            wy = (ty + 1) / pad4;
          }
          if (y0 + th < srcH && ty >= outTh - pad4) {
            wy = (outTh - ty) / pad4;
          }

          const globalY = outDstY + ty;
          const globalRowOffset = globalY * dstW;
          const tileRowOffset = ty * outTw;

          for (let tx = 0; tx < outTw; tx++) {
            let wx = 1;
            if (x0 > 0 && tx < pad4) {
              wx = (tx + 1) / pad4;
            }
            if (x0 + tw < srcW && tx >= outTw - pad4) {
              wx = (outTw - tx) / pad4;
            }

            const w = Math.max(0.005, wx * wy);
            const globalIdx = globalRowOffset + (outDstX + tx);
            const tileIdx = tileRowOffset + tx;

            accR[globalIdx] += tileOutFloats[tileIdx] * w;
            accG[globalIdx] += tileOutFloats[tileChSize + tileIdx] * w;
            accB[globalIdx] += tileOutFloats[2 * tileChSize + tileIdx] * w;
            weightSum[globalIdx] += w;
          }
        }

        completedTiles++;
      }
    }

    // Normalize weights and write to destination canvas
    if (onProgress) onProgress(0.95, "Assembling neural super-resolution canvas...");
    const finalImgData = outCtx.createImageData(dstW, dstH);
    const finalPx = finalImgData.data;

    for (let i = 0; i < dstW * dstH; i++) {
      const w = weightSum[i] || 1;
      const pxIdx = i * 4;
      finalPx[pxIdx] = Math.max(0, Math.min(255, Math.round((accR[i] / w) * 255)));
      finalPx[pxIdx + 1] = Math.max(0, Math.min(255, Math.round((accG[i] / w) * 255)));
      finalPx[pxIdx + 2] = Math.max(0, Math.min(255, Math.round((accB[i] / w) * 255)));
      finalPx[pxIdx + 3] = 255;
    }

    outCtx.putImageData(finalImgData, 0, 0);
  }

  // If user requested 4x, return the 4x canvas directly
  if (scale === 4) {
    if (onProgress) onProgress(1.0, "Complete");
    return outCanvas4x;
  }

  // If user requested 2x, downsample the 4x Real-ESRGAN output by half
  // This yields razor-sharp, anti-aliased 2x super-resolution
  if (onProgress) onProgress(0.98, "Rescaling to 2x super-resolution...");
  const canvas2x = document.createElement("canvas");
  canvas2x.width = srcW * 2;
  canvas2x.height = srcH * 2;
  const ctx2x = canvas2x.getContext("2d", { willReadFrequently: true });
  if (!ctx2x) return outCanvas4x;

  ctx2x.imageSmoothingEnabled = true;
  ctx2x.imageSmoothingQuality = "high";
  ctx2x.drawImage(outCanvas4x, 0, 0, canvas2x.width, canvas2x.height);

  if (onProgress) onProgress(1.0, "Complete");
  return canvas2x;
}
