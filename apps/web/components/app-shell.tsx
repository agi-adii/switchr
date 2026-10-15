"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { GlobalAmbientMotion } from "@/components/global-ambient-motion";
import { PageMotionWrapper } from "@/components/page-motion-wrapper";
import Link from "next/link";
import { Home, Repeat, Wrench, History } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname === "/" || pathname === "/studio";

  if (isStudio) {
    return (
      <main className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#0E0D0B] z-50">
        {children}
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0 relative">
      <GlobalAmbientMotion />
      <Navbar />
      <PageMotionWrapper>
        <main className="flex-1 relative z-10">{children}</main>
      </PageMotionWrapper>
      <Footer />
      {/* Mobile Bottom Navigation */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07071299]/95 backdrop-blur-xl border-t border-indigo-500/15 flex items-center justify-around py-3 px-2"
      >
        <Link
          href="/"
          className="flex flex-col items-center gap-1.5 text-[10px] font-semibold text-zinc-500 hover:text-indigo-400 transition-colors"
        >
          <span className="icon-btn w-8 h-8 rounded-[0.5rem]"><Home className="w-3.5 h-3.5" /></span>
          <span>Home</span>
        </Link>
        <Link
          href="/convert"
          className="flex flex-col items-center gap-1.5 text-[10px] font-semibold text-zinc-500 hover:text-indigo-400 transition-colors"
        >
          <span className="icon-btn w-8 h-8 rounded-[0.5rem]"><Repeat className="w-3.5 h-3.5" /></span>
          <span>Convert</span>
        </Link>
        <Link
          href="/tools"
          className="flex flex-col items-center gap-1.5 text-[10px] font-semibold text-zinc-500 hover:text-indigo-400 transition-colors"
        >
          <span className="icon-btn w-8 h-8 rounded-[0.5rem]"><Wrench className="w-3.5 h-3.5" /></span>
          <span>Tools</span>
        </Link>
        <Link
          href="/history"
          className="flex flex-col items-center gap-1.5 text-[10px] font-semibold text-zinc-500 hover:text-indigo-400 transition-colors"
        >
          <span className="icon-btn w-8 h-8 rounded-[0.5rem]"><History className="w-3.5 h-3.5" /></span>
          <span>History</span>
        </Link>
      </nav>
    </div>
  );
}
