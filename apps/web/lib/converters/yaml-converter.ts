import yaml from "js-yaml";

/**
 * Convert JSON string to YAML string.
 */
export function jsonToYaml(jsonStr: string): string {
  let data: unknown;
  try {
    data = JSON.parse(jsonStr);
  } catch {
    throw new Error("Invalid JSON format. Please provide valid JSON.");
  }
  return yaml.dump(data, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    sortKeys: false,
  });
}

/**
 * Convert YAML string to JSON string (pretty-printed).
 */
export function yamlToJson(yamlStr: string): string {
  let data: unknown;
  try {
    data = yaml.load(yamlStr);
  } catch (e: any) {
    throw new Error("Invalid YAML format: " + (e.message || "Parse error"));
  }
  return JSON.stringify(data, null, 2);
}

/**
 * Convert YAML string to XML string.
 */
export function yamlToXml(yamlStr: string, rootElement = "root"): string {
  const data = yaml.load(yamlStr);
  // Reuse our JSON→XML path
  const jsonStr = JSON.stringify(data);
  return jsonToXmlDirect(JSON.parse(jsonStr), rootElement);
}

/**
 * Convert CSV string to YAML string.
 */
export function csvToYaml(csvStr: string): string {
  const lines = csvStr.trim().split(/\r?\n/);
  if (lines.length < 1) return "";

  const parseLine = (text: string): string[] => {
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
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows: Record<string, unknown>[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseLine(lines[i]);
    const obj: Record<string, unknown> = {};
    headers.forEach((header, index) => {
      let val: unknown = values[index] ?? "";
      if (typeof val === "string" && val !== "" && !isNaN(Number(val))) {
        val = Number(val);
      }
      obj[header || `col_${index + 1}`] = val;
    });
    rows.push(obj);
  }

  return yaml.dump(rows, { indent: 2, lineWidth: 120, noRefs: true });
}

/**
 * Convert YAML to CSV string.
 */
export function yamlToCsv(yamlStr: string): string {
  const data = yaml.load(yamlStr);
  const items = Array.isArray(data) ? data : [data];

  if (items.length === 0) return "";

  const headersSet = new Set<string>();
  items.forEach((item: any) => {
    if (typeof item === "object" && item !== null) {
      Object.keys(item).forEach((key) => headersSet.add(key));
    }
  });

  const headers = Array.from(headersSet);
  if (headers.length === 0) return "";

  const escapeCsv = (val: unknown): string => {
    if (val === null || val === undefined) return "";
    const str = typeof val === "object" ? JSON.stringify(val) : String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvRows: string[] = [];
  csvRows.push(headers.map(escapeCsv).join(","));

  for (const item of items) {
    const row = headers.map((header) => {
      const val = typeof item === "object" && item !== null ? (item as any)[header] : "";
      return escapeCsv(val);
    });
    csvRows.push(row.join(","));
  }

  return csvRows.join("\n");
}

/**
 * Format / pretty-print YAML string.
 */
export function formatYaml(yamlStr: string): string {
  const data = yaml.load(yamlStr);
  return yaml.dump(data, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    sortKeys: true,
  });
}

/**
 * Validate YAML and return error or null.
 */
export function validateYaml(yamlStr: string): string | null {
  try {
    yaml.load(yamlStr);
    return null;
  } catch (e: any) {
    return e.message || "Invalid YAML";
  }
}

// Internal helper
function jsonToXmlDirect(obj: any, tagName: string): string {
  if (obj === null || obj === undefined) return `<${tagName}/>`;
  if (typeof obj !== "object") {
    const safe = String(obj)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<${tagName}>${safe}</${tagName}>`;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => jsonToXmlDirect(item, tagName)).join("\n");
  }

  const children = Object.keys(obj)
    .map((key) => jsonToXmlDirect(obj[key], key))
    .join("\n  ");
  return `<${tagName}>\n  ${children}\n</${tagName}>`;
}
