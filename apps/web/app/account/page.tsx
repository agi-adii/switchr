"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getHistory, HistoryItem } from "@/lib/history-store";
import {
  User,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileImage,
  FileText,
  Video,
  Minimize2,
  HardDrive,
} from "lucide-react";
import { formatFileSize } from "@/lib/registry";

export default function AccountPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const totalConvertedBytes = history.reduce((acc, item) => acc + item.originalSize, 0);

  const quickTools = [
    { label: "JPG to PDF", href: "/convert/images", icon: FileImage },
    { label: "PNG to WEBP", href: "/convert/images", icon: FileImage },
    { label: "Compress PDF", href: "/compress", icon: FileText },
    { label: "Video to MP3", href: "/convert/video", icon: Video },
    { label: "Image Lab", href: "/convert/images", icon: Minimize2 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      <Breadcrumbs items={[{ label: "Account" }]} />

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card border border-border rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-indigo-500 text-primary-foreground flex items-center justify-center font-bold text-xl shadow-md shadow-primary/20">
            <User className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">Guest User</h1>
              <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold">
                Active Session
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Personal dashboard &bull; No registration required
            </p>
          </div>
        </div>

        <Link
          href="/history"
          className="self-start sm:self-auto px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold rounded-xl border border-border transition-colors flex items-center gap-1.5"
        >
          <span>View Full History</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Total Conversions</span>
          <p className="text-2xl font-extrabold text-foreground">{history.length}</p>
          <span className="text-[11px] text-green-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% Successful
          </span>
        </div>

        <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Data Processed</span>
          <p className="text-2xl font-extrabold text-foreground">
            {formatFileSize(totalConvertedBytes)}
          </p>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <HardDrive className="w-3 h-3" /> Client-side sandbox
          </span>
        </div>

        <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Account Status</span>
          <p className="text-2xl font-extrabold text-primary">Free Forever</p>
          <span className="text-[11px] text-muted-foreground">No limits or paywalls</span>
        </div>
      </div>

      {/* Quick Tools */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground">Quick Tool Shortcuts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {quickTools.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.label}
                href={t.href}
                className="p-3.5 bg-card border border-border rounded-2xl hover:border-primary/60 hover:-translate-y-0.5 transition-all text-center flex flex-col items-center gap-2 group"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-foreground">{t.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Files */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">Recent Activity</h2>
          <Link href="/history" className="text-xs font-semibold text-primary hover:underline">
            See all
          </Link>
        </div>

        {history.length > 0 ? (
          <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden shadow-sm">
            {history.slice(0, 5).map((item) => (
              <div key={item.id} className="p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono uppercase font-bold text-[11px] px-2 py-0.5 rounded bg-muted text-primary">
                    {item.toFormat}
                  </span>
                  <span className="font-semibold text-foreground truncate">{item.fileName}</span>
                </div>
                <span className="text-muted-foreground font-mono text-[11px] shrink-0 ml-2">
                  {formatFileSize(item.originalSize)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-card border border-border rounded-2xl text-xs text-muted-foreground">
            No recent conversions recorded in this browser session.
          </div>
        )}
      </div>
    </div>
  );
}
