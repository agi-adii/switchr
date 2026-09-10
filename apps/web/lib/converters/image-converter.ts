export interface ImageConvertOptions {
  toFormat: string; // "webp" | "png" | "jpg" | "jpeg" | "bmp"
  quality?: number; // 0.1 to 1.0
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
}

export async function getImageMetadata(file: File): Promise<ImageMetadata> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const isHeic = ext === "heic" || ext === "heif" || file.type === "image/heic" || file.type === "image/heif";

  let sourceBlob: Blob = file;
  if (isHeic) {
    try {
      const heic2anyModule = await import("heic2any");
      const heic2any = heic2anyModule.default || heic2anyModule;
      const converted = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.1,
      });
      sourceBlob = Array.isArray(converted) ? converted[0] : converted;
    } catch {
      return {
        width: 0,
        height: 0,
        format: "HEIC",
        size: file.size,
      };
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(sourceBlob);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        format: file.name.split(".").pop()?.toUpperCase() || "IMAGE",
        size: file.size,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to decode image metadata"));
    };

    img.src = url;
  });
}

export async function convertImage(
  file: File,
  options: ImageConvertOptions,
  onProgress?: (p: number) => void
): Promise<{ blob: Blob; url: string; newSize: number; width: number; height: number }> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const isHeic = ext === "heic" || ext === "heif" || file.type === "image/heic" || file.type === "image/heif";

  let sourceBlob: Blob = file;
  if (isHeic) {
    if (onProgress) onProgress(0.15);
    try {
      const heic2anyModule = await import("heic2any");
      const heic2any = heic2anyModule.default || heic2anyModule;
      const converted = await heic2any({
        blob: file,
        toType: options.toFormat.toLowerCase() === "png" ? "image/png" : "image/jpeg",
        quality: options.quality ?? 0.92,
      });
      sourceBlob = Array.isArray(converted) ? converted[0] : converted;
    } catch (heicErr) {
      console.error("HEIC decoding error:", heicErr);
      throw new Error(`Failed to decode HEIC file "${file.name}". Please ensure it is a valid HEIC/HEIF photo.`);
    }
  }

  return new Promise((resolve, reject) => {
    if (onProgress) onProgress(0.3);

    const img = new Image();
    const objectUrl = URL.createObjectURL(sourceBlob);

    img.onload = () => {
      try {
        if (onProgress) onProgress(0.5);

        let targetWidth = options.width || img.naturalWidth;
        let targetHeight = options.height || img.naturalHeight;

        if (options.maintainAspectRatio && (options.width || options.height)) {
          const ratio = img.naturalWidth / img.naturalHeight;
          if (options.width && !options.height) {
            targetHeight = Math.round(options.width / ratio);
          } else if (options.height && !options.width) {
            targetWidth = Math.round(options.height * ratio);
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Unable to create 2D canvas context");
        }

        // Fill white background for formats that don't support alpha channel (like JPG)
        const formatNormalized = options.toFormat.toLowerCase();
        if (formatNormalized === "jpg" || formatNormalized === "jpeg" || formatNormalized === "bmp") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        let mimeType = "image/png";
        if (formatNormalized === "jpg" || formatNormalized === "jpeg") {
          mimeType = "image/jpeg";
        } else if (formatNormalized === "webp") {
          mimeType = "image/webp";
        } else if (formatNormalized === "bmp") {
          mimeType = "image/bmp";
        }

        const quality = options.quality ?? 0.92;

        if (onProgress) onProgress(0.8);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);
            if (!blob) {
              reject(new Error(`Failed to encode image to ${options.toFormat}`));
              return;
            }

            if (onProgress) onProgress(1.0);
            const outputUrl = URL.createObjectURL(blob);
            resolve({
              blob,
              url: outputUrl,
              newSize: blob.size,
              width: targetWidth,
              height: targetHeight,
            });
          },
          mimeType,
          quality
        );
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load source image into canvas"));
    };

    img.src = objectUrl;
  });
}
