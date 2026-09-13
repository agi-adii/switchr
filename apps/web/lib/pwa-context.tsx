"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PwaContextValue {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  promptInstall: () => Promise<boolean>;
}

const PwaContext = createContext<PwaContextValue>({
  isInstallable: false,
  isInstalled: false,
  isOffline: false,
  promptInstall: async () => false,
});

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check standalone mode (already installed as PWA)
    if (typeof window !== "undefined") {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsInstalled(isStandaloneMode);

      // Check initial network status
      setIsOffline(!navigator.onLine);

      // Network status listeners
      const handleOnline = () => {
        setIsOffline(false);
        toast.success("Back online! Network connection restored.");
      };

      const handleOffline = () => {
        setIsOffline(true);
        toast.info("Offline mode active. Switchr continues working locally in your browser memory.", {
          duration: 5000,
        });
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Register Service Worker in production or supporting environments
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
          navigator.serviceWorker
            .register("/sw.js")
            .then((reg) => {
              // Check for SW updates
              reg.addEventListener("updatefound", () => {
                const installingWorker = reg.installing;
                if (installingWorker) {
                  installingWorker.addEventListener("statechange", () => {
                    if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
                      toast.info("A new version of Switchr is ready. Refresh to update!", {
                        action: {
                          label: "Refresh",
                          onClick: () => window.location.reload(),
                        },
                      });
                    }
                  });
                }
              });
            })
            .catch(() => {
              // SW registration might be disabled in dev mode, gracefully ignore
            });
        });
      }

      // Capture beforeinstallprompt
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setIsInstallable(true);
      };

      const handleAppInstalled = () => {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        toast.success("Switchr installed successfully! You can now launch it anytime from your desktop or home screen.");
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", handleAppInstalled);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener("appinstalled", handleAppInstalled);
      };
    }
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      toast.info("To install Switchr: tap the browser menu (⋮ or Share) and select 'Add to Home screen' or 'Install App'.");
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Install prompt error:", err);
      return false;
    }
  }, [deferredPrompt]);

  return (
    <PwaContext.Provider value={{ isInstallable, isInstalled, isOffline, promptInstall }}>
      {children}
    </PwaContext.Provider>
  );
}

export function usePwa() {
  return useContext(PwaContext);
}
