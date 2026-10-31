import { ToolJsonLd } from "@/components/seo/json-ld";
import { ToolSeoContent } from "@/components/seo/tool-seo-content";
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GlassPillTabs } from "@/components/ui/glass-pill-tabs";
import { BeforeAfterSlider } from "@/components/enhancer/before-after-slider";
import { ImageHistogram } from "@/components/enhancer/histogram";
import {
  enhanceImageFile,
  autoCalibrateImage,
  isHeicFormat,
  decodeHeicBlob,
  ENHANCE_PRESETS,
  DEFAULT_SETTINGS,
  type EnhanceSettings,
  type ImageHistogramData,
} from "@/lib/enhancer/photo-enhancer";
import { formatFileSize } from "@/lib/registry";
import { saveHistoryItem } from "@/lib/history-store";
import {
  Sparkles,
  UploadCloud,
  Download,
  RefreshCw,
  Wand2,
  User,
  Sun,
  Moon,
  Zap,
  RotateCcw,
  Image as ImageIcon,
  Loader2,
  Gauge,
  Palette,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";

const PRESET_LIST = [
  {
    id: "magic" as const,
    name: "Magic Auto",
    icon: Wand2,
    desc: "AI balanced tone, color & clarity",
    badge: "Smart AI",
  },
  {
    id: "portrait" as const,
    name: "Portrait Pro",
    icon: User,
    desc: "Natural skin glow, eye pop & softened noise",
    badge: "Faces",
  },
  {
    id: "hdr" as const,
    name: "HDR Landscape",
    icon: Sun,
    desc: "Expanded dynamic range, rich skies & depth",
    badge: "Nature",
  },
  {
    id: "night" as const,
    name: "Night Recovery",
    icon: Moon,
    desc: "Lifts dark shadows & suppresses grain",
    badge: "Low-Light",
  },
  {
    id: "sharp" as const,
    name: "Ultra Sharp",
    icon: Zap,
    desc: "Recovers soft edges & micro-textures",
    badge: "Acuity",
  },
];

type ComponentTab = "tone" | "color" | "detail";


const ENHANCE_HOW_TO_STEPS = [
  {
    name: "Upload Your Photo",
    text: "Drag and drop your JPG, PNG, WebP, or iPhone HEIC picture into the photo enhancer workspace.",
  },
  {
    name: "Choose Preset or Upscale Factor",
    text: "Select one-click presets like Magic Auto, Portrait Pro, or HDR Landscape, or enable 2x/4x Real-ESRGAN neural super-resolution.",
  },
  {
    name: "Download Pristine 4K Photo",
    text: "Compare before-and-after results with the interactive slider and download your crystal-clear enhanced photo immediately.",
  },
];

const ENHANCE_FAQS = [
  {
    question: "How does the Real-ESRGAN neural network run directly in the browser?",
    answer: "Switchr compiles the state-of-the-art Real-ESRGAN deep convolutional neural network to ONNX Runtime with WebGPU and WebAssembly acceleration. The neural network computes directly on your device GPU/CPU without needing cloud servers.",
  },
  {
    question: "Can this AI upscaler unblur out-of-focus photos and restore faces?",
    answer: "Yes! Real-ESRGAN is trained specifically to hallucinate and reconstruct realistic high-frequency micro-textures, skin details, hair strands, and sharp edges that were lost in low-resolution or compressed images.",
  },
  {
    question: "Are my family photos or personal selfies uploaded to any external server?",
    answer: "Never. All AI inference and pixel processing execute 100% locally in your browser tab. Your images never touch any remote cloud server, providing complete biometric and photographic privacy.",
  },
  {
    question: "Does the enhancer support Apple iPhone HEIC photos directly?",
    answer: "Yes! Switchr features a built-in WebAssembly HEIC decoder that directly ingests iPhone camera photos without requiring conversion beforehand.",
  },
  {
    question: "What is the difference between AI neural upscaling and traditional bicubic sharpening?",
    answer: "Traditional bicubic scaling simply duplicates or averages adjacent pixels, making blurry photos look blocky. Real-ESRGAN uses deep machine learning to synthesize realistic sharp details and eliminate JPEG compression artifacts.",
  },
  {
    question: "Is there any cost, credit token, or subscription fee?",
    answer: "No. Unlike other AI upscalers that charge subscription fees or limit you to 3 free credits, Switchr is 100% free with unlimited usage.",
  },
];

export default function PhotoEnhancerPage() {
  const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [enhancedUrl, setEnhancedUrl] = useState<string>("");
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [enhancedWidth, setEnhancedWidth] = useState<number>(0);
  const [enhancedHeight, setEnhancedHeight] = useState<number>(0);
  const [enhancedSize, setEnhancedSize] = useState<number>(0);
  const [originalFileSize, setOriginalFileSize] = useState<number>(0);
  const [isHeicSource, setIsHeicSource] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<ComponentTab>("tone");
  const [histogramData, setHistogramData] = useState<ImageHistogramData | null>(null);

  // Component Settings
  const [settings, setSettings] = useState<EnhanceSettings>({
    ...ENHANCE_PRESETS.magic,
  });

  const [exportFormat, setExportFormat] = useState<"jpg" | "png" | "webp">("jpg");
  const [exportScale, setExportScale] = useState<1 | 2 | 4>(1);
  const [upscaleMethod, setUpscaleMethod] = useState<"real-esrgan" | "bicubic">("real-esrgan");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Execute enhancement pipeline
  const runEnhancement = useCallback(
    async (
      file: File | Blob,
      currentSettings: EnhanceSettings,
      scale: 1 | 2 | 4,
      method: "real-esrgan" | "bicubic" = upscaleMethod
    ) => {
      setIsProcessing(true);
      setProgress(0.1);
      setStatusMessage(
        scale > 1 && method === "real-esrgan"
          ? "Starting Real-ESRGAN Neural Net..."
          : "Processing photo..."
      );
      try {
        const activeSettings: EnhanceSettings = {
          ...currentSettings,
          scale,
          upscaleMethod: method,
        };

        const res = await enhanceImageFile(file, activeSettings, (p, text) => {
          setProgress(p);
          if (text) setStatusMessage(text);
        });

        setEnhancedUrl(res.dataUrl);
        setEnhancedWidth(res.width);
        setEnhancedHeight(res.height);
        setEnhancedSize(res.blob.size);
        setHistogramData(res.histogram);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to enhance image");
      } finally {
        setIsProcessing(false);
        setStatusMessage("");
      }
    },
    [upscaleMethod]
  );

  // Load a file into workspace
  const handleLoadImage = useCallback(
    async (fileOrBlob: File | Blob, name = "photo.jpg") => {
      setIsProcessing(true);
      setProgress(0.05);

      const isHeic = await isHeicFormat(fileOrBlob, name);
      setIsHeicSource(isHeic);
      setOriginalFileSize(fileOrBlob.size);
      setFileName(name);

      let workingBlob: Blob = fileOrBlob;

      if (isHeic) {
        const toastId = toast.loading("Decoding Apple HEIC photo...");
        try {
          workingBlob = await decodeHeicBlob(fileOrBlob);
          toast.success("Apple HEIC decoded successfully", { id: toastId });
        } catch (heicErr: any) {
          console.error("HEIC decode error:", heicErr);
          toast.error("Failed to decode HEIC file. Please ensure it is a valid HEIC/HEIF photo.", { id: toastId });
          setIsProcessing(false);
          return;
        }
      }

      setSelectedFile(workingBlob);
      if (originalUrl) {
        URL.revokeObjectURL(originalUrl);
      }
      const url = URL.createObjectURL(workingBlob);
      setOriginalUrl(url);

      const img = new Image();
      img.src = url;
      try {
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            setOriginalWidth(img.naturalWidth);
            setOriginalHeight(img.naturalHeight);
            resolve();
          };
          img.onerror = () => {
            reject(new Error("Unable to decode image"));
          };
        });
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to load image file");
        setIsProcessing(false);
        return;
      }

      await runEnhancement(workingBlob, settings, exportScale);
    },
    [originalUrl, settings, exportScale, runEnhancement]
  );

  // AI Auto-Calibrate (scans histogram and sets exact component values)
  const handleAutoCalibrate = async () => {
    if (!selectedFile) return;
    const toastId = toast.loading("AI scanning image components...");

    try {
      const img = new Image();
      img.src = originalUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Context failed");
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const calibratedSettings = autoCalibrateImage(imgData);

      setSettings(calibratedSettings);
      await runEnhancement(selectedFile, calibratedSettings, exportScale);
      toast.success("AI accurately calibrated all components!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error("Auto-calibration failed", { id: toastId });
    }
  };

  // Switch preset
  const handleSelectPreset = (presetKey: keyof typeof ENHANCE_PRESETS) => {
    const newSettings = { ...ENHANCE_PRESETS[presetKey], scale: exportScale };
    setSettings(newSettings);
    if (selectedFile) {
      runEnhancement(selectedFile, newSettings, exportScale, upscaleMethod);
    }
  };

  // Adjust a component slider
  const handleComponentChange = (field: keyof EnhanceSettings, value: number) => {
    const updated: EnhanceSettings = {
      ...settings,
      preset: "custom",
      [field]: value,
    };
    setSettings(updated);
  };

  // Debounced execution when sliders finish moving
  const sliderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleSliderCommit = () => {
    if (!selectedFile) return;
    if (sliderTimeoutRef.current) clearTimeout(sliderTimeoutRef.current);
    sliderTimeoutRef.current = setTimeout(() => {
      runEnhancement(selectedFile, settings, exportScale, upscaleMethod);
    }, 120);
  };

  // Reset all components to neutral
  const handleResetComponents = () => {
    setSettings({ ...DEFAULT_SETTINGS, scale: exportScale });
    if (selectedFile) {
      runEnhancement(
        selectedFile,
        { ...DEFAULT_SETTINGS, scale: exportScale },
        exportScale,
        upscaleMethod
      );
    }
    toast.info("Reset all components to neutral");
  };

  // Handle upscale resolution
  const handleScaleChange = (scale: 1 | 2 | 4) => {
    setExportScale(scale);
    if (selectedFile) {
      runEnhancement(selectedFile, settings, scale, upscaleMethod);
    }
  };

  // Switch between Real-ESRGAN and classic high-acuity upscaling
  const handleMethodChange = (method: "real-esrgan" | "bicubic") => {
    setUpscaleMethod(method);
    if (selectedFile && exportScale > 1) {
      runEnhancement(selectedFile, settings, exportScale, method);
    }
  };

  // Download enhanced image
  const handleDownload = () => {
    if (!enhancedUrl) return;
    const cleanName = fileName.replace(/\.[^/.]+$/, "");
    const ext = exportFormat;
    const scaleSuffix = exportScale > 1 ? `-${exportScale}x` : "";
    const downloadName = `${cleanName}-enhanced${scaleSuffix}.${ext}`;

    const a = document.createElement("a");
    a.href = enhancedUrl;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    saveHistoryItem({
      fileName: downloadName,
      fromFormat: isHeicSource ? "HEIC" : (fileName.split(".").pop() || "image"),
      toFormat: exportFormat,
      originalSize: originalFileSize || selectedFile?.size || 0,
      convertedSize: enhancedSize || 0,
      downloadUrl: enhancedUrl,
      category: "image",
    });

    toast.success("Enhanced photo downloaded successfully!");
  };

  // Reset workspace
  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    setSelectedFile(null);
    setFileName("");
    setOriginalUrl("");
    setEnhancedUrl("");
    setOriginalWidth(0);
    setOriginalHeight(0);
    setEnhancedWidth(0);
    setEnhancedHeight(0);
    setEnhancedSize(0);
    setOriginalFileSize(0);
    setIsHeicSource(false);
    setHistogramData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "AI Photo Enhancer" }]} />

      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-500 text-xs font-bold mb-2 border border-violet-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          Real-ESRGAN Deep Neural Model &amp; Vision Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          AI Photo Enhancer &amp; Super-Resolution
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          Calibrate tone, dynamic range, and texture with precision computational photography, or upscale up to 4x using Real-ESRGAN deep neural networks via ONNX Runtime &amp; WebGPU.
        </p>
      </div>

      {!selectedFile ? (
        /* Upload & Dropzone View */
        <div className="space-y-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleLoadImage(e.dataTransfer.files[0], e.dataTransfer.files[0].name);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`glass-dropzone rounded-3xl p-12 sm:p-16 text-center cursor-pointer group ${
              isDragging ? "glass-dropzone-active" : ""
            }`}
          >
            <div className="glass-specular" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-48 bg-violet-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-violet-500/30 transition-all duration-500" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.heic,.heif,image/heic,image/heif"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleLoadImage(e.target.files[0], e.target.files[0].name);
                }
              }}
            />
            <div className="relative w-16 h-16 rounded-2xl bg-white/10 border border-white/20 text-violet-300 flex items-center justify-center mx-auto mb-4 shadow-sm backdrop-blur-sm group-hover:scale-105 group-hover:border-violet-400/50 transition-all duration-300">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
              Drop your photo here, or{" "}
              <span className="text-violet-400 underline underline-offset-2">browse files</span>
            </h3>
            <p className="text-xs text-white/70 max-w-sm mx-auto leading-relaxed">
              Supports JPG, PNG, WebP, Apple HEIC, and BMP. Processed 100% client-side with zero server uploads.
            </p>
          </div>
        </div>
      ) : (
        /* Active Workspace View */
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="glass-surface relative flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl overflow-hidden">
            <div className="glass-specular" />
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-400/30 text-violet-400 flex items-center justify-center shrink-0 shadow-inner">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-foreground truncate">{fileName}</p>
                  {isHeicSource && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 text-[10px] font-extrabold border border-blue-400/30 shrink-0">
                      Apple HEIC
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground font-mono">
                  {originalWidth}×{originalHeight} px •{" "}
                  {originalFileSize ? formatFileSize(originalFileSize) : selectedFile ? formatFileSize(selectedFile.size) : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* AI Auto-Calibrate Button */}
              <button
                onClick={handleAutoCalibrate}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all cursor-pointer disabled:opacity-50"
                title="Automatically scan image histogram and dial in exact optimal parameters"
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Auto-Calibrate
              </button>

              {isProcessing && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 text-violet-300 text-xs font-bold animate-pulse max-w-[280px] truncate border border-violet-400/30">
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span className="truncate">{statusMessage || `${Math.round(progress * 100)}%`}</span>
                </span>
              )}

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change Photo
              </button>
            </div>
          </div>

          {/* Interactive Before / After Split Slider */}
          <div className="glass-surface relative rounded-3xl p-4 sm:p-6 space-y-4 overflow-hidden">
            <div className="glass-specular" />
            {originalUrl && enhancedUrl ? (
              <BeforeAfterSlider
                originalSrc={originalUrl}
                enhancedSrc={enhancedUrl}
                originalWidth={originalWidth}
                originalHeight={originalHeight}
                enhancedWidth={enhancedWidth}
                enhancedHeight={enhancedHeight}
              />
            ) : (
              <div className="aspect-[16/10] w-full rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
              </div>
            )}

            {/* Live Component Histogram */}
            <ImageHistogram data={histogramData} />

            {/* 1-Click Smart Presets */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  1-Click AI Presets
                </label>
                <button
                  onClick={handleResetComponents}
                  className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Reset all sliders to zero"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Sliders
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {PRESET_LIST.map((p) => {
                  const Icon = p.icon;
                  const isActive = settings.preset === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPreset(p.id)}
                      className={`relative flex flex-col p-3 rounded-2xl border text-left transition-all cursor-pointer backdrop-blur-md ${
                        isActive
                          ? "border-violet-400/80 bg-violet-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_16px_rgba(139,92,246,0.25)] scale-[1.02]"
                          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-violet-400/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? "text-violet-500" : "text-muted-foreground"
                          }`}
                        />
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border ${
                            isActive
                              ? "bg-violet-500/20 text-violet-500 border-violet-500/30"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {p.badge}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold leading-tight ${
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {p.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                        {p.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accurate Component Tuning Controls */}
            <div className="border-t border-border pt-4 space-y-4">
              {/* Component Category Tabs */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <GlassPillTabs
                  activeTab={activeTab}
                  onChange={(tabId) => setActiveTab(tabId)}
                  layoutId="enhanceControlsTab"
                  tabs={[
                    {
                      id: "tone",
                      label: "Tone & Light (6)",
                      icon: <Gauge className="w-4 h-4 text-amber-500" />,
                    },
                    {
                      id: "color",
                      label: "Color & Temp (4)",
                      icon: <Palette className="w-4 h-4 text-cyan-500" />,
                    },
                    {
                      id: "detail",
                      label: "Detail & Denoise (4)",
                      icon: <SlidersHorizontal className="w-4 h-4 text-violet-500" />,
                    },
                  ]}
                />

                {/* Master Strength Slider */}
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-muted-foreground">Master Strength:</span>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={settings.strength}
                    onChange={(e) => handleComponentChange("strength", Number(e.target.value))}
                    onMouseUp={handleSliderCommit}
                    onTouchEnd={handleSliderCommit}
                    className="w-24 accent-violet-500 cursor-pointer"
                  />
                  <span className="font-mono text-violet-500 w-8">{settings.strength}%</span>
                </div>
              </div>

              {/* Tab 1: Tone & Light Components */}
              {activeTab === "tone" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] animate-in fade-in duration-150">
                  {/* Exposure */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-foreground">Exposure</span>
                      <span className="font-mono text-violet-500">
                        {settings.exposure > 0 ? `+${settings.exposure}` : settings.exposure}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={settings.exposure}
                      onChange={(e) => handleComponentChange("exposure", Number(e.target.value))}
                      onMouseUp={handleSliderCommit}
                      onTouchEnd={handleSliderCommit}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                    <p className="text-[10px] text-muted-foreground">Linear EV master brightness</p>
                  </div>

                  {/* Contrast */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-foreground">Contrast</span>
                      <span className="font-mono text-violet-500">
                        {settings.contrast > 0 ? `+${settings.contrast}` : settings.contrast}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={settings.contrast}
                      onChange={(e) => handleComponentChange("contrast", Number(e.target.value))}
                      onMouseUp={handleSliderCommit}
                      onTouchEnd={handleSliderCommit}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                    <p className="text-[10px] text-muted-foreground">Midtone-centered S-curve</p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-foreground">Highlights</span>
                      <span className="font-mono text-violet-500">
                        {settings.highlights > 0 ? `+${settings.highlights}` : settings.highlights}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={settings.highlights}
                      onChange={(e) => handleComponentChange("highlights", Number(e.target.value))}
                      onMouseUp={handleSliderCommit}
                      onTouchEnd={handleSliderCommit}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                    <p className="text-[10px] text-muted-foreground">Recover blown bright areas</p>
                  </div>

                  {/* Shadows */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-foreground">Shadows</span>
                      <span className="font-mono text-violet-500">
                        {settings.shadows > 0 ? `+${settings.shadows}` : settings.shadows}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={settings.shadows}
                      onChange={(e) => handleComponentChange("shadows", Number(e.target.value))}
                      onMouseUp={handleSliderCommit}
                      onTouchEnd={handleSliderCommit}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                    <p className="text-[10px] text-muted-foreground">Lift dark underexposed zones</p>
                  </div>

                  {/* Whites */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-foreground">Whites</span>
                      <span className="font-mono text-violet-500">
                        {settings.whites > 0 ? `+${settings.whites}` : settings.whites}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={settings.whites}
                      onChange={(e) => handleComponentChange("whites", Number(e.target.value))}
                      onMouseUp={handleSliderCommit}
                      onTouchEnd={handleSliderCommit}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                    <p className="text-[10px] text-muted-foreground">Specular highlight clip point</p>
                  </div>

                  {/* Blacks */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-foreground">Blacks</span>
                      <span className="font-mono text-violet-500">
                        {settings.blacks > 0 ? `+${settings.blacks}` : settings.blacks}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={settings.blacks}
                      onChange={(e) => handleComponentChange("blacks", Number(e.target.value))}
                      onMouseUp={handleSliderCommit}
                      onTouchEnd={handleSliderCommit}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                    <p className="text-[10px] text-muted-foreground">True black anchor point</p>
                  </div>
                </div>
              )}

              {/* Tab 2: Color & White Balance Components */}
              {activeTab === "color" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] animate-in fade-in duration-150">
                  {/* Temperature */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-foreground">Temperature</span>
                      <span className="font-mono text-amber-500">
                        {settings.temperature > 0 ? `+${settings.temperature}` : settings.temperature}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={settings.temperature}
                      onChange={(e) => handleComponentChange("temperature", Number(e.target.value))}
                      onMouseUp={handleSliderCommit}
                      onTouchEnd={handleSliderCommit}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <p className="text-[10px] text-muted-foreground">Cool Blue &larr; &rarr; Warm Amber</p>
                  </div>

                  {/* Tint */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-foreground">Tint</span>
                      <span className="font-mono text-pink-500">
                        {settings.tint > 0 ? `+${settings.tint}` : settings.tint}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={settings.tint}
                      onChange={(e) => handleComponentChange("tint", Number(e.target.value))}
                      onMouseUp={handleSliderCommit}
                      onTouchEnd={handleSliderCommit}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                    <p className="text-[10px] text-muted-foreground">Green &larr; &rarr; Magenta</p>
                  </div>

                  {/* Vibrance */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-foreground">Smart Vibrance</span>
                      <span className="font-mono text-violet-500">
                        {settings.vibrance > 0 ? `+${settings.vibrance}` : settings.vibrance}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={settings.vibrance}
                      onChange={(e) => handleComponentChange("vibrance", Number(e.target.value))}
                      onMouseUp={handleSliderCommit}
                      onTouchEnd={handleSliderCommit}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                    <p className="text-[10px] text-muted-foreground">Boosts muted tones safely</p>
                  </div>

                  {/* Saturation */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-foreground">Saturation</span>
                      <span className="font-mono text-violet-500">
                        {settings.saturation > 0 ? `+${settings.saturation}` : settings.saturation}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={settings.saturation}
                      onChange={(e) => handleComponentChange("saturation", Number(e.target.value))}
                      onMouseUp={handleSliderCommit}
                      onTouchEnd={handleSliderCommit}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                    <p className="text-[10px] text-muted-foreground">Global chromatic intensity</p>
                  </div>
                </div>
              )}

              {/* Tab 3: Detail & Denoise Components */}
              {activeTab === "detail" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] animate-in fade-in duration-150">
                  {/* Clarity */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-foreground">Clarity / Texture</span>
                      <span className="font-mono text-violet-500">{settings.clarity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.clarity}
                      onChange={(e) => handleComponentChange("clarity", Number(e.target.value))}
                      onMouseUp={handleSliderCommit}
                      onTouchEnd={handleSliderCommit}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                    <p className="text-[10px] text-muted-foreground">Local micro-contrast &amp; pop</p>
                  </div>

                  {/* Sharpness */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-foreground">Edge Sharpness</span>
                      <span className="font-mono text-violet-500">{settings.sharpness}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.sharpness}
                      onChange={(e) => handleComponentChange("sharpness", Number(e.target.value))}
                      onMouseUp={handleSliderCommit}
                      onTouchEnd={handleSliderCommit}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                    <p className="text-[10px] text-muted-foreground">High-pass edge definition</p>
                  </div>

                  {/* Dehaze */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-foreground">Dehaze</span>
                      <span className="font-mono text-violet-500">
                        {settings.dehaze > 0 ? `+${settings.dehaze}` : settings.dehaze}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={settings.dehaze}
                      onChange={(e) => handleComponentChange("dehaze", Number(e.target.value))}
                      onMouseUp={handleSliderCommit}
                      onTouchEnd={handleSliderCommit}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                    <p className="text-[10px] text-muted-foreground">Cuts atmospheric glare/fog</p>
                  </div>

                  {/* Denoise */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-foreground">Bilateral Denoise</span>
                      <span className="font-mono text-violet-500">{settings.denoise}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.denoise}
                      onChange={(e) => handleComponentChange("denoise", Number(e.target.value))}
                      onMouseUp={handleSliderCommit}
                      onTouchEnd={handleSliderCommit}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                    <p className="text-[10px] text-muted-foreground">Smooths noise, keeps edges</p>
                  </div>
                </div>
              )}
            </div>

            {/* Export & Super-Resolution Bar */}
            <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Resolution Scale & Model Engine */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-muted-foreground">Upscale:</span>
                    <div className="flex bg-white/[0.04] backdrop-blur-md p-1 rounded-xl border border-white/10">
                      {([1, 2, 4] as const).map((sc) => (
                        <button
                          key={sc}
                          onClick={() => handleScaleChange(sc)}
                          className={`px-3 py-1 font-bold text-[11px] rounded-lg transition-all cursor-pointer ${
                            exportScale === sc
                              ? "bg-white/15 text-foreground shadow-xs border border-white/20"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {sc === 1 ? "1x (Original)" : `${sc}x Super-Res`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {exportScale > 1 && (
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-muted-foreground">Engine:</span>
                      <div className="flex bg-white/[0.04] backdrop-blur-md p-1 rounded-xl border border-white/10">
                        <button
                          onClick={() => handleMethodChange("real-esrgan")}
                          className={`flex items-center gap-1.5 px-2.5 py-1 font-bold text-[11px] rounded-lg transition-all cursor-pointer ${
                            upscaleMethod === "real-esrgan"
                              ? "bg-violet-600 text-white shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          title="Real-ESRGAN deep neural network running directly in-browser via ONNX Runtime & WebGPU"
                        >
                          <Sparkles className="w-3 h-3" />
                          Real-ESRGAN (AI Model)
                        </button>
                        <button
                          onClick={() => handleMethodChange("bicubic")}
                          className={`flex items-center gap-1.5 px-2.5 py-1 font-bold text-[11px] rounded-lg transition-all cursor-pointer ${
                            upscaleMethod === "bicubic"
                              ? "bg-white/15 text-foreground shadow-xs border border-white/20"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          title="Instant high-order bicubic interpolation with directional edge sharpening"
                        >
                          <Zap className="w-3 h-3" />
                          Classic High-Acuity
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Target Format */}
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-muted-foreground">Format:</span>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="bg-white/[0.04] backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-foreground font-semibold text-xs cursor-pointer"
                  >
                    <option value="jpg" className="bg-[#0d0d14] text-foreground">JPEG Photo</option>
                    <option value="png" className="bg-[#0d0d14] text-foreground">Lossless PNG</option>
                    <option value="webp" className="bg-[#0d0d14] text-foreground">WebP Next-Gen</option>
                  </select>
                </div>
              </div>

              {exportScale > 1 && upscaleMethod === "real-esrgan" && (
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-violet-500/5 border border-violet-500/20 text-[11px]">
                  <div className="flex items-center gap-2 text-violet-400 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                    <span>Real-ESRGAN General x4v3 Neural Network active (ONNX Runtime WebGPU/WASM)</span>
                  </div>
                  <span className="hidden sm:inline-block text-[10px] text-muted-foreground font-mono">
                    100% In-Browser ML • 0 Server Uploads
                  </span>
                </div>
              )}

              {/* Download Action */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2">
                <div className="text-right font-mono text-[11px] text-muted-foreground">
                  <div>
                    {enhancedWidth}×{enhancedHeight} px
                  </div>
                  <div>{enhancedSize ? formatFileSize(enhancedSize) : ""}</div>
                </div>

                <button
                  onClick={handleDownload}
                  disabled={isProcessing || !enhancedUrl}
                  className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-violet-500/20 disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download Enhanced Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Search Engine Rich Snippet JSON-LD & High-Authority SEO Content ── */}
      <ToolJsonLd
        name="Free AI Photo Enhancer & 4K Upscaler"
        description="Upscale image resolution to 4K, unblur photos, and restore fine details online with Real-ESRGAN neural networks and zero cloud uploads."
        url="/tools/enhance"
        category="MultimediaApplication"
        features={[
          "Real-ESRGAN General x4v3 neural network execution",
          "WebGPU and WebAssembly client-side AI acceleration",
          "2x and 4x Super-Resolution upscaling",
          "Magic Auto, Portrait Pro, HDR Landscape, and Night Recovery presets",
          "14 manual tone, color, and acuity adjustment sliders",
          "100% In-Browser execution with zero server uploads",
        ]}
        howTo={ENHANCE_HOW_TO_STEPS}
        faqs={ENHANCE_FAQS}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "AI Photo Enhancer", url: "/tools/enhance" },
        ]}
      />

      <ToolSeoContent
        toolName="Switchr AI Photo Enhancer"
        badge="Real-ESRGAN AI • Zero Cloud Uploads"
        heading="Free AI Photo Enhancer – 4K Upscaling & Clarity Restoration"
        subheading="Breathe new life into blurry, low-res, or vintage photos with state-of-the-art neural super-resolution running 100% locally on your device GPU."
        overviewParagraphs={[
          "Switchr's AI Photo Enhancer brings cutting-edge computer vision directly into your browser. Using the Real-ESRGAN neural network model compiled to WebGPU and WebAssembly, you can upscale low-resolution photos to 4K, sharpen blurry edges, recover shadow details from night shots, and enhance portrait skin tones without uploading a single photo to the cloud.",
          "Most commercial AI tools lock high-resolution downloads behind expensive monthly subscriptions or credit paywalls. Switchr is completely free, unlimited, and runs locally inside your browser sandbox, keeping your private family memories and creative assets 100% confidential.",
        ]}
        steps={ENHANCE_HOW_TO_STEPS}
        faqs={ENHANCE_FAQS}
        relatedLinks={[
          { label: "Image Converter", href: "/convert/images", desc: "Convert WebP, PNG, JPG, and HEIC photos.", badge: "Universal" },
          { label: "Smart File Compressor", href: "/compress", desc: "Reduce photo file sizes by up to 80%." },
          { label: "Convert HEIC to JPG", href: "/convert/heic-to-jpg", desc: "Convert iPhone camera photos for universal viewing." },
          { label: "Convert WebP to PNG", href: "/convert/webp-to-png", desc: "Export lossless PNG with full transparency." },
          { label: "Multi-Image to PDF", href: "/pdf-tools?tab=images", desc: "Compile enhanced photos into a clean PDF document." },
          { label: "All File Tools", href: "/tools", desc: "Explore the full suite of in-browser productivity utilities." },
        ]}
      />
    </div>
  );
}
