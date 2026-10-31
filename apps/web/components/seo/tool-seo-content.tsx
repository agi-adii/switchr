"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Globe,
  HardDrive,
  Layers,
  FileText,
  Sliders,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ToolSeoStep {
  name: string;
  text: string;
}

export interface ToolSeoFaq {
  question: string;
  answer: string;
}

export interface ToolSeoFeature {
  title: string;
  desc: string;
  icon?: any;
}

export interface ToolSeoComparisonRow {
  feature: string;
  switchrVal: string;
  cloudVal: string;
}

export interface ToolSeoRelatedLink {
  label: string;
  href: string;
  desc?: string;
  badge?: string;
}

export interface ToolSeoContentProps {
  toolName: string;
  badge?: string;
  heading: string;
  subheading: string;
  overviewParagraphs: string[];
  steps: ToolSeoStep[];
  features?: ToolSeoFeature[];
  comparisonRows?: ToolSeoComparisonRow[];
  faqs: ToolSeoFaq[];
  relatedLinks: ToolSeoRelatedLink[];
}

export function ToolSeoContent({
  toolName,
  badge = "100% In-Browser & Private",
  heading,
  subheading,
  overviewParagraphs,
  steps,
  features,
  comparisonRows,
  faqs,
  relatedLinks,
}: ToolSeoContentProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const defaultFeatures: ToolSeoFeature[] = [
    {
      title: "100% Private (Zero Cloud Uploads)",
      desc: "Your files never leave your device. All processing occurs locally in your browser memory sandbox using WebAssembly.",
      icon: Lock,
    },
    {
      title: "No File Size Caps or Paywalls",
      desc: "Unlike traditional cloud converters with 50MB limits, Switchr has no arbitrary file caps. Process as much as your device RAM supports.",
      icon: HardDrive,
    },
    {
      title: "Hardware Accelerated Speed",
      desc: "Leverages multi-threaded WebAssembly and GPU shaders for near-instant rendering without network upload bottlenecks.",
      icon: Zap,
    },
    {
      title: "No Account & No Watermarks",
      desc: "Free public utility with zero registration, no credits, no email verification, and no branded watermarks.",
      icon: ShieldCheck,
    },
    {
      title: "Full Lossless Fidelity",
      desc: "Advanced format algorithms ensure crystal-clear typography, intact color profiles, and preserved transparency.",
      icon: Sparkles,
    },
    {
      title: "Works Offline Anywhere",
      desc: "Install as a Progressive Web App (PWA). Convert, compress, and edit documents on airplanes, trains, or offline sites.",
      icon: Globe,
    },
  ];

  const activeFeatures = features && features.length > 0 ? features : defaultFeatures;

  const defaultComparison: ToolSeoComparisonRow[] = [
    {
      feature: "File Privacy & Storage",
      switchrVal: "100% In-Browser (Zero files uploaded to any server)",
      cloudVal: "Files uploaded to third-party cloud storage",
    },
    {
      feature: "Processing Speed",
      switchrVal: "Instant local CPU/GPU execution (no upload/download queue)",
      cloudVal: "Subject to upload bandwidth and server queues",
    },
    {
      feature: "File Size Restrictions",
      switchrVal: "No arbitrary caps (limited only by device RAM)",
      cloudVal: "Usually capped at 15MB–50MB for free users",
    },
    {
      feature: "Cost & Subscriptions",
      switchrVal: "100% Free forever (No credit card or login needed)",
      cloudVal: "Frequent paywalls, daily quotas, or monthly plans",
    },
    {
      feature: "Offline Compatibility",
      switchrVal: "Yes (Runs completely offline once cached via PWA)",
      cloudVal: "No (Requires constant high-speed internet)",
    },
  ];

  const activeComparison = comparisonRows && comparisonRows.length > 0 ? comparisonRows : defaultComparison;

  return (
    <section className="mt-16 sm:mt-24 space-y-16 border-t border-border/40 pt-16 text-foreground">
      {/* ── 1. Editorial Overview & Topical Authority ── */}
      <div className="space-y-6 max-w-4xl mx-auto text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{badge}</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
          {heading}
        </h2>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {subheading}
        </p>

        <div className="grid grid-cols-1 gap-4 pt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {overviewParagraphs.map((para, i) => (
            <p key={i} className="bg-card/50 border border-border/50 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* ── 2. Step-by-Step How-To Guide (Matches HowTo Schema) ── */}
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center sm:text-left space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Quick Tutorial</p>
          <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            How to Use {toolName} in 3 Simple Steps
          </h3>
          <p className="text-sm text-muted-foreground">
            Follow this step-by-step walkthrough to get pristine results in seconds without installing any software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-card border border-border/70 hover:border-primary/40 transition-all flex flex-col justify-between shadow-sm group"
            >
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground font-black text-sm flex items-center justify-center shadow-md">
                  {idx + 1}
                </div>
                <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                  {step.name}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. High-Value Feature Grid (E-E-A-T & Differentiators) ── */}
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Why Choose Switchr</p>
          <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Engineered for Privacy, Speed, and Zero Quality Loss
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Traditional online utilities compromise your security by storing files on remote servers. Switchr handles every calculation right in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeFeatures.map((feat, idx) => {
            const Icon = feat.icon || CheckCircle2;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-card/60 border border-border hover:border-primary/30 transition-all space-y-3 flex flex-col justify-between shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-1">{feat.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. Technical Comparison Matrix (Switchr vs Cloud Tools) ── */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center sm:text-left space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Technical Comparison</p>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            Switchr Local Engine vs Traditional Cloud Converters
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            See how client-side WebAssembly transformation outperforms legacy cloud conversion pipelines.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold text-foreground">
                <th className="py-3 px-4 sm:px-6">Feature / Capability</th>
                <th className="py-3 px-4 sm:px-6 text-primary">Switchr (In-Browser)</th>
                <th className="py-3 px-4 sm:px-6 text-muted-foreground">Cloud-Based Alternatives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activeComparison.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-foreground whitespace-nowrap sm:whitespace-normal">
                    {row.feature}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                      <span>{row.switchrVal}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-muted-foreground">
                    {row.cloudVal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. Frequently Asked Questions (Matches FAQPage Schema) ── */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center sm:text-left space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Got Questions?</p>
          <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Frequently Asked Questions about {toolName}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Everything you need to know about formats, privacy, performance, and compatibility.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 6. Internal Linking Cluster (Boosts PageRank & Indexation) ── */}
      {relatedLinks.length > 0 && (
        <div className="space-y-6 max-w-5xl mx-auto border-t border-border/60 pt-12">
          <div className="text-center sm:text-left space-y-1.5">
            <h4 className="text-base sm:text-lg font-bold text-foreground">
              Explore Related Conversion &amp; Document Tools
            </h4>
            <p className="text-xs text-muted-foreground">
              Discover other free, 100% private file utilities powered by WebAssembly.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {relatedLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="p-3.5 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-muted/30 transition-all flex flex-col justify-between group shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors truncate">
                      {link.label}
                    </span>
                    {link.badge && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  {link.desc && (
                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      {link.desc}
                    </p>
                  )}
                </div>
                <div className="pt-2 flex items-center gap-1 text-[11px] font-semibold text-primary">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
