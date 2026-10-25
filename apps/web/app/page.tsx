import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Switchr — Tactile Swiss Studio (Client-Side WASM Engine)",
  description:
    "Tactile Swiss Studio by Switchr. 100% private, client-side WebAssembly media converter, 14-band photo enhancer, PDF vector suite, adaptive compressor, and ZIP inspector.",
};

export default function HomePage() {
  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-[#0E0D0B] overflow-hidden">
      <iframe
        src="/studio.html"
        className="w-full h-full border-0 block"
        title="Switchr — Tactile Swiss Studio"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}
