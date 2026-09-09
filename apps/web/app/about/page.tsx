"use client";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ShieldCheck, Lock, Zap, Heart, CheckCircle2 } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const smoothEase = [0.16, 1, 0.3, 1] as const;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: smoothEase },
  }),
};

const faqVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: smoothEase },
  }),
};

export default function AboutPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-12">
      <Breadcrumbs items={[{ label: "About" }]} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center space-y-2"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2"
        >
          <motion.span
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            className="inline-flex"
          >
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </motion.span>
          Free Public Utility
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          About Switchr
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Built on the belief that basic file conversion should be fast, private, and accessible to everyone.
        </p>
      </motion.div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Lock,
            color: "bg-green-500/10 text-green-600",
            title: "100% Private",
            desc: "Your files process client-side in your browser via HTML5 Canvas and WebAssembly. No files are stored or viewed on external servers.",
          },
          {
            icon: CheckCircle2,
            color: "bg-blue-500/10 text-blue-600",
            title: "Zero Paywalls",
            desc: "No Pro versions, no subscriptions, no daily limits, and no payment gateways. Every feature is open to everyone equally.",
          },
          {
            icon: Zap,
            color: "bg-amber-500/10 text-amber-600",
            title: "Blazing Fast",
            desc: "No network latency waiting for server queues. Your local processor handles file encoding in parallel with instant downloads.",
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 320, damping: 18 } }}
              className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-3"
            >
              <motion.div
                whileHover={{ scale: 1.12, rotate: 8 }}
                transition={{ type: "spring", stiffness: 280, damping: 14 }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div id="faq" className="space-y-6 pt-6 border-t border-border">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold text-foreground text-center"
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              q: "Is Switchr really 100% free?",
              a: "Yes. Switchr is designed from the ground up as a completely free public service. There are no paid tiers or hidden subscription fees.",
            },
            {
              q: "Do I need an account to convert files?",
              a: "No. Guest conversion works completely without an account. Accounts are optional for saving personal preferences and history.",
            },
            {
              q: "Are my files kept permanently?",
              a: "No. Uploaded files are processed in your local browser sandbox and are automatically released from memory when your session ends.",
            },
            {
              q: "Can I convert multiple files in batch?",
              a: "Yes. Batch conversion is fully supported. You can convert whole queues of photos or media and download a single compiled ZIP.",
            },
          ].map((faq, i) => (
            <motion.div
              key={faq.q}
              custom={i}
              variants={faqVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-30px" }}
              whileHover={{ y: -2, transition: { type: "spring", stiffness: 340 } }}
              className="p-5 rounded-2xl bg-card border border-border space-y-1.5 hover:border-primary/40 transition-colors"
            >
              <h4 className="font-bold text-xs text-foreground">{faq.q}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
