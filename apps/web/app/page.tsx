"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import {
  UploadCloud,
  FileImage,
  FileText,
  Music,
  Video,
  FileCode,
  Archive,
  Minimize2,
  Layers,
  Scissors,
  Maximize2,
  ArrowRight,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Lock,
  Globe,
  CheckCircle2,
  Upload,
  Settings2,
  Download,
  RefreshCw,
  Cpu,
} from "lucide-react";
import Image from "next/image";
import { getFileExtension, getFormatMetadata } from "@/lib/registry";
import { toast } from "sonner";
import { HeroGraphicShowcase } from "@/components/hero-graphic-showcase";
import { FormatTransformationShowcase } from "@/components/format-transformation-showcase";
import { PrivacyArchitectureGraphic } from "@/components/privacy-architecture-graphic";

const smoothEase = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: smoothEase },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: smoothEase },
  }),
};

export default function HomePage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const ext = getFileExtension(file.name);
    const meta = getFormatMetadata(ext);

    toast.success(`Detected ${meta?.name || ext.toUpperCase()} file`);

    switch (meta?.category) {
      case "image":
        router.push("/convert/images");
        break;
      case "document":
        router.push("/convert/documents");
        break;
      case "audio":
        router.push("/convert/audio");
        break;
      case "video":
        router.push("/convert/video");
        break;
      case "data":
        router.push("/convert/data");
        break;
      case "archive":
        router.push("/tools/archive");
        break;
      default:
        if (ext === "pdf") {
          router.push("/pdf-tools");
        } else {
          router.push("/convert");
        }
        break;
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const CONVERT_CATEGORIES = [
    { title: "Images", desc: "JPG, PNG, WEBP, HEIC", href: "/convert/images", icon: FileImage, color: "text-blue-500 bg-blue-500/10" },
    { title: "Documents", desc: "DOCX, TXT, HTML", href: "/convert/documents", icon: FileText, color: "text-amber-500 bg-amber-500/10" },
    { title: "PDF", desc: "Convert & Compile", href: "/pdf-tools", icon: FileText, color: "text-red-500 bg-red-500/10" },
    { title: "Audio", desc: "MP3, WAV, AAC", href: "/convert/audio", icon: Music, color: "text-emerald-500 bg-emerald-500/10" },
    { title: "Video", desc: "MP4, WebM, MOV", href: "/convert/video", icon: Video, color: "text-violet-500 bg-violet-500/10" },
    { title: "Data", desc: "JSON, CSV, XML", href: "/convert/data", icon: FileCode, color: "text-cyan-500 bg-cyan-500/10" },
    { title: "Archives", desc: "Create & Extract ZIP", href: "/tools/archive", icon: Archive, color: "text-indigo-500 bg-indigo-500/10" },
  ];

  const QUICK_TOOLS = [
    { title: "Compress", desc: "Reduce file size", href: "/compress", icon: Minimize2, color: "text-emerald-500 bg-emerald-500/10" },
    { title: "HEIC to PDF", desc: "Apple photo to PDF", href: "/pdf-tools", icon: FileText, color: "text-blue-500 bg-blue-500/10" },
    { title: "Merge PDF", desc: "Combine pages", href: "/pdf-tools", icon: Layers, color: "text-red-500 bg-red-500/10" },
    { title: "Resize Image", desc: "Scale dimensions", href: "/convert/images", icon: Maximize2, color: "text-purple-500 bg-purple-500/10" },
  ];

  return (
    <div className="homepage-shell w-full max-w-6xl mx-auto py-8 md:py-14 px-4 sm:px-6 space-y-16 md:space-y-20 overflow-hidden">
      {/* Hero Section */}
      <section className="hero-grid hero-grid--animated relative grid lg:grid-cols-[1fr_0.9fr] items-center gap-10 lg:gap-6 min-h-[500px]">
        <div className="relative z-10 max-w-2xl pt-6 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-extrabold tracking-wide mb-5 border border-primary/10 shadow-sm"
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-flex"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </motion.span>
          A better way to move between formats
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-[-0.055em] leading-[0.98] text-foreground"
        >
          Files, in their
          <span className="block text-primary">best format.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 text-sm sm:text-base leading-7 text-muted-foreground max-w-xl"
        >
          Switchr turns the files you have into the files you need. Fast, private, and free from artificial limits.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 flex flex-wrap items-center gap-3"
        >
          <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30">
            Start converting <ArrowUpRight className="w-4 h-4" />
          </button>
          <Link href="/tools" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-3 text-sm font-bold text-foreground hover:border-primary/30 hover:bg-muted/60">Explore tools</Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs font-semibold text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" />Private by default</span>
          <span className="inline-flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" />No account needed</span>
        </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, x: 24 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex min-h-[330px] items-center justify-center lg:min-h-[460px]"
        >
          <HeroGraphicShowcase />
        </motion.div>
      </section>

      {/* ── Stats Bar ── */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        variants={containerVariants}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {([
          { label: "File Formats",  value: "200+", icon: FileCode,     color: "text-violet-500", bg: "bg-violet-500/10"  },
          { label: "Tools",         value: "30+",  icon: Settings2,    color: "text-blue-500",   bg: "bg-blue-500/10"    },
          { label: "Always Free",   value: "100%", icon: CheckCircle2, color: "text-emerald-500",bg: "bg-emerald-500/10" },
          { label: "Zero Tracking", value: "0%",   icon: ShieldCheck,  color: "text-amber-500",  bg: "bg-amber-500/10"   },
        ] as const).map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -3, transition: { type: "spring", stiffness: 400 } }}
              className="stat-card relative flex flex-col items-center justify-center p-5 rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm text-center overflow-hidden gap-1"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-2`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-2xl font-black tracking-tight text-foreground">{stat.value}</span>
              <span className="text-[11px] font-semibold text-muted-foreground">{stat.label}</span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Upload Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: isDragging ? 1.02 : 1.005 }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`upload-command-surface relative w-full max-w-5xl mx-auto min-h-[220px] rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center p-8 cursor-pointer transition-all duration-300 shadow-sm ${
          isDragging
            ? "border-primary bg-primary/10 scale-[1.02]"
            : "border-border hover:border-primary/50 bg-card hover:bg-muted/30"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        <motion.div
          animate={isDragging ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 shadow-inner"
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <UploadCloud className="w-7 h-7" />
          </motion.div>
        </motion.div>

        <h2 className="text-base sm:text-lg font-bold text-foreground">
          {isDragging ? "Release to upload" : "Drop your file here"}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          or <span className="text-primary font-semibold underline underline-offset-4">Choose File</span> from device
        </p>
        <span className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/80">Images · Documents · Audio · Video · Data</span>
      </motion.div>

      {/* ── How It Works ── */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={containerVariants}
        className="space-y-8"
      >
        <motion.div variants={fadeUp} custom={0} className="text-center space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Simple Process</p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">How Switchr works</h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">Three steps to transform any file. No expertise required.</p>
        </motion.div>

        <div className="relative grid sm:grid-cols-3 gap-4">
          <div className="absolute top-[4.25rem] left-[33%] right-[33%] hidden sm:block pointer-events-none z-0">
            <div className="how-connector" />
          </div>
          {([
            { step: "01", title: "Drop your file",     desc: "Drag & drop or click to select. Format is detected instantly.",              icon: Upload,    color: "text-blue-500",    bg: "from-blue-500/15 to-blue-600/5",      border: "border-blue-500/20"    },
            { step: "02", title: "Choose output",      desc: "Pick from 200+ supported formats. One click is all it takes.",              icon: Settings2, color: "text-violet-500",  bg: "from-violet-500/15 to-violet-600/5",  border: "border-violet-500/20"  },
            { step: "03", title: "Download instantly", desc: "Converted right in your browser. No uploads, no waiting, no limits.",       icon: Download,  color: "text-emerald-500", bg: "from-emerald-500/15 to-emerald-600/5", border: "border-emerald-500/20" },
          ] as const).map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                variants={itemVariants}
                custom={i}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 350 } }}
                className={`relative z-10 p-6 rounded-2xl border ${step.border} bg-gradient-to-br ${step.bg} backdrop-blur-sm flex flex-col items-center text-center gap-3`}
              >
                <div className="text-[10px] font-black tracking-[0.18em] text-muted-foreground/50 uppercase mb-1">{step.step}</div>
                <div className={`w-14 h-14 rounded-2xl bg-card border ${step.border} flex items-center justify-center shadow-lg`}>
                  <Icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground text-sm">{step.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Interactive Format Transformation & Quality Comparison ── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: smoothEase }}
      >
        <FormatTransformationShowcase />
      </motion.section>

      {/* Major Categories: Convert */}
      <motion.div
        className="content-section content-section-formats space-y-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={containerVariants}
      >
        <motion.div
          variants={fadeUp}
          custom={0}
          className="section-heading flex items-center justify-between border-b border-border/70 pb-3"
        >
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
            Convert by Format
          </h3>
          <Link
            href="/convert"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group"
          >
            <span>All Converters</span>
            <motion.span
              className="inline-flex"
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {CONVERT_CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.title}
                variants={itemVariants}
                custom={i}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 350, damping: 18 } }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href={cat.href}
                  className="format-card p-4 border rounded-2xl flex flex-col items-center text-center gap-2 group block"
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{cat.title}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{cat.desc}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Why Switchr – Feature Grid ── */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={containerVariants}
        className="space-y-8"
      >
        <motion.div variants={fadeUp} custom={0} className="text-center space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Why Switchr</p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Built different, by design</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">Every decision we make puts you in control of your files.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {([
            { title: "100% Private",   desc: "Files never leave your device. Everything runs client-side in your browser.",  icon: Lock,         gradient: "from-emerald-500 to-teal-500",  bg: "bg-emerald-500/8", border: "border-emerald-500/20", graphic: "/graphics/graphic-vault.jpg" },
            { title: "No Size Limits", desc: "No file-size caps, no daily quotas, no paywalls. Ever.",                       icon: Zap,          gradient: "from-amber-500 to-orange-500",  bg: "bg-amber-500/8",   border: "border-amber-500/20", graphic: "/graphics/graphic-unlimited.jpg" },
            { title: "Lightning Fast", desc: "Powered by WebAssembly & native browser APIs for instant results.",            icon: Cpu,          gradient: "from-blue-500 to-indigo-500",   bg: "bg-blue-500/8",    border: "border-blue-500/20", graphic: "/graphics/graphic-speed.jpg" },
            { title: "Works Offline",  desc: "No internet required after first load. Your files stay yours.",                icon: Globe,        gradient: "from-violet-500 to-purple-500", bg: "bg-violet-500/8",  border: "border-violet-500/15" },
            { title: "Zero Account",   desc: "No sign-up. No credit card. Just free tools for everyone.",                   icon: CheckCircle2, gradient: "from-pink-500 to-rose-500",     bg: "bg-pink-500/8",    border: "border-pink-500/15" },
            { title: "Instant Results",desc: "Real-time conversion with zero queue time or server delay.",                  icon: RefreshCw,    gradient: "from-cyan-500 to-sky-500",      bg: "bg-cyan-500/8",    border: "border-cyan-500/15" },
          ] as const).map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                variants={itemVariants}
                custom={i}
                whileHover={{ y: -5, scale: 1.01, transition: { type: "spring", stiffness: 350 } }}
                className={`feature-card relative p-5 rounded-2xl border ${feat.border} ${feat.bg} backdrop-blur-sm overflow-hidden group flex flex-col justify-between`}
              >
                <div className="feature-card-shimmer" />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {"graphic" in feat && feat.graphic && (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/20 shadow-md group-hover:scale-110 transition-transform duration-300">
                        <Image
                          src={feat.graphic}
                          alt={feat.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <h3 className="font-extrabold text-foreground text-sm mb-1">{feat.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Privacy Architecture Infographic ── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: smoothEase }}
      >
        <PrivacyArchitectureGraphic />
      </motion.section>

      {/* ── Scrolling Format Marquee ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-3"
      >
        <p className="text-center text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">200+ formats supported</p>
        <div className="marquee-container relative overflow-hidden">
          <div className="marquee-fade-left" />
          <div className="marquee-fade-right" />
          <div className="marquee-track">
            {([
              "JPG","PNG","WEBP","SVG","PDF","DOCX","MP3","WAV",
              "MP4","WebM","CSV","JSON","XML","ZIP","GIF","AVIF",
              "MOV","AAC","FLAC","OGG","HEIC","ICO","BMP","TIFF",
              "XLSX","PPTX","HTML","MD","YAML","TOML","7Z","TAR",
              "JPG","PNG","WEBP","SVG","PDF","DOCX","MP3","WAV",
              "MP4","WebM","CSV","JSON","XML","ZIP","GIF","AVIF",
              "MOV","AAC","FLAC","OGG","HEIC","ICO","BMP","TIFF",
              "XLSX","PPTX","HTML","MD","YAML","TOML","7Z","TAR",
            ]).map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold border border-border/70 bg-card/70 text-muted-foreground whitespace-nowrap backdrop-blur-sm hover:border-primary/40 hover:text-primary transition-colors cursor-default select-none"
              >
                .{tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Major Categories: Tools */}
      <motion.div
        className="content-section content-section-tools space-y-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={containerVariants}
      >
        <motion.div
          variants={fadeUp}
          custom={0}
          className="section-heading flex items-center justify-between border-b border-border/70 pb-3"
        >
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
            Featured Tools
          </h3>
          <Link
            href="/tools"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>All Tools</span>
            <motion.span
              className="inline-flex"
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {QUICK_TOOLS.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.title}
                variants={itemVariants}
                custom={i}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 350, damping: 18 } }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href={tool.href}
                  className="quick-tool-card p-5 border rounded-2xl flex items-center gap-3.5 group block"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tool.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">{tool.title}</h4>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">{tool.desc}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

    </div>
  );
}
