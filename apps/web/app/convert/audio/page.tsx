import { ToolJsonLd } from "@/components/seo/json-ld";
import { ToolSeoContent } from "@/components/seo/tool-seo-content";
"use client";

import { useState } from "react";
import { ConverterTemplate } from "@/components/converter-template";
import { loadFfmpeg, convertFile } from "@/lib/ffmpeg";


const AUDIO_HOW_TO_STEPS = [
  {
    name: "Upload Audio Track",
    text: "Select or drop your MP3, WAV, FLAC, OGG, AAC, or M4A audio file into the converter widget.",
  },
  {
    name: "Select Format & Bitrate",
    text: "Choose your destination audio format and customize bitrates (128 kbps to 320 kbps) and sample rates in Advanced Options.",
  },
  {
    name: "Download Studio-Quality Audio",
    text: "Click convert to transcode audio locally with FFmpeg WebAssembly and save your finished audio file immediately.",
  },
];

const AUDIO_FAQS = [
  {
    question: "Can I convert heavy uncompressed WAV files to MP3 to save space?",
    answer: "Yes! Converting studio WAV files to 192k or 320k MP3 typically cuts file size by 85% to 90% while maintaining crisp, high-fidelity acoustic performance.",
  },
  {
    question: "How does in-browser audio transcoding work without server uploads?",
    answer: "Switchr compiles FFmpeg's audio libraries to WebAssembly, processing PCM samples and encoding audio frames directly on your device CPU. No audio data ever leaves your browser.",
  },
  {
    question: "Can I convert FLAC and OGG audio tracks?",
    answer: "Yes! Switchr supports FLAC, OGG, WAV, MP3, AAC, and M4A audio streams with comprehensive codec support.",
  },
  {
    question: "What bitrate should I choose for the best quality?",
    answer: "For general music listening and podcasts, 192 kbps is balanced and efficient. For critical listening or professional DJ sets, select 320 kbps maximum studio quality.",
  },
  {
    question: "Are my private music stems or confidential voice memos safe?",
    answer: "100% confidential. Your audio files are processed inside your browser tab memory sandbox with zero network transmission.",
  },
];

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
    <>
      <ToolJsonLd
        name="Free Online Audio Converter"
        description="Convert audio tracks between MP3, WAV, FLAC, AAC, and OGG formats with custom bitrates directly in your browser."
        url="/convert/audio"
        category="MultimediaApplication"
        features={[
          "MP3, WAV, FLAC, AAC, and OGG audio transcoding",
          "Custom bitrate controls from 128 kbps to 320 kbps",
          "44.1 kHz CD and 48 kHz broadcast sample rates",
          "100% In-Browser FFmpeg WebAssembly processing",
          "Zero audio uploads to cloud servers",
        ]}
        howTo={AUDIO_HOW_TO_STEPS}
        faqs={AUDIO_FAQS}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Convert", url: "/convert" },
          { name: "Audio", url: "/convert/audio" },
        ]}
      />

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

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
        <ToolSeoContent
          toolName="Switchr Audio Converter"
          badge="100% In-Browser & Private"
          heading="Free Online Audio Converter – MP3, WAV, FLAC, OGG & AAC"
          subheading="High-fidelity audio transcoding running directly on your CPU. No file uploads, no subscription fees, and studio-grade audio quality."
          overviewParagraphs={[
            "Switchr's Audio Converter gives musicians, podcasters, editors, and sound designers an instant, client-side utility for transforming audio containers. Compress bloated studio WAV files to lightweight 320 kbps MP3s, transcode lossless FLAC albums for mobile players, or convert voice memos into universally compatible audio tracks.",
            "Because transcoding executes locally via WebAssembly, unreleased audio stems and confidential voice notes remain completely private. Experience zero server wait times, no lossy double-compression, and unlimited conversions forever.",
          ]}
          steps={AUDIO_HOW_TO_STEPS}
          faqs={AUDIO_FAQS}
          relatedLinks={[
            { label: "Convert WAV to MP3", href: "/convert/wav-to-mp3", desc: "Compress uncompressed audio tracks by 90%.", badge: "Popular" },
            { label: "Convert MP3 to WAV", href: "/convert/mp3-to-wav", desc: "Decode audio tracks for DAW audio editing.", badge: "Studio" },
            { label: "Convert MP4 to MP3", href: "/convert/mp4-to-mp3", desc: "Extract sound from video clips and lectures." },
            { label: "Video Converter", href: "/convert/video", desc: "Transcode MP4, WebM, and MOV videos." },
            { label: "Smart File Compressor", href: "/compress", desc: "Reduce file weights with smart quantization." },
            { label: "All File Tools", href: "/tools", desc: "Explore all in-browser productivity utilities." },
          ]}
        />
      </div>
    </>
  );
}
