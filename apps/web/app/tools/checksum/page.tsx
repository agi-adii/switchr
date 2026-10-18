"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { fileChecksum } from "@/lib/converters/text-utils";
import { formatFileSize } from "@/lib/registry";
import { ShieldCheck, UploadCloud, Copy, Check, FileCheck, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Hashes {
  sha1: string;
  sha256: string;
  sha384: string;
  sha512: string;
}

export default function ChecksumPage() {
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<Hashes | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [expectedHash, setExpectedHash] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setIsCalculating(true);
      setHashes(null);
      const toastId = toast.loading(`Calculating hashes for ${selected.name}...`);

      try {
        const [sha1, sha256, sha384, sha512] = await Promise.all([
          fileChecksum(selected, "SHA-1"),
          fileChecksum(selected, "SHA-256"),
          fileChecksum(selected, "SHA-384"),
          fileChecksum(selected, "SHA-512"),
        ]);

        setHashes({ sha1, sha256, sha384, sha512 });
        toast.success("Hashes computed successfully", { id: toastId });
      } catch (err: any) {
        toast.error("Failed to compute file checksum", { id: toastId });
      } finally {
        setIsCalculating(false);
      }
    }
  };

  const handleCopy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    toast.success("Checksum copied to clipboard");
  };

  const matchesExpected = hashes && expectedHash.trim()
    ? Object.values(hashes).some((h) => h.toLowerCase() === expectedHash.trim().toLowerCase())
    : null;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "File Checksum" }]} />

      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          File Checksum & Hash Generator
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Verify file integrity and generate cryptographic hashes (SHA-256, SHA-1, SHA-512) directly on your device.
        </p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Upload Dropzone */}
        <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:bg-muted/20 transition-colors">
          <input type="file" id="checksum-file" onChange={handleFileUpload} className="hidden" />
          <label htmlFor="checksum-file" className="cursor-pointer space-y-3 flex flex-col items-center">
            <UploadCloud className="w-10 h-10 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {file ? file.name : "Select or drop any file to compute hashes"}
              </p>
              <p className="text-xs text-muted-foreground">
                {file ? `${formatFileSize(file.size)} • Click to replace` : "Processed 100% locally with Web Crypto API"}
              </p>
            </div>
          </label>
        </div>

        {/* Verification Check */}
        {hashes && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2">
              <label className="block text-xs font-bold text-foreground">
                Verify Against Expected Hash (Optional)
              </label>
              <input
                type="text"
                value={expectedHash}
                onChange={(e) => setExpectedHash(e.target.value)}
                placeholder="Paste expected SHA-256 or SHA-1 hash to verify authenticity..."
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {expectedHash.trim() && (
                <div className="flex items-center gap-2 pt-1">
                  {matchesExpected ? (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Checksum MATCHES! File is authentic and verified.</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
                      <XCircle className="w-4 h-4" />
                      <span>Checksum DOES NOT MATCH the computed hashes.</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hashes List */}
            <div className="space-y-3">
              {[
                { label: "SHA-256 (Recommended)", key: "sha256", val: hashes.sha256 },
                { label: "SHA-1 (Legacy)", key: "sha1", val: hashes.sha1 },
                { label: "SHA-512 (High Security)", key: "sha512", val: hashes.sha512 },
                { label: "SHA-384", key: "sha384", val: hashes.sha384 },
              ].map(({ label, key, val }) => (
                <div key={key} className="p-4 rounded-xl bg-muted/20 border border-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">{label}</span>
                    <button
                      onClick={() => handleCopy(val, key)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-background hover:bg-muted text-foreground text-[11px] font-semibold rounded-lg border border-border transition-colors"
                    >
                      {copiedKey === key ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-muted-foreground" />
                      )}
                      {copiedKey === key ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="text-xs font-mono break-all text-muted-foreground select-all bg-background p-2 rounded-lg border border-border/50">
                    {val}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
