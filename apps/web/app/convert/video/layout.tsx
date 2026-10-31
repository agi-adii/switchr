import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchrx.vercel.app";

export const metadata: Metadata = {
  title: "Free Video Converter Online - MP4, WebM, MOV, AVI to GIF",
  description:
    "Convert video formats in your browser with hardware-accelerated WebAssembly FFmpeg. Convert MP4 to WebM, MOV to MP4, video to GIF, and extract MP3 audio free.",
  keywords: [
    "video converter online",
    "free video converter",
    "mp4 to webm",
    "mov to mp4",
    "webm to mp4",
    "video to gif",
    "mp4 to mp3",
    "gif to mp4",
    "mkv to mp4",
    "extract audio from video",
    "switchr video converter",
  ],
  alternates: {
    canonical: `${siteUrl}/convert/video`,
  },
  openGraph: {
    title: "Free Video Converter Online - MP4, WebM, MOV, GIF | Switchr",
    description: "Convert video formats with WebAssembly & WebCodecs. 100% private, client-side video conversion with zero server uploads.",
    url: `${siteUrl}/convert/video`,
    siteName: "Switchr",
    type: "website",
    images: [
      {
        url: "/api/og?title=Free%20Video%20Converter&subtitle=Convert%20MP4%2C%20WebM%2C%20MOV%2C%20Video%20to%20GIF%20Locally%20with%20FFmpeg",
        width: 1200,
        height: 630,
        alt: "Switchr Video Converter - Free In-Browser Video Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Video Converter Online - MP4, WebM, MOV, GIF | Switchr",
    description: "Convert video formats with WebAssembly. 100% private, client-side video conversion.",
    images: ["/api/og?title=Free%20Video%20Converter&subtitle=Convert%20MP4%2C%20WebM%2C%20MOV%2C%20Video%20to%20GIF%20Locally%20with%20FFmpeg"],
  },
};

export default function ConvertVideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
