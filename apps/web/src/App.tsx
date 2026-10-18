import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/lib/shims/next-themes";
import { Toaster } from "sonner";
import { PwaProvider } from "@/lib/pwa-context";
import { PwaInstallBanner } from "@/components/pwa-install-banner";

// Pages
import HomePage from "@/app/page";
import ConvertHubPage from "@/app/convert/page";
import ImageConverterPage from "@/app/convert/images/page";
import AudioConverterPage from "@/app/convert/audio/page";
import VideoConverterPage from "@/app/convert/video/page";
import DocumentConverterPage from "@/app/convert/documents/page";
import DataConverterPage from "@/app/convert/data/page";
import SubtitlesConverterPage from "@/app/convert/subtitles/page";
import FontConverterPage from "@/app/convert/fonts/page";
import ProgrammingConverterPage from "@/app/convert/programming/page";
import EbooksConverterPage from "@/app/convert/ebooks/page";
import { PairPageWrapper } from "./pages/PairPageWrapper";
import PdfToolsPage from "@/app/pdf-tools/page";
import CompressPage from "@/app/compress/page";
import HistoryPage from "@/app/history/page";
import ToolsDirectoryPage from "@/app/tools/page";
import ArchiveToolsPage from "@/app/tools/archive/page";
import EnhancePage from "@/app/tools/enhance/page";
import JsonFormatterPage from "@/app/tools/json-formatter/page";
import YamlFormatterPage from "@/app/tools/yaml-formatter/page";
import XmlFormatterPage from "@/app/tools/xml-formatter/page";
import Base64ToolPage from "@/app/tools/base64/page";
import UrlEncodePage from "@/app/tools/url-encode/page";
import ChecksumPage from "@/app/tools/checksum/page";
import QrGeneratorPage from "@/app/tools/qr-generator/page";
import CsvCleanupPage from "@/app/tools/csv-cleanup/page";
import ImageMetadataPage from "@/app/tools/image-metadata/page";
import AboutPage from "@/app/about/page";
import ContactPage from "@/app/contact/page";
import FaqPage from "@/app/faq/page";
import PrivacyPage from "@/app/privacy/page";
import TermsPage from "@/app/terms/page";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <PwaProvider>
        <BrowserRouter>
          <main className="w-full min-h-screen m-0 p-0 bg-background text-foreground antialiased">
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-muted-foreground text-sm">Loading Switchr...</div>}>
              <Routes>
                {/* Home Studio */}
                <Route path="/" element={<HomePage />} />

                {/* Conversion Hub & Categories */}
                <Route path="/convert" element={<ConvertHubPage />} />
                <Route path="/convert/images" element={<ImageConverterPage />} />
                <Route path="/convert/audio" element={<AudioConverterPage />} />
                <Route path="/convert/video" element={<VideoConverterPage />} />
                <Route path="/convert/documents" element={<DocumentConverterPage />} />
                <Route path="/convert/data" element={<DataConverterPage />} />
                <Route path="/convert/subtitles" element={<SubtitlesConverterPage />} />
                <Route path="/convert/fonts" element={<FontConverterPage />} />
                <Route path="/convert/programming" element={<ProgrammingConverterPage />} />
                <Route path="/convert/ebooks" element={<EbooksConverterPage />} />
                <Route path="/convert/:pair" element={<PairPageWrapper />} />

                {/* Suites & Tools */}
                <Route path="/pdf-tools" element={<PdfToolsPage />} />
                <Route path="/compress" element={<CompressPage />} />
                <Route path="/history" element={<HistoryPage />} />

                {/* Tools Directory & Utilities */}
                <Route path="/tools" element={<ToolsDirectoryPage />} />
                <Route path="/tools/archive" element={<ArchiveToolsPage />} />
                <Route path="/tools/enhance" element={<EnhancePage />} />
                <Route path="/tools/json-formatter" element={<JsonFormatterPage />} />
                <Route path="/tools/yaml-formatter" element={<YamlFormatterPage />} />
                <Route path="/tools/xml-formatter" element={<XmlFormatterPage />} />
                <Route path="/tools/base64" element={<Base64ToolPage />} />
                <Route path="/tools/url-encode" element={<UrlEncodePage />} />
                <Route path="/tools/checksum" element={<ChecksumPage />} />
                <Route path="/tools/qr-generator" element={<QrGeneratorPage />} />
                <Route path="/tools/csv-cleanup" element={<CsvCleanupPage />} />
                <Route path="/tools/image-metadata" element={<ImageMetadataPage />} />

                {/* Information Pages */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>

            <PwaInstallBanner />
            <Toaster richColors position="top-center" />
          </main>
        </BrowserRouter>
      </PwaProvider>
    </ThemeProvider>
  );
}
