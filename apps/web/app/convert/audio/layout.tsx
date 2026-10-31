import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchrx.vercel.app";

export const metadata: Metadata = {
  title: "Free Audio Converter Online - MP3, WAV, FLAC, OGG, AAC",
  description:
    "Convert audio files with studio fidelity directly in your browser. Convert WAV to MP3, MP3 to WAV, FLAC to MP3, and customize bitrates with zero uploads.",
  keywords: [
    "audio converter online",
    "free audio converter",
    "mp3 converter",
    "wav to mp3",
    "mp3 to wav",
    "flac to mp3",
    "ogg to mp3",
    "audio bitrate optimizer",
    "extract audio free",
    "switchr audio converter",
  ],
  alternates: {
    canonical: `${siteUrl}/convert/audio`,
  },
  openGraph: {
    title: "Free High-Fidelity Audio Converter Online | Switchr",
    description: "Convert WAV, MP3, FLAC, AAC, and OGG audio tracks right in your browser with zero server uploads.",
    url: `${siteUrl}/convert/audio`,
    siteName: "Switchr",
    type: "website",
    images: [
      {
        url: "/api/og?title=Free%20Audio%20Converter&subtitle=Lossless%20WAV%2C%20MP3%2C%20FLAC%2C%20AAC%20%26%20OGG%20Audio%20Transcoding",
        width: 1200,
        height: 630,
        alt: "Switchr Audio Converter - Free In-Browser Audio Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free High-Fidelity Audio Converter Online | Switchr",
    description: "Convert WAV, MP3, FLAC, AAC, and OGG audio tracks right in your browser.",
    images: ["/api/og?title=Free%20Audio%20Converter&subtitle=Lossless%20WAV%2C%20MP3%2C%20FLAC%2C%20AAC%20%26%20OGG%20Audio%20Transcoding"],
  },
};

export default function ConvertAudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
