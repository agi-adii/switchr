"use client";

import { ConverterTemplate } from "@/components/converter-template";
import { convertSubtitles } from "@/lib/converters/subtitle-converter";

export default function SubtitlesConverterPage() {
  const handleConvert = async (
    file: File,
    toFormat: string,
    onProgress: (p: number) => void
  ) => {
    onProgress(0.2);
    const text = await file.text();
    onProgress(0.5);

    const ext = file.name.split(".").pop()?.toLowerCase() || "srt";
    const fromFormat = (ext === "vtt" ? "vtt" : ext === "ass" ? "ass" : "srt") as "srt" | "vtt" | "ass";
    const targetFormat = (toFormat === "vtt" ? "vtt" : toFormat === "ass" ? "ass" : "srt") as "srt" | "vtt" | "ass";

    const converted = convertSubtitles(text, fromFormat, targetFormat);
    onProgress(0.9);

    const mimeMap: Record<string, string> = {
      srt: "text/plain",
      vtt: "text/vtt",
      ass: "text/plain",
    };

    const blob = new Blob([converted], { type: mimeMap[targetFormat] || "text/plain" });
    onProgress(1.0);

    return {
      url: URL.createObjectURL(blob),
      newSize: blob.size,
    };
  };

  return (
    <ConverterTemplate
      title="Subtitle Converter"
      description="Convert between SRT, WebVTT (VTT), and Advanced SubStation Alpha (ASS) subtitle formats instantly."
      breadcrumbs={[{ label: "Convert", href: "/convert" }, { label: "Subtitles" }]}
      accept=".srt,.vtt,.ass"
      recommendedFormats={["vtt", "srt", "ass"]}
      defaultTarget="vtt"
      category="subtitle"
      onConvert={handleConvert}
    />
  );
}
