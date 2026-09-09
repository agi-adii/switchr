import JSZip from "jszip";

export interface ZipEntry {
  name: string;
  size: number;
  date: Date;
  blob: Blob;
}

export async function createZip(
  files: { name: string; file: Blob | File }[],
  onProgress?: (percent: number) => void
): Promise<Blob> {
  const zip = new JSZip();

  files.forEach(({ name, file }) => {
    zip.file(name, file);
  });

  return zip.generateAsync(
    {
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      if (onProgress) onProgress(metadata.percent);
    }
  );
}

export async function extractZip(
  zipFile: File,
  onProgress?: (percent: number) => void
): Promise<ZipEntry[]> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(zipFile);
  const entries: ZipEntry[] = [];
  const fileNames = Object.keys(loadedZip.files);

  let processed = 0;
  for (const filename of fileNames) {
    const item = loadedZip.files[filename];
    if (!item.dir) {
      const blob = await item.async("blob");
      entries.push({
        name: filename,
        size: blob.size,
        date: item.date,
        blob,
      });
    }
    processed++;
    if (onProgress) onProgress(Math.round((processed / fileNames.length) * 100));
  }

  return entries;
}
