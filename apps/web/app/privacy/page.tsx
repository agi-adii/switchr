import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ShieldCheck, Lock, EyeOff, Server, HardDrive, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Switchr",
  description:
    "Learn how Switchr protects your privacy. 100% client-side file conversion with zero server uploads, no cookies, and no tracking.",
  alternates: {
    canonical: "https://switchrx.vercel.app/privacy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-10">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero Server Upload Guarantee</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Last updated: October 2026. Switchr was designed from day one to make file conversion completely private and secure.
        </p>
      </div>

      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        {/* Section 1 */}
        <section className="p-6 rounded-2xl bg-card border border-border space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            1. We Never See, Receive, or Store Your Files
          </h2>
          <p>
            When you use Switchr, your files are <strong>never uploaded to our servers or any third-party cloud infrastructure</strong>. All file decoding, transformation, compression, and compilation happen entirely inside your device&apos;s browser memory (RAM) utilizing HTML5 Canvas, the File API, and WebAssembly (WASM).
          </p>
          <p>
            Because zero bytes are transmitted to any remote machine, neither Switchr nor any network intermediary can view, intercept, log, or reconstruct your documents, images, audio, or video files.
          </p>
        </section>

        {/* Section 2 */}
        <section className="p-6 rounded-2xl bg-card border border-border space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-primary" />
            2. No Tracking, No Analytics, No Ad Networks
          </h2>
          <p>
            Switchr does not use Google Analytics, Facebook Pixels, marketing cookies, or tracking beacons. We do not build user behavioral profiles, sell data to data brokers, or monetize through intrusive surveillance advertising.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li><strong>Zero Tracking Cookies:</strong> We do not set persistent tracking cookies on your device.</li>
            <li><strong>Zero Remote File Logs:</strong> We do not log filenames, file sizes, or conversion timestamps on any server.</li>
            <li><strong>No Account Required:</strong> You never need to supply an email address, name, or password to use our tools.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="p-6 rounded-2xl bg-card border border-border space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-amber-500" />
            3. Local Browser Storage
          </h2>
          <p>
            To provide features like conversion history and dark mode preferences, Switchr uses your browser&apos;s local storage (localStorage and IndexedDB). This data resides exclusively on your device and is never sent across the internet. You can clear this data at any time via the History tab or through your browser settings.
          </p>
        </section>

        {/* Section 4 */}
        <section className="p-6 rounded-2xl bg-card border border-border space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Server className="w-4 h-4 text-sky-500" />
            4. Hosting &amp; Static Delivery
          </h2>
          <p>
            Our web application code (HTML, JavaScript, CSS, and WebAssembly binaries) is served statically via Vercel. Standard web server access logs (containing anonymous IP addresses and requested static URLs) may be recorded by the hosting provider solely for denial-of-service mitigation and uptime monitoring, in accordance with Vercel&apos;s privacy policy.
          </p>
        </section>

        {/* Section 5 */}
        <section className="p-6 rounded-2xl bg-card border border-border space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            5. Independent Verification
          </h2>
          <p>
            You can verify our privacy architecture yourself at any moment by opening your browser&apos;s Developer Tools (F12) &gt; Network tab, selecting Fetch/XHR, and performing a conversion. You will observe that zero bytes of file payload leave your machine.
          </p>
        </section>
      </div>
    </div>
  );
}
