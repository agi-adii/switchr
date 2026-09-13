"use client";

import { useState, useEffect } from "react";
import { usePwa } from "@/lib/pwa-context";
import { motion, AnimatePresence } from "framer-motion";
import { DownloadCloud, X, WifiOff, Sparkles } from "lucide-react";

export function PwaInstallBanner() {
  const { isInstallable, isInstalled, isOffline, promptInstall } = usePwa();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Show banner after 3 seconds if installable and not previously dismissed this session
    if (typeof window !== "undefined") {
      const isDismissed = sessionStorage.getItem("switchr_pwa_banner_dismissed");
      if (!isDismissed && isInstallable && !isInstalled) {
        const timer = setTimeout(() => setDismissed(false), 2500);
        return () => clearTimeout(timer);
      }
    }
  }, [isInstallable, isInstalled]);

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("switchr_pwa_banner_dismissed", "true");
    }
  };

  const handleInstallClick = async () => {
    const success = await promptInstall();
    if (success) {
      setDismissed(true);
    }
  };

  return (
    <>
      {/* Offline Status Notification Pill */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-amber-500/90 text-zinc-950 font-bold text-xs backdrop-blur-md shadow-xl flex items-center gap-2 border border-amber-400"
          >
            <WifiOff className="w-4 h-4" />
            <span>Offline Mode Active — 100% In-Browser Conversion Ready</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Floating Install Prompt */}
      <AnimatePresence>
        {!dismissed && isInstallable && !isInstalled && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] p-4 rounded-3xl bg-zinc-950/95 dark:bg-card/95 border border-blue-500/30 shadow-2xl backdrop-blur-xl text-foreground"
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                <DownloadCloud className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white">Install Switchr App</h4>
                  <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold">
                    Fast &amp; Offline
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  Install on your device for instant launch from home screen or desktop with offline conversion.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={handleInstallClick}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Install Now
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Dismiss install prompt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
