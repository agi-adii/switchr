"use client";

import { useState, useRef, useCallback } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GlassPillTabs } from "@/components/ui/glass-pill-tabs";
import { BeforeAfterSlider } from "@/components/enhancer/before-after-slider";
import { ImageHistogram } from "@/components/enhancer/histogram";
import {
  enhanceImageFile,
  autoCalibrateImage,
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
  Sliders,
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
  Layers,
  Activity,
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
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Execute enhancement pipeline
  const runEnhancement = useCallback(
    async (file: File | Blob, currentSettings: EnhanceSettings, scale: 1 | 2 | 4) => {
      setIsProcessing(true);
      setProgress(0.1);
      try {
        const activeSettings: EnhanceSettings = {
          ...currentSettings,
          scale,
        };

        const res = await enhanceImageFile(file, activeSettings, (p) => {
          setProgress(p);
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
      }
    },
    []
  );

  // Load a file into workspace
  const handleLoadImage = useCallback(
    async (fileOrBlob: File | Blob, name = "photo.jpg") => {
      setSelectedFile(fileOrBlob);
      setFileName(name);
      const url = URL.createObjectURL(fileOrBlob);
      setOriginalUrl(url);

      const img = new Image();
      img.src = url;
      await new Promise<void>((resolve) => {
        img.onload = () => {
          setOriginalWidth(img.naturalWidth);
          setOriginalHeight(img.naturalHeight);
          resolve();
        };
      });

      runEnhancement(fileOrBlob, settings, exportScale);
    },
    [settings, exportScale, runEnhancement]
  );

  // AI Auto-Calibrate (scans histogram and sets exact component values)
  const handleAutoCalibrate = async () => {
    if (!selectedFile) return;
    const toastId = toast.loading("AI scanning image components...");

    try {
      const img = new Image();
      img.src = originalUrl;
      await new Promise<void>((r) => (img.onload = () => r()));

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
    } catch (err) {
      toast.error("Auto-calibration failed", { id: toastId });
    }
  };

  // Switch preset
  const handleSelectPreset = (presetKey: keyof typeof ENHANCE_PRESETS) => {
    const newSettings = { ...ENHANCE_PRESETS[presetKey], scale: exportScale };
    setSettings(newSettings);
    if (selectedFile) {
      runEnhancement(selectedFile, newSettings, exportScale);
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
      runEnhancement(selectedFile, settings, exportScale);
    }, 120);
  };

  // Reset all components to neutral
  const handleResetComponents = () => {
    setSettings({ ...DEFAULT_SETTINGS, scale: exportScale });
    if (selectedFile) {
      runEnhancement(selectedFile, { ...DEFAULT_SETTINGS, scale: exportScale }, exportScale);
    }
    toast.info("Reset all components to neutral");
  };

  // Handle upscale resolution
  const handleScaleChange = (scale: 1 | 2 | 4) => {
    setExportScale(scale);
    if (selectedFile) {
      runEnhancement(selectedFile, settings, scale);
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
      fromFormat: fileName.split(".").pop() || "image",
      toFormat: exportFormat,
      originalSize: selectedFile?.size || 0,
      convertedSize: enhancedSize || 0,
      downloadUrl: enhancedUrl,
      category: "image",
    });

    toast.success("Enhanced photo downloaded successfully!");
  };

  // Reset workspace
  const handleReset = () => {
    setSelectedFile(null);
    setFileName("");
    setOriginalUrl("");
    setEnhancedUrl("");
    setOriginalWidth(0);
    setOriginalHeight(0);
    setEnhancedWidth(0);
    setEnhancedHeight(0);
    setHistogramData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Load sample image
  const handleLoadSample = async (samplePath: string, name: string) => {
    const toastId = toast.loading(`Loading sample image "${name}"...`);
    try {
      const res = await fetch(samplePath);
      const blob = await res.blob();
      await handleLoadImage(blob, name);
      toast.success(`Loaded ${name}`, { id: toastId });
    } catch (err) {
      toast.error("Failed to load sample image", { id: toastId });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "AI Photo Enhancer" }]} />

      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-500 text-xs font-bold mb-2 border border-violet-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          Accurate Multi-Component AI Vision Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          AI Photo Enhancer &amp; Super-Resolution
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          Independently adjust and balance all photo components — tone zones, white balance, micro-texture, and upscaling — with zero color distortion.
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
            className={`border-2 border-dashed rounded-3xl p-12 sm:p-16 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-violet-500 bg-violet-500/5 scale-[0.99]"
                : "border-border bg-card hover:border-violet-500/50 hover:bg-muted/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleLoadImage(e.target.files[0], e.target.files[0].name);
                }
              }}
            />
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">
              Drop your photo here, or{" "}
              <span className="text-violet-500 underline underline-offset-2">browse files</span>
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Supports JPG, PNG, WebP, HEIC, and BMP. Processed 100% client-side with zero server uploads.
            </p>
          </div>

          {/* Instant Sample Photos */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <Sparkles className="w-3.5 h-3.5 text-violet-500" />
              Don&apos;t have a photo? Test with an instant demo sample:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() =>
                  handleLoadSample("/samples/sample-landscape.svg", "golden-hour-landscape.jpg")
                }
                className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-muted/30 hover:bg-muted/60 hover:border-violet-500/40 text-left transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-900 border border-border shrink-0 flex items-center justify-center">
                  <img
                    src="/samples/sample-landscape.svg"
                    alt="Landscape sample"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground group-hover:text-violet-500 transition-colors">
                    Golden Hour Mountain Landscape
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Tests shadow recovery, sky vibrance &amp; contrast
                  </p>
                </div>
              </button>

              <button
                onClick={() =>
                  handleLoadSample("/samples/sample-portrait.svg", "studio-portrait.jpg")
                }
                className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-muted/30 hover:bg-muted/60 hover:border-violet-500/40 text-left transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-900 border border-border shrink-0 flex items-center justify-center">
                  <img
                    src="/samples/sample-portrait.svg"
                    alt="Portrait sample"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground group-hover:text-violet-500 transition-colors">
                    Studio Lighting Portrait
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Tests skin tone preservation, eye detail &amp; facial clarity
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Active Workspace View */
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center shrink-0">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{fileName}</p>
                <p className="text-[11px] text-muted-foreground font-mono">
                  {originalWidth}×{originalHeight} px •{" "}
                  {selectedFile ? formatFileSize(selectedFile.size) : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* AI Auto-Calibrate Button */}
              <button
                onClick={handleAutoCalibrate}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                title="Automatically scan image histogram and dial in exact optimal parameters"
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Auto-Calibrate
              </button>

              {isProcessing && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-500 text-xs font-bold animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {Math.round(progress * 100)}%
                </span>
              )}

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-xl border border-border bg-muted/40 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change Photo
              </button>
            </div>
          </div>

          {/* Interactive Before / After Split Slider */}
          <div className="bg-card border border-border rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
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
              <div className="aspect-[16/10] w-full rounded-2xl bg-muted/30 flex items-center justify-center text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
              </div>
            )}

            {/* Live Component Histogram */}
            <ImageHistogram data={histogramData} />

            {/* 1-Click Smart Presets */}
            <div className="space-y-2 pt-2 border-t border-border">
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
                      className={`relative flex flex-col p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isActive
                          ? "border-violet-500 bg-violet-500/10 shadow-xs scale-[1.02]"
                          : "border-border bg-muted/30 hover:bg-muted/60 hover:border-violet-500/30"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-muted/20 border border-border animate-in fade-in duration-150">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-muted/20 border border-border animate-in fade-in duration-150">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-muted/20 border border-border animate-in fade-in duration-150">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {/* Resolution Scale */}
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-muted-foreground">Upscale:</span>
                  <div className="flex bg-muted/60 p-1 rounded-xl border border-border">
                    {([1, 2, 4] as const).map((sc) => (
                      <button
                        key={sc}
                        onClick={() => handleScaleChange(sc)}
                        className={`px-3 py-1 font-bold text-[11px] rounded-lg transition-all cursor-pointer ${
                          exportScale === sc
                            ? "bg-card text-foreground shadow-xs border border-border"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {sc === 1 ? "1x (Original)" : `${sc}x Super-Res`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Format */}
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-muted-foreground">Format:</span>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="bg-muted px-2.5 py-1 rounded-lg border border-border text-foreground font-semibold text-xs cursor-pointer"
                  >
                    <option value="jpg">JPEG Photo</option>
                    <option value="png">Lossless PNG</option>
                    <option value="webp">WebP Next-Gen</option>
                  </select>
                </div>
              </div>

              {/* Download Action */}
              <div className="flex items-center gap-3">
                <div className="text-right font-mono text-[11px] text-muted-foreground hidden sm:block">
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
    </div>
  );
}
