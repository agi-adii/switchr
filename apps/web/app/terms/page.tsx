import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FileText, CheckCircle2, AlertCircle, Shield, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Switchr",
  description:
    "Terms of service for Switchr. A free public client-side file transformation and PDF utility platform.",
  alternates: {
    canonical: "https://switchrx.vercel.app/terms",
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-10">
      <Breadcrumbs items={[{ label: "Terms of Service" }]} />

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
          <Scale className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Last revised: October 2026. Please read these terms carefully before using Switchr.
        </p>
      </div>

      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        {/* Section 1 */}
        <section className="p-6 rounded-2xl bg-card border border-border space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using Switchr (https://switchrx.vercel.app), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should discontinue use of the platform immediately.
          </p>
        </section>

        {/* Section 2 */}
        <section className="p-6 rounded-2xl bg-card border border-border space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            2. Nature of Service &amp; Local Processing
          </h2>
          <p>
            Switchr provides browser-based utilities for transforming, converting, compressing, and editing media files. All core operations execute directly on the end-user&apos;s computing device using client-side technologies including HTML5, Canvas, and WebAssembly. Switchr does not host, transfer, inspect, or manage copies of your processed files.
          </p>
        </section>

        {/* Section 3 */}
        <section className="p-6 rounded-2xl bg-card border border-border space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500" />
            3. Permitted Use &amp; Intellectual Property
          </h2>
          <p>
            You agree to use Switchr only for lawful purposes. You represent and warrant that you own or possess the necessary rights, licenses, or permissions to process any files you load into the tool. You may not use Switchr to infringe on intellectual property rights or violate applicable laws.
          </p>
        </section>

        {/* Section 4 */}
        <section className="p-6 rounded-2xl bg-card border border-border space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            4. Disclaimer of Warranties
          </h2>
          <p>
            Switchr is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express, implied, or statutory, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
          </p>
          <p>
            Because conversion and compression performance depends on your local device hardware, memory, and browser environment, we do not guarantee uninterrupted availability or error-free processing for damaged or corrupted files.
          </p>
        </section>

        {/* Section 5 */}
        <section className="p-6 rounded-2xl bg-card border border-border space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Scale className="w-4 h-4 text-purple-500" />
            5. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, in no event shall Switchr, its developers, or contributors be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or media arising out of your access to or use of the platform.
          </p>
        </section>
      </div>
    </div>
  );
}
