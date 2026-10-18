/**
 * Text-based utility converters for developer/programming formats.
 * All run client-side with no external dependencies.
 */

// ─── TSV ↔ CSV ────────────────────────────────────────────────

export function csvToTsv(csvStr: string): string {
  return csvStr
    .split(/\r?\n/)
    .map((line) => {
      const fields = parseCsvLine(line);
      return fields.map((f) => f.replace(/\t/g, " ")).join("\t");
    })
    .join("\n");
}

export function tsvToCsv(tsvStr: string): string {
  return tsvStr
    .split(/\r?\n/)
    .map((line) => {
      const fields = line.split("\t");
      return fields
        .map((f) => {
          if (f.includes(",") || f.includes('"') || f.includes("\n")) {
            return `"${f.replace(/"/g, '""')}"`;
          }
          return f;
        })
        .join(",");
    })
    .join("\n");
}

// ─── Markdown → HTML ──────────────────────────────────────────

export async function markdownToHtml(mdStr: string): Promise<string> {
  const { marked } = await import("marked");
  const htmlBody = await marked(mdStr);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Converted Document</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; color: #1a1a1a; }
    h1, h2, h3 { margin-top: 1.5em; }
    pre { background: #f5f5f5; padding: 16px; border-radius: 8px; overflow-x: auto; }
    code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    pre code { background: none; padding: 0; }
    blockquote { border-left: 4px solid #ddd; margin: 1em 0; padding: 0.5em 1em; color: #666; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    th { background: #f5f5f5; }
    img { max-width: 100%; }
  </style>
</head>
<body>
${htmlBody}
</body>
</html>`;
}

export function htmlToText(htmlStr: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlStr, "text/html");
  return doc.body.textContent || "";
}

// ─── JSON Formatter / Minifier ────────────────────────────────

export function formatJson(jsonStr: string): string {
  const data = JSON.parse(jsonStr);
  return JSON.stringify(data, null, 2);
}

export function minifyJson(jsonStr: string): string {
  const data = JSON.parse(jsonStr);
  return JSON.stringify(data);
}

export function validateJson(jsonStr: string): string | null {
  try {
    JSON.parse(jsonStr);
    return null;
  } catch (e: any) {
    return e.message || "Invalid JSON";
  }
}

// ─── XML Formatter ────────────────────────────────────────────

export function formatXml(xmlStr: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlStr, "application/xml");

  const parseError = doc.querySelector("parsererror");
  if (parseError) {
    throw new Error("Invalid XML: " + parseError.textContent);
  }

  const serializer = new XMLSerializer();
  const raw = serializer.serializeToString(doc);

  // Pretty-print with indentation
  let formatted = "";
  let indent = 0;
  const lines = raw.replace(/>\s*</g, ">\n<").split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("</")) {
      indent = Math.max(0, indent - 1);
    }

    formatted += "  ".repeat(indent) + trimmed + "\n";

    if (
      trimmed.startsWith("<") &&
      !trimmed.startsWith("</") &&
      !trimmed.startsWith("<?") &&
      !trimmed.endsWith("/>") &&
      !trimmed.includes("</")
    ) {
      indent++;
    }
  }

  return formatted.trim();
}

// ─── Base64 Encode / Decode ───────────────────────────────────

export function base64Encode(input: string): string {
  return btoa(
    new TextEncoder()
      .encode(input)
      .reduce((data, byte) => data + String.fromCharCode(byte), "")
  );
}

export function base64Decode(b64: string): string {
  try {
    const binary = atob(b64.trim());
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    throw new Error("Invalid Base64 string");
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix
      const base64 = result.split(",")[1] || result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function base64ToBlob(b64: string, mimeType = "application/octet-stream"): Blob {
  const binary = atob(b64.trim());
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

// ─── URL Encode / Decode ──────────────────────────────────────

export function urlEncode(input: string): string {
  return encodeURIComponent(input);
}

export function urlDecode(input: string): string {
  return decodeURIComponent(input);
}

// ─── Binary ↔ Hex ─────────────────────────────────────────────

export function textToHex(input: string): string {
  return Array.from(new TextEncoder().encode(input))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
}

export function hexToText(hex: string): string {
  const bytes = hex
    .trim()
    .split(/\s+/)
    .map((h) => parseInt(h, 16));
  return new TextDecoder().decode(new Uint8Array(bytes));
}

export async function fileToHex(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
}

// ─── File Checksums ───────────────────────────────────────────

export async function fileChecksum(
  file: File,
  algorithm: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512" = "SHA-256"
): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ─── CSV Cleanup ──────────────────────────────────────────────

export function removeDuplicateRows(csvStr: string): { result: string; removed: number } {
  const lines = csvStr.trim().split(/\r?\n/);
  if (lines.length <= 1) return { result: csvStr, removed: 0 };

  const header = lines[0];
  const seen = new Set<string>();
  const unique: string[] = [header];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (!seen.has(line)) {
      seen.add(line);
      unique.push(line);
    }
  }

  const removed = lines.length - unique.length;
  return { result: unique.join("\n"), removed };
}

export function trimCsvWhitespace(csvStr: string): string {
  return csvStr
    .split(/\r?\n/)
    .map((line) => {
      const fields = parseCsvLine(line);
      return fields
        .map((f) => f.trim())
        .map((f) => {
          if (f.includes(",") || f.includes('"') || f.includes("\n")) {
            return `"${f.replace(/"/g, '""')}"`;
          }
          return f;
        })
        .join(",");
    })
    .join("\n");
}

// ─── Internal Helpers ─────────────────────────────────────────

function parseCsvLine(text: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
