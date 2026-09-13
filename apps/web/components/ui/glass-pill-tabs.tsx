"use client";

import React from "react";
import { motion } from "framer-motion";

export interface TabOption<T extends string = string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export interface GlassPillTabsProps<T extends string = string> {
  tabs: TabOption<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  layoutId?: string;
  className?: string;
}

export function GlassPillTabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  layoutId = "glassPillTab",
  className = "",
}: GlassPillTabsProps<T>) {
  return (
    <div
      className={`inline-flex items-center gap-1 p-1.5 rounded-full bg-background/60 dark:bg-muted/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg shadow-black/5 overflow-x-auto max-w-full no-scrollbar ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors whitespace-nowrap cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
              isActive
                ? "text-foreground font-bold"
                : "text-muted-foreground hover:text-foreground/90"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-white dark:bg-card shadow-md border border-white/50 dark:border-white/10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && <span className="shrink-0">{tab.badge}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
