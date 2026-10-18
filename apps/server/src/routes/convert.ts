import { Router, Request, Response } from "express";
import yaml from "js-yaml";
import { marked } from "marked";
import multer from "multer";

export const convertRouter = Router();
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

// ─── Text / Code Conversions ──────────────────────────────────
convertRouter.post("/text", async (req: Request, res: Response) => {
  const { content, from, to } = req.body;

  if (typeof content !== "string") {
    return res.status(400).json({ success: false, error: "Content must be a string" });
  }

  try {
    let result = "";
    let mimeType = "text/plain";

    if ((from === "md" || from === "markdown") && to === "html") {
      const htmlBody = await marked(content);
      result = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Converted Document</title></head><body>${htmlBody}</body></html>`;
      mimeType = "text/html";
    } else if (from === "yaml" && to === "json") {
      const data = yaml.load(content);
      result = JSON.stringify(data, null, 2);
      mimeType = "application/json";
    } else if (from === "json" && to === "yaml") {
      const data = JSON.parse(content);
      result = yaml.dump(data, { indent: 2 });
      mimeType = "text/yaml";
    } else if (from === "csv" && to === "tsv") {
      result = content.split(/\r?\n/).map((l) => l.replace(/,/g, "\t")).join("\n");
      mimeType = "text/tab-separated-values";
    } else if (from === "tsv" && to === "csv") {
      result = content.split(/\r?\n/).map((l) => l.replace(/\t/g, ",")).join("\n");
      mimeType = "text/csv";
    } else {
      result = content;
    }

    res.json({ success: true, result, mimeType });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Conversion failed" });
  }
});

// ─── Subtitle Conversions ─────────────────────────────────────
convertRouter.post("/subtitles", (req: Request, res: Response) => {
  const { content, from, to } = req.body;

  if (typeof content !== "string") {
    return res.status(400).json({ success: false, error: "Subtitle content is required" });
  }

  try {
    let result = "";
    if (from === "srt" && to === "vtt") {
      result = "WEBVTT\n\n" + content.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
    } else if (from === "vtt" && to === "srt") {
      result = content
        .replace(/^WEBVTT[^\n]*\n+/i, "")
        .replace(/(\d{2}:\d{2}:\d{2})\.(\d{3})/g, "$1,$2")
        .trim();
    } else {
      result = content;
    }

    res.json({ success: true, result, from, to });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Failed to convert subtitles" });
  }
});

// ─── Multipart File Conversion (Upload Handler) ───────────────
convertRouter.post("/file", upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file uploaded" });
  }

  const targetFormat = req.body.toFormat || "txt";
  const originalName = req.file.originalname;
  const buffer = req.file.buffer;

  res.json({
    success: true,
    message: `File ${originalName} received for conversion to ${targetFormat}`,
    fileName: originalName,
    size: buffer.length,
    targetFormat,
  });
});
