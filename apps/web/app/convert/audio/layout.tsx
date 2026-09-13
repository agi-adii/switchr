import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Audio Converter - MP3, WAV, OGG, FLAC, AAC",
  description:
    "Convert audio files with high fidelity directly in your browser. Convert WAV to MP3, FLAC to MP3, and audio tracks effortlessly.",
  keywords: [
    "audio converter",
    "mp3 converter",
    "wav to mp3",
    "flac to mp3",
    "ogg to mp3",
    "free audio converter",
    "extract audio from video",
  ],
  alternates: {
    canonical: "/convert/audio",
  },
  openGraph: {
    title: "Free High-Fidelity Audio Converter | Switchr",
    description: "Convert WAV, MP3, FLAC, AAC, and OGG audio tracks right in your browser.",
    url: "/convert/audio",
  },
};

export default function ConvertAudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
