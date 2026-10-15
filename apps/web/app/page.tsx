import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Switchr — Tactile Swiss Studio (Client-Side WASM Engine)",
  description:
    "Tactile Swiss Studio by Switchr. 100% private, client-side WebAssembly media converter, 14-band photo enhancer, PDF vector suite, adaptive compressor, and ZIP inspector.",
};

export default function HomePage() {
  redirect("/studio.html");
}
