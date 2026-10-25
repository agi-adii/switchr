import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Subtitle Converter - SRT, VTT, ASS",
  description:
    "Convert subtitle files between SRT, WebVTT (VTT), and Advanced SubStation Alpha (ASS) formats online in your browser.",
  keywords: [
    "subtitle converter",
    "srt to vtt",
    "vtt to srt",
    "srt to ass",
    "vtt converter",
    "free subtitle converter",
  ],
  alternates: {
    canonical: "https://switchrx.vercel.app/convert/subtitles",
  },
  openGraph: {
    title: "Free Online Subtitle Converter | Switchr",
    description: "Convert SRT, VTT, and ASS subtitle files right in your browser.",
    url: "https://switchrx.vercel.app/convert/subtitles",
  },
};

export default function SubtitlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
