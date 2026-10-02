import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fast Video Converter - MP4, WebM, MKV, AVI, MOV",
  description:
    "Convert video formats in your browser with hardware acceleration. Convert MP4 to WebM, MOV to MP4, and extract audio with zero server uploads.",
  keywords: [
    "video converter",
    "mp4 converter",
    "mov to mp4",
    "webm to mp4",
    "mkv to mp4",
    "convert video online free",
    "video to gif",
  ],
  alternates: {
    canonical: "https://switchrx.vercel.app/convert/video",
  },
  openGraph: {
    title: "Fast Video Converter Online | Switchr",
    description: "Convert video formats with WebAssembly & WebCodecs. 100% private, client-side video conversion.",
    url: "https://switchrx.vercel.app/convert/video",
    images: [
      {
        url: "/api/og?title=Video%20Converter&badge=WASM%20%2B%20WebCodecs",
        width: 1200,
        height: 630,
        alt: "Switchr Video Converter",
      },
    ],
  },
};

export default function ConvertVideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
