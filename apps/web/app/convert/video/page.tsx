import { ToolJsonLd } from "@/components/seo/json-ld";
import { ToolSeoContent } from "@/components/seo/tool-seo-content";
"use client";

import { useState } from "react";
import { ConverterTemplate } from "@/components/converter-template";
import { loadFfmpeg, convertFile } from "@/lib/ffmpeg";
import { convertVideoToGif } from "@/lib/converters/video-gif-converter";


const VIDEO_HOW_TO_STEPS = [
  {
    name: "Upload Video File",
    text: "Drag and drop your MP4, MOV, WebM, AVI, or MKV video recording into the converter workspace.",
  },
  {
    name: "Select Target Video Container",
    text: "Choose MP4 for universal compatibility, WebM for web streaming, GIF for animated loops, or MP3 to extract pure audio.",
  },
  {
    name: "Download Converted Media",
    text: "Click convert to transcode frames with in-browser FFmpeg WebAssembly and download your converted video immediately.",
  },
];

const VIDEO_FAQS = [
  {
    question: "How does in-browser video conversion work without cloud servers?",
    answer: "Switchr compiles FFmpeg—the world's most powerful open-source media library—directly into WebAssembly (WASM). Your computer or phone's CPU executes the video decoding and encoding locally without network latency.",
  },
  {
    question: "Can I convert Apple QuickTime MOV clips to MP4 on Windows?",
    answer: "Yes! Switchr converts Apple iPhone and Mac QuickTime .mov recordings directly into standard H.264 MP4 videos that play on Windows, Android, TVs, and all web platforms.",
  },
  {
    question: "Can I turn video clips into animated looping GIFs?",
    answer: "Yes! Select GIF as the output format, and Switchr analyzes your video frames to generate an adaptive 256-color palette with dithering for smooth, shareable GIFs.",
  },
  {
    question: "How do I extract audio sound from a video clip?",
    answer: "Select MP3 or WAV as your target format. Switchr strips video streams and exports high-bitrate stereo audio in seconds.",
  },
  {
    question: "Are my personal video recordings uploaded anywhere?",
    answer: "Never. All transcoding happens 100% locally in your browser memory sandbox. No video footage is ever stored on any remote server.",
  },
];

export default function VideoConverterPage() {
  const [preset, setPreset] = useState("balanced");

  const handleConvert = async (
    file: File,
    toFormat: string,
    onProgress: (p: number) => void
  ) => {
    if (toFormat.toLowerCase() === "gif") {
      const res = await convertVideoToGif(
        file,
        {
          preset: preset === "high" ? "high" : preset === "small" ? "small" : "balanced",
        },
        onProgress
      );
      return { url: res.url, newSize: res.newSize };
    }

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
    <>
      <ToolJsonLd
        name="Free Online Video Converter"
        description="Convert MP4, WebM, MOV, and MKV videos or extract MP3 audio directly in your browser with FFmpeg WebAssembly."
        url="/convert/video"
        category="MultimediaApplication"
        features={[
          "MP4, WebM, MOV, MKV, and AVI transcoding",
          "Convert video to animated looping GIF",
          "Extract high-bitrate MP3/WAV audio tracks",
          "Quality presets: High, Balanced, Small File, Mobile",
          "100% In-Browser FFmpeg WebAssembly processing",
          "Zero video uploads to cloud servers",
        ]}
        howTo={VIDEO_HOW_TO_STEPS}
        faqs={VIDEO_FAQS}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Convert", url: "/convert" },
          { name: "Video", url: "/convert/video" },
        ]}
      />

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

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
        <ToolSeoContent
          toolName="Switchr Video Converter"
          badge="FFmpeg WASM • 100% Private"
          heading="Free Online Video Converter – MP4, WebM, MOV, AVI to GIF"
          subheading="Transcode video containers and extract audio directly in your browser. Powered by WebAssembly with zero uploads and complete privacy."
          overviewParagraphs={[
            "Switchr's Video Converter harnesses the full power of FFmpeg compiled to WebAssembly, running directly inside your browser tab. Transcode iPhone MOV clips into universally playable MP4s, encode open-standard WebM videos for HTML5 web streaming, turn funny clips into looping GIFs, or extract crystal-clear MP3 sound from recorded lectures.",
            "Because processing occurs locally on your machine, you never have to wait for gigabyte video files to upload over sluggish home connections. Enjoy immediate processing, total security for private video footage, and zero subscription paywalls.",
          ]}
          steps={VIDEO_HOW_TO_STEPS}
          faqs={VIDEO_FAQS}
          relatedLinks={[
            { label: "Convert MP4 to WebM", href: "/convert/mp4-to-webm", desc: "Encode lightweight HTML5 streaming video.", badge: "Fast" },
            { label: "Convert MOV to MP4", href: "/convert/mov-to-mp4", desc: "Universal playback for Apple QuickTime recordings.", badge: "Top" },
            { label: "Convert Video to GIF", href: "/convert/video-to-gif", desc: "Turn video clips into smooth looping GIFs." },
            { label: "Convert MP4 to MP3", href: "/convert/mp4-to-mp3", desc: "Extract soundtracks and spoken dialogue." },
            { label: "Audio Converter", href: "/convert/audio", desc: "Transcode MP3, WAV, FLAC, and AAC tracks." },
            { label: "Smart File Compressor", href: "/compress", desc: "Reduce video and image payloads." },
          ]}
        />
      </div>
    </>
  );
}
