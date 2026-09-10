"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  ShieldCheck,
  Server,
  Laptop,
  ArrowRight,
  Lock,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  HardDrive,
} from "lucide-react";

export function PrivacyArchitectureGraphic() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <p className="text-xs font-black uppercase tracking-widest text-primary">
          Privacy By Architecture
        </p>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Why Client-Side Conversion Matters
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Most online converters secretly upload your documents, photos, and media to unknown cloud servers. Switchr transforms your files locally inside your browser sandbox.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Legacy Cloud Converter Diagram Card */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-3xl border border-red-500/20 bg-red-950/5 dark:bg-red-950/10 p-6 sm:p-7 backdrop-blur-sm space-y-6 overflow-hidden flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-extrabold">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Traditional Cloud Converters</span>
              </span>
              <span className="text-xs font-bold text-red-500/80">High Risk</span>
            </div>

            <div className="space-y-3 pt-2">
              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-background/50 border border-red-500/10">
                <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-foreground block font-bold">Uploaded to Remote Servers</strong>
                  <span className="text-muted-foreground">Your confidential contracts, selfies, or scans traverse public internet servers.</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-background/50 border border-red-500/10">
                <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-foreground block font-bold">Server Queue & Artificial Delays</strong>
                  <span className="text-muted-foreground">Forced waiting timers and paywalls designed to sell monthly subscription plans.</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-background/50 border border-red-500/10">
                <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-foreground block font-bold">Storage & Data Retention Risks</strong>
                  <span className="text-muted-foreground">Files cached on unknown data centers with unknown retention policies.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-red-500/15 flex items-center justify-between text-xs text-red-400 font-semibold">
            <span>Bandwidth Consumption: High</span>
            <span>Privacy Score: 0%</span>
          </div>
        </motion.div>

        {/* Switchr Client-Side Engine Card */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-3xl border border-emerald-500/30 bg-emerald-950/5 dark:bg-emerald-950/15 p-6 sm:p-7 backdrop-blur-sm space-y-6 overflow-hidden flex flex-col justify-between shadow-lg shadow-emerald-500/5"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-xs font-extrabold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Switchr Local Engine</span>
              </span>
              <span className="text-xs font-bold text-emerald-500">100% Private</span>
            </div>

            <div className="space-y-3 pt-2">
              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-background/70 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-foreground block font-bold">0 Bytes Leave Your Device</strong>
                  <span className="text-muted-foreground">Files are read and processed directly in your browser's private WebAssembly memory.</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-background/70 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-foreground block font-bold">Hardware Acceleration & Zero Queues</strong>
                  <span className="text-muted-foreground">Conversions run at the speed of your device CPU/GPU with no server bottlenecks.</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-background/70 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-foreground block font-bold">No Limits & Works Completely Offline</strong>
                  <span className="text-muted-foreground">Convert 100MB, 1GB or unlimited files without hitting payment walls or logins.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-500/20 flex items-center justify-between text-xs text-emerald-400 font-bold">
            <span>Bandwidth Consumption: 0 KB</span>
            <span>Privacy Score: 100% Guaranteed</span>
          </div>
        </motion.div>
      </div>

      {/* Visual Infographic Pillars with Generated 3D Graphics */}
      <div className="grid sm:grid-cols-3 gap-4 pt-2">
        {/* Graphic Pillar 1 */}
        <div className="relative rounded-2xl border border-border/80 bg-card/80 p-4 flex flex-col items-center text-center gap-3 overflow-hidden group">
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-500">
            <Image
              src="/graphics/graphic-vault.jpg"
              alt="Client-Side Encrypted Vault"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-extrabold text-foreground text-sm">Air-Gapped Sandbox</h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              Your data is isolated in the browser sandbox. Even with internet disconnected, conversions succeed.
            </p>
          </div>
        </div>

        {/* Graphic Pillar 2 */}
        <div className="relative rounded-2xl border border-border/80 bg-card/80 p-4 flex flex-col items-center text-center gap-3 overflow-hidden group">
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-500">
            <Image
              src="/graphics/graphic-speed.jpg"
              alt="WebAssembly Quantum Speed"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-extrabold text-foreground text-sm">WASM Fast-Path</h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              C/C++ native binaries compiled to WebAssembly run at near-native hardware execution speed.
            </p>
          </div>
        </div>

        {/* Graphic Pillar 3 */}
        <div className="relative rounded-2xl border border-border/80 bg-card/80 p-4 flex flex-col items-center text-center gap-3 overflow-hidden group">
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-500">
            <Image
              src="/graphics/graphic-unlimited.jpg"
              alt="Unlimited Batch Processing"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-extrabold text-foreground text-sm">Infinite Throughput</h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              Batch convert hundreds of documents or photos simultaneously without quotas or subscriptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
