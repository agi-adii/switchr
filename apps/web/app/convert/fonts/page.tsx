"use client";

import { ConverterTemplate } from "@/components/converter-template";
import { fontToTtf, fontToOtf, fontToWoff } from "@/lib/converters/font-converter";

export default function FontConverterPage() {
  const handleConvert = async (
    file: File,
    toFormat: string,
    onProgress: (p: number) => void
  ) => {
    onProgress(0.2);
    let blob: Blob;

    if (toFormat === "ttf") {
      blob = await fontToTtf(file);
    } else if (toFormat === "otf") {
      blob = await fontToOtf(file);
    } else {
      blob = await fontToWoff(file);
    }

    onProgress(1.0);

    return {
      url: URL.createObjectURL(blob),
      newSize: blob.size,
    };
  };

  return (
    <ConverterTemplate
      title="Font Converter"
      description="Convert typography and font files between TTF, OTF, and WOFF formats directly in your browser."
      breadcrumbs={[{ label: "Convert", href: "/convert" }, { label: "Fonts" }]}
      accept=".ttf,.otf,.woff,.woff2"
      recommendedFormats={["woff", "ttf", "otf"]}
      defaultTarget="woff"
      category="font"
      onConvert={handleConvert}
    />
  );
}
