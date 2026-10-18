"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { formatFileSize } from "@/lib/registry";
import { UploadCloud, Image as ImageIcon, Copy, Check, Info } from "lucide-react";
import { toast } from "sonner";

interface ImageMeta {
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
  aspectRatio: string;
  lastModified: string;
}

export default function ImageMetadataPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ImageMeta | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);

      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);

      const img = new Image();
      img.onload = () => {
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
        const divisor = gcd(img.width, img.height);
        const aspect = `${img.width / divisor}:${img.height / divisor}`;

        setMetadata({
          name: selected.name,
          size: selected.size,
          type: selected.type || "image/*",
          width: img.width,
          height: img.height,
          aspectRatio: aspect,
          lastModified: new Date(selected.lastModified).toLocaleString(),
        });
        toast.success(`Loaded metadata for ${selected.name}`);
      };
      img.src = url;
    }
  };

  const handleCopyJson = () => {
    if (!metadata) return;
    navigator.clipboard.writeText(JSON.stringify(metadata, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Metadata copied as JSON");
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Image Metadata" }]} />

      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Image Metadata Inspector
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Inspect image resolution, aspect ratio, file size, color properties, and timestamps without uploading to any server.
        </p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Upload dropzone */}
        <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:bg-muted/20 transition-colors">
          <input
            type="file"
            id="img-meta-file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="img-meta-file" className="cursor-pointer space-y-3 flex flex-col items-center">
            <UploadCloud className="w-10 h-10 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {file ? file.name : "Select or drop any image"}
              </p>
              <p className="text-xs text-muted-foreground">JPG, PNG, WebP, AVIF, SVG, GIF, BMP, TIFF</p>
            </div>
          </label>
        </div>

        {metadata && previewUrl && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-2">
            {/* Image Preview */}
            <div className="flex flex-col items-center justify-center p-4 bg-muted/20 border border-border rounded-2xl space-y-2">
              <img
                src={previewUrl}
                alt={metadata.name}
                className="max-h-72 object-contain rounded-xl shadow-sm"
              />
              <span className="text-[11px] font-mono text-muted-foreground">
                {metadata.width} × {metadata.height} px
              </span>
            </div>

            {/* Metadata Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Metadata Properties</span>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold rounded-lg border border-border transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy JSON"}
                </button>
              </div>

              <div className="divide-y divide-border rounded-2xl border border-border bg-background overflow-hidden text-xs">
                {[
                  { label: "File Name", val: metadata.name },
                  { label: "Dimensions", val: `${metadata.width} × ${metadata.height} px` },
                  { label: "Aspect Ratio", val: metadata.aspectRatio },
                  { label: "File Size", val: formatFileSize(metadata.size) },
                  { label: "MIME Type", val: metadata.type },
                  { label: "Total Pixels", val: `${(metadata.width * metadata.height).toLocaleString()} px` },
                  { label: "Last Modified", val: metadata.lastModified },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between p-3 hover:bg-muted/30">
                    <span className="text-muted-foreground font-medium">{row.label}</span>
                    <span className="font-mono text-foreground font-semibold text-right max-w-[200px] truncate">
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
