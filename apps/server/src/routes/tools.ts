import { Router, Request, Response } from "express";
import crypto from "crypto";
import QRCode from "qrcode";
import yaml from "js-yaml";
import multer from "multer";

export const toolsRouter = Router();
const upload = multer({ limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB limit

// ─── File Checksum (Node.js Crypto) ───────────────────────────
toolsRouter.post("/checksum", upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "File required for checksum" });
  }

  const buffer = req.file.buffer;
  const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");
  const sha1 = crypto.createHash("sha1").update(buffer).digest("hex");
  const sha512 = crypto.createHash("sha512").update(buffer).digest("hex");
  const md5 = crypto.createHash("md5").update(buffer).digest("hex");

  res.json({
    success: true,
    fileName: req.file.originalname,
    fileSize: buffer.length,
    hashes: { sha256, sha1, sha512, md5 },
  });
});

// ─── QR Code Generator ────────────────────────────────────────
toolsRouter.post("/qr", async (req: Request, res: Response) => {
  const { text, dark = "#000000", light = "#ffffff" } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ success: false, error: "Text string required" });
  }

  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: 400,
      margin: 2,
      color: { dark, light },
    });
    res.json({ success: true, dataUrl });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Failed to generate QR" });
  }
});

// ─── Base64 Encode / Decode ───────────────────────────────────
toolsRouter.post("/base64", (req: Request, res: Response) => {
  const { input, action } = req.body; // action: 'encode' | 'decode'

  if (typeof input !== "string") {
    return res.status(400).json({ success: false, error: "Input string required" });
  }

  try {
    if (action === "decode") {
      const decoded = Buffer.from(input, "base64").toString("utf-8");
      return res.json({ success: true, result: decoded });
    }
    const encoded = Buffer.from(input, "utf-8").toString("base64");
    res.json({ success: true, result: encoded });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || "Base64 processing failed" });
  }
});

// ─── URL Encode / Decode ──────────────────────────────────────
toolsRouter.post("/url", (req: Request, res: Response) => {
  const { input, action } = req.body;

  if (typeof input !== "string") {
    return res.status(400).json({ success: false, error: "Input string required" });
  }

  try {
    if (action === "decode") {
      return res.json({ success: true, result: decodeURIComponent(input) });
    }
    res.json({ success: true, result: encodeURIComponent(input) });
  } catch {
    res.status(400).json({ success: false, error: "Invalid URL string" });
  }
});

// ─── JSON Formatter / Minifier ────────────────────────────────
toolsRouter.post("/json-format", (req: Request, res: Response) => {
  const { input, minify = false } = req.body;
  try {
    const data = JSON.parse(input);
    const result = minify ? JSON.stringify(data) : JSON.stringify(data, null, 2);
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || "Invalid JSON" });
  }
});

// ─── YAML Formatter ───────────────────────────────────────────
toolsRouter.post("/yaml-format", (req: Request, res: Response) => {
  const { input } = req.body;
  try {
    const data = yaml.load(input);
    const result = yaml.dump(data, { indent: 2, sortKeys: true });
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || "Invalid YAML" });
  }
});

// ─── CSV Cleanup ──────────────────────────────────────────────
toolsRouter.post("/csv-clean", (req: Request, res: Response) => {
  const { csv } = req.body;
  if (!csv || typeof csv !== "string") {
    return res.status(400).json({ success: false, error: "CSV string required" });
  }

  const lines = csv.trim().split(/\r?\n/);
  if (lines.length <= 1) return res.json({ success: true, result: csv, removed: 0 });

  const header = lines[0];
  const seen = new Set<string>();
  const unique = [header];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (!seen.has(line)) {
      seen.add(line);
      unique.push(line);
    }
  }

  res.json({
    success: true,
    result: unique.join("\n"),
    removed: lines.length - unique.length,
  });
});
