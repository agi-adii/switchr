"use client";

import { useState } from "react";
import { ConverterTemplate } from "@/components/converter-template";
import { convertImage } from "@/lib/converters/image-converter";
import { imagesToPdf } from "@/lib/converters/pdf-tools";
import { Sliders } from "lucide-react";

export default function ImageConverterPage() {
  const [quality, setQuality] = useState(85);
  const [resizeWidth, setResizeWidth] = useState<string>("");
  const [resizeHeight, setResizeHeight] = useState<string>("");

  const handleConvert = async (
    file: File,
    toFormat: string,
    onProgress: (p: number) => void
  ) => {
    if (toFormat === "pdf") {
      const pdfBlob = await imagesToPdf([file], {}, onProgress);
      return {
        url: URL.createObjectURL(pdfBlob),
        newSize: pdfBlob.size,
      };
    }

    const res = await convertImage(
      file,
      {
        toFormat,
        quality: quality / 100,
        width: resizeWidth ? Number(resizeWidth) : undefined,
        height: resizeHeight ? Number(resizeHeight) : undefined,
        maintainAspectRatio: true,
      },
      onProgress
    );

    return {
      url: res.url,
      newSize: res.newSize,
    };
  };

  const advancedOptions = (
    <div className="space-y-4 p-4 rounded-2xl bg-muted/40 border border-border text-xs">
      <div className="space-y-2">
        <div className="flex justify-between font-semibold">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Sliders className="w-3.5 h-3.5" /> Quality Setting:
          </span>
          <span className="font-mono text-primary">{quality}%</span>
        </div>
        <input
          type="range"
          min="20"
          max="100"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>High Compression</span>
          <span>Balanced</span>
          <span>Maximum Quality</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
        <div>
          <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
            Resize Width (px)
          </label>
          <input
            type="number"
            placeholder="Auto"
            value={resizeWidth}
            onChange={(e) => setResizeWidth(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs font-mono"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
            Resize Height (px)
          </label>
          <input
            type="number"
            placeholder="Auto"
            value={resizeHeight}
            onChange={(e) => setResizeHeight(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs font-mono"
          />
        </div>
      </div>
    </div>
  );

  return (
    <ConverterTemplate
      title="Image Converter"
      description="Convert images to JPG, PNG, WEBP and other supported formats with precision quality controls."
      breadcrumbs={[{ label: "Convert", href: "/convert" }, { label: "Images" }]}
      accept="image/*"
      recommendedFormats={["webp", "png", "jpg", "pdf"]}
      moreFormats={["bmp", "gif"]}
      defaultTarget="webp"
      category="image"
      advancedOptionsNode={advancedOptions}
      onConvert={handleConvert}
    />
  );
}
