"use client";
import Image from "next/image";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchPalette } from "@/components/search-palette";
import { Search, Menu, X, User, DownloadCloud } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePwa } from "@/lib/pwa-context";

export function Navbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isInstallable, isInstalled, promptInstall } = usePwa();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Convert", href: "/convert" },
    { label: "AI Enhancer", href: "/tools/enhance" },
    { label: "PDF Tools", href: "/pdf-tools" },
    { label: "Compress", href: "/compress" },
    { label: "Tools", href: "/tools" },
    { label: "History", href: "/history" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-40 w-full border-b border-white/10 bg-white/8 backdrop-blur-xl supports-[backdrop-filter]:bg-blue-950/40 transition-colors duration-200"
      >
        {/* Moving Neon Accent Line */}
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/60 to-transparent animate-moving-gradient pointer-events-none" />

        <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8 max-w-6xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-8 h-8 rounded-xl overflow-hidden shadow-md shadow-primary/20"
            >
              <Image src="/logo.jpg" alt="Switchr Logo" width={32} height={32} className="w-full h-full object-cover" />
            </motion.div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-white">
                Switchr
              </span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-blue-400/20 text-blue-200 border border-blue-400/30 hidden sm:inline"
              >
                Free
              </motion.span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link, i) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.35, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? "text-white bg-white/20 font-bold"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-0 rounded-lg bg-white/15"
                        style={{ zIndex: -1 }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2"
          >
            {/* Search Trigger */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(true)}
              className="icon-btn gap-2 px-3 w-auto text-white/70 hover:text-white border-white/10 bg-white/5 hover:bg-white/15"
              title="Search tools (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline text-[11px]">Search...</span>
              <kbd className="hidden sm:inline text-[9px] px-1.5 py-0.5 rounded bg-blue-400/10 border border-blue-300/20 font-mono font-medium text-blue-200">
                Ctrl K
              </kbd>
            </motion.button>


            {/* PWA Install Button */}
            {isInstallable && !isInstalled && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => promptInstall()}
                className="icon-btn gap-1.5 px-2.5 sm:px-3 w-auto text-blue-200 border-blue-400/30 bg-blue-500/20 hover:bg-blue-500/35 text-xs font-bold shadow-xs cursor-pointer"
                title="Install Switchr as app"
              >
                <DownloadCloud className="w-3.5 h-3.5 text-blue-300" />
                <span className="text-[11px] font-bold">Install App</span>
              </motion.button>
            )}

            {/* Account / Dashboard */}
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/account"
                className="icon-btn hidden sm:inline-flex text-white/70 hover:text-white border-white/10 bg-white/5 hover:bg-white/15"
                title="My Account"
              >
                <User className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="icon-btn md:hidden text-white/70 hover:text-white border-white/10 bg-white/5 hover:bg-white/15"
              aria-label="Toggle Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="inline-flex"
                  >
                    <X className="w-4 h-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="inline-flex"
                  >
                    <Menu className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden border-b border-white/10 bg-blue-950/60 backdrop-blur-lg px-4 overflow-hidden"
            >
              <motion.div
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
                }}
                className="py-4 space-y-1"
              >
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        show: { opacity: 1, x: 0, transition: { duration: 0.25 } },
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                          isActive
                            ? "bg-white/20 text-white font-bold"
                            : "text-white/60 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.25 } },
                  }}
                >
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    Account &amp; History
                  </Link>
                </motion.div>

                {isInstallable && !isInstalled && (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.25 } },
                    }}
                    className="pt-2"
                  >
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        promptInstall();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-blue-200 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 transition-all cursor-pointer"
                    >
                      <DownloadCloud className="w-4 h-4 text-blue-300" />
                      Install Switchr App
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Global Command Palette */}
      <SearchPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
