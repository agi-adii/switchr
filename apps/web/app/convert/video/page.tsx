"use client";

import { useState } from "react";
import { ConverterTemplate } from "@/components/converter-template";
import { loadFfmpeg, convertFile } from "@/lib/ffmpeg";

export default function VideoConverterPage() {
  const [preset, setPreset] = useState("balanced");

  const handleConvert = async (
    file: File,
    toFormat: string,
    onProgress: (p: number) => void
  ) => {
    const ffmpeg = await loadFfmpeg();
    const url = await convertFile(ffmpeg, file, toFormat, onProgress);
    return { url };
  };

  const advancedOptions = (
    <div className="space-y-3 p-4 rounded-2xl bg-muted/40 border border-border text-xs">
      <label className="block text-[11px] font-semibold text-muted-foreground">
        Encoding Preset:
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {[
          { id: "original", label: "Original" },
          { id: "high", label: "High Quality" },
          { id: "balanced", label: "Balanced" },
          { id: "small", label: "Small File" },
          { id: "mobile", label: "Mobile" },
        ].map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPreset(p.id)}
            className={`py-1.5 px-2 rounded-lg text-center font-semibold text-[11px] border transition-colors ${
              preset === p.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border text-foreground hover:bg-muted"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <ConverterTemplate
      title="Video Converter"
      description="Convert video files into MP4, WebM, animated GIFs, or extract sound directly in your browser."
      breadcrumbs={[{ label: "Convert", href: "/convert" }, { label: "Video" }]}
      accept="video/*"
      recommendedFormats={["mp4", "webm", "mp3", "gif"]}
      moreFormats={["mov", "mkv", "wav"]}
      defaultTarget="mp4"
      category="video"
      advancedOptionsNode={advancedOptions}
      onConvert={handleConvert}
    />
  );
}
