export function jsonToCsv(jsonStr: string): string {
  let data: any;
  try {
    data = JSON.parse(jsonStr);
  } catch {
    throw new Error("Invalid JSON format. Please provide valid JSON.");
  }

  const items = Array.isArray(data) ? data : [data];
  if (items.length === 0) return "";

  // Extract unique headers across all objects
  const headersSet = new Set<string>();
  items.forEach((item) => {
    if (typeof item === "object" && item !== null) {
      Object.keys(item).forEach((key) => headersSet.add(key));
    }
  });

  const headers = Array.from(headersSet);
  if (headers.length === 0) {
    return "Value\n" + items.map((i) => `"${String(i).replace(/"/g, '""')}"`).join("\n");
  }

  const escapeCsv = (val: any): string => {
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
      const val = typeof item === "object" && item !== null ? item[header] : "";
      return escapeCsv(val);
    });
    csvRows.push(row.join(","));
  }

  return csvRows.join("\n");
}

export function csvToJson(csvStr: string): any[] {
  const lines = csvStr.trim().split(/\r?\n/);
  if (lines.length < 1) return [];

  // Parse CSV line handling quotes
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
  const rows: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseLine(lines[i]);
    const obj: Record<string, any> = {};

    headers.forEach((header, index) => {
      let val: any = values[index] ?? "";
      // Type coercion for numbers
      if (val !== "" && !isNaN(Number(val))) {
        val = Number(val);
      } else if (val.toLowerCase() === "true") {
        val = true;
      } else if (val.toLowerCase() === "false") {
        val = false;
      }
      obj[header || `col_${index + 1}`] = val;
    });

    rows.push(obj);
  }

  return rows;
}

export function jsonToXml(jsonStr: string, rootElement = "root"): string {
  const data = JSON.parse(jsonStr);

  const toXml = (obj: any, tagName: string): string => {
    if (obj === null || obj === undefined) return `<${tagName}/>`;
    if (typeof obj !== "object") {
      const safe = String(obj)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `<${tagName}>${safe}</${tagName}>`;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => toXml(item, tagName)).join("\n");
    }

    const children = Object.keys(obj)
      .map((key) => toXml(obj[key], key))
      .join("\n  ");
    return `<${tagName}>\n  ${children}\n</${tagName}>`;
  };

  return `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(data, rootElement)}`;
}

export function xmlToJson(xmlStr: string): any {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlStr, "application/xml");

  const parseError = xmlDoc.querySelector("parsererror");
  if (parseError) {
    throw new Error("Invalid XML document: " + parseError.textContent);
  }

  const nodeToObject = (node: Node): any => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue?.trim() || "";
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const obj: Record<string, any> = {};

      if (element.attributes.length > 0) {
        obj["@attributes"] = {};
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i];
          obj["@attributes"][attr.name] = attr.value;
        }
      }

      const children = Array.from(element.childNodes).filter(
        (c) => c.nodeType === Node.ELEMENT_NODE || (c.nodeType === Node.TEXT_NODE && c.nodeValue?.trim())
      );

      if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
        const textVal = children[0].nodeValue?.trim() || "";
        return Object.keys(obj).length > 0 ? { ...obj, value: textVal } : textVal;
      }

      children.forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const childName = (child as Element).tagName;
          const childVal = nodeToObject(child);

          if (obj[childName]) {
            if (!Array.isArray(obj[childName])) {
              obj[childName] = [obj[childName]];
            }
            obj[childName].push(childVal);
          } else {
            obj[childName] = childVal;
          }
        }
      });

      return obj;
    }

    return null;
  };

  return { [xmlDoc.documentElement.tagName]: nodeToObject(xmlDoc.documentElement) };
}
