"use client";

import { ConverterTemplate } from "@/components/converter-template";
import { jsonToYaml, yamlToJson, yamlToXml, csvToYaml } from "@/lib/converters/yaml-converter";
import { csvToTsv, tsvToCsv, markdownToHtml } from "@/lib/converters/text-utils";
import { jsonToXml, xmlToJson } from "@/lib/converters/data-converter";

export default function ProgrammingConverterPage() {
  const handleConvert = async (
    file: File,
    toFormat: string,
    onProgress: (p: number) => void
  ) => {
    onProgress(0.2);
    const text = await file.text();
    onProgress(0.5);

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    let outputText = "";
    let mimeType = "text/plain";

    if (ext === "yml" || ext === "yaml") {
      if (toFormat === "json") {
        outputText = yamlToJson(text);
        mimeType = "application/json";
      } else if (toFormat === "xml") {
        outputText = yamlToXml(text);
        mimeType = "application/xml";
      } else {
        outputText = text;
      }
    } else if (ext === "json") {
      if (toFormat === "yaml" || toFormat === "yml") {
        outputText = jsonToYaml(text);
        mimeType = "text/yaml";
      } else if (toFormat === "xml") {
        outputText = jsonToXml(text);
        mimeType = "application/xml";
      } else {
        outputText = text;
      }
    } else if (ext === "md" || ext === "markdown") {
      if (toFormat === "html") {
        outputText = await markdownToHtml(text);
        mimeType = "text/html";
      } else {
        outputText = text;
      }
    } else if (ext === "tsv") {
      if (toFormat === "csv") {
        outputText = tsvToCsv(text);
        mimeType = "text/csv";
      } else {
        outputText = text;
      }
    } else if (ext === "csv") {
      if (toFormat === "tsv") {
        outputText = csvToTsv(text);
        mimeType = "text/tab-separated-values";
      } else if (toFormat === "yaml") {
        outputText = csvToYaml(text);
        mimeType = "text/yaml";
      } else {
        outputText = text;
      }
    } else if (ext === "xml") {
      if (toFormat === "json") {
        const parsed = xmlToJson(text);
        outputText = JSON.stringify(parsed, null, 2);
        mimeType = "application/json";
      } else {
        outputText = text;
      }
    } else {
      outputText = text;
    }

    onProgress(0.9);
    const blob = new Blob([outputText], { type: mimeType });
    onProgress(1.0);

    return {
      url: URL.createObjectURL(blob),
      newSize: blob.size,
    };
  };

  return (
    <ConverterTemplate
      title="Developer & Code Converter"
      description="Convert config files and code formats: YAML, JSON, Markdown, TOML, XML, and TSV directly in your browser."
      breadcrumbs={[{ label: "Convert", href: "/convert" }, { label: "Developer" }]}
      accept=".yaml,.yml,.json,.md,.markdown,.tsv,.csv,.xml,.toml"
      recommendedFormats={["json", "yaml", "html", "csv", "tsv"]}
      moreFormats={["xml", "md"]}
      defaultTarget="json"
      category="developer"
      onConvert={handleConvert}
    />
  );
}
