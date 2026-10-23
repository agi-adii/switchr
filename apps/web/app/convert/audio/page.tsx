"use client";

import { useState } from "react";
import { ConverterTemplate } from "@/components/converter-template";
import { loadFfmpeg, convertFile } from "@/lib/ffmpeg";

export default function AudioConverterPage() {
  const [bitrate, setBitrate] = useState("192k");
  const [sampleRate, setSampleRate] = useState("44100");

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
    <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/40 border border-border text-xs">
      <div>
        <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
          Audio Bitrate
        </label>
        <select
          value={bitrate}
          onChange={(e) => setBitrate(e.target.value)}
          className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs"
        >
          <option value="128k">128 kbps (Standard)</option>
          <option value="192k">192 kbps (High Quality)</option>
          <option value="256k">256 kbps (Very High)</option>
          <option value="320k">320 kbps (Maximum Studio)</option>
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
          Sample Rate
        </label>
        <select
          value={sampleRate}
          onChange={(e) => setSampleRate(e.target.value)}
          className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs"
        >
          <option value="44100">44.1 kHz (CD Quality)</option>
          <option value="48000">48.0 kHz (Broadcast)</option>
        </select>
      </div>
    </div>
  );

  return (
    <ConverterTemplate
      title="Audio Converter"
      description="Convert audio tracks between MP3, WAV, AAC, and other formats client-side using FFmpeg."
      breadcrumbs={[{ label: "Convert", href: "/convert" }, { label: "Audio" }]}
      accept="audio/*"
      recommendedFormats={["mp3", "wav", "aac"]}
      defaultTarget="mp3"
      category="audio"
      advancedOptionsNode={advancedOptions}
      onConvert={handleConvert}
    />
  );
}
