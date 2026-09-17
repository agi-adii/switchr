export interface PseoFaq {
  question: string;
  answer: string;
}

export interface PseoHowToStep {
  name: string;
  text: string;
}

export interface PseoConversionPair {
  slug: string;
  fromFormat: string;
  toFormat: string;
  category: "image" | "video" | "audio" | "document";
  title: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  accept: string;
  defaultTarget: string;
  recommendedFormats: string[];
  moreFormats?: string[];
  howTo: PseoHowToStep[];
  faqs: PseoFaq[];
  benefits: Array<{ title: string; desc: string }>;
}

export const PSEO_PAIRS: PseoConversionPair[] = [
  // ── 1. PNG to JPG ──────────────────────────────────────────────
  {
    slug: "png-to-jpg",
    fromFormat: "PNG",
    toFormat: "JPG",
    category: "image",
    title: "Convert PNG to JPG Online – Free, Fast & Private | Switchr",
    metaDescription:
      "Convert PNG images to high quality JPG format online in seconds. 100% private in-browser conversion, zero file uploads, and no size limits.",
    h1: "Convert PNG to JPG Online",
    subtitle:
      "Transform high-resolution PNG images into lightweight, universally compatible JPG files directly in your browser. 100% free and completely private.",
    accept: "image/png,.png",
    defaultTarget: "jpg",
    recommendedFormats: ["jpg", "webp", "pdf", "png"],
    moreFormats: ["bmp"],
    howTo: [
      {
        name: "Upload your PNG image",
        text: "Drag and drop your PNG file into the converter box above or click Browse to select it from your device.",
      },
      {
        name: "Adjust quality & settings",
        text: "Select JPG as the target format and customize compression quality or resize dimensions if needed.",
      },
      {
        name: "Download your converted JPG",
        text: "Click Convert and download your optimized JPG photo immediately with zero server latency.",
      },
    ],
    faqs: [
      {
        question: "Is this PNG to JPG converter completely free?",
        answer:
          "Yes, Switchr is 100% free with zero paywalls, no daily conversion limits, and no account creation required.",
      },
      {
        question: "Does my PNG file get uploaded to a remote server?",
        answer:
          "Never. All image processing runs client-side inside your browser sandbox. Your files never leave your device.",
      },
      {
        question: "What happens to transparency when converting PNG to JPG?",
        answer:
          "Since the standard JPG format does not support alpha transparency, any transparent areas in your PNG are rendered cleanly against a crisp solid white background.",
      },
      {
        question: "What is the maximum file size limit for PNG to JPG?",
        answer:
          "There are no artificial file size caps. Because conversion runs locally on your device hardware, you can convert multi-megapixel images seamlessly.",
      },
    ],
    benefits: [
      {
        title: "100% Private Sandbox",
        desc: "Files are rendered locally using hardware-accelerated HTML5 Canvas and WASM. Zero cloud uploads.",
      },
      {
        title: "Instant File Size Reduction",
        desc: "Save up to 70% in storage size compared to uncompressed PNGs while preserving vibrant color depth.",
      },
      {
        title: "Offline Progressive Web App",
        desc: "Once loaded, this tool continues to convert files even when you disconnect from Wi-Fi or cellular data.",
      },
    ],
  },

  // ── 2. JPG to PDF ──────────────────────────────────────────────
  {
    slug: "jpg-to-pdf",
    fromFormat: "JPG",
    toFormat: "PDF",
    category: "image",
    title: "Convert JPG to PDF Online Free – Fast & Secure | Switchr",
    metaDescription:
      "Convert JPG and JPEG images to clean, professional PDF documents. Combine single or multiple photos into PDF with zero server upload.",
    h1: "Convert JPG to PDF Online",
    subtitle:
      "Turn your JPG and JPEG photos into crisp, formatted PDF documents in seconds with zero watermarks and complete privacy.",
    accept: "image/jpeg,image/jpg,.jpg,.jpeg",
    defaultTarget: "pdf",
    recommendedFormats: ["pdf", "png", "webp"],
    howTo: [
      {
        name: "Select your JPG photos",
        text: "Drop your JPG or JPEG image onto the converter window.",
      },
      {
        name: "Set PDF orientation & margins",
        text: "Select PDF format to compile your photo into a standard A4 document layout.",
      },
      {
        name: "Download formatted PDF",
        text: "Hit Convert to instantly generate and download your high-resolution PDF document.",
      },
    ],
    faqs: [
      {
        question: "How do I convert JPG images to PDF without software installation?",
        answer:
          "Simply upload your JPG file to Switchr and click Convert to PDF. Our in-browser PDF engine compiles the document instantly.",
      },
      {
        question: "Can I convert multiple JPG photos into a single PDF?",
        answer:
          "Yes! You can compile photos into PDF using Switchr's PDF Tools with full page reordering and drag-and-drop sequencing.",
      },
      {
        question: "Will the PDF have watermarks or branding?",
        answer:
          "No, Switchr never adds watermarks, advertisements, or page stamps to your converted documents.",
      },
      {
        question: "Is it safe to convert sensitive receipts or documents to PDF?",
        answer:
          "Absolutely. Because Switchr executes all PDF synthesis client-side, your confidential receipts, IDs, and contracts are never transmitted over the internet.",
      },
    ],
    benefits: [
      {
        title: "Zero Watermarks",
        desc: "Generate clean, professional, publication-ready PDF documents without annoying third-party logos.",
      },
      {
        title: "Lossless Photo Quality",
        desc: "Images are embedded at native camera resolution for crystal-clear readability when printed or zoomed.",
      },
      {
        title: "Universal Document Standard",
        desc: "Compatible with Adobe Acrobat, Apple Preview, Google Chrome, and any PDF reader worldwide.",
      },
    ],
  },

  // ── 3. HEIC to JPG ─────────────────────────────────────────────
  {
    slug: "heic-to-jpg",
    fromFormat: "HEIC",
    toFormat: "JPG",
    category: "image",
    title: "Convert HEIC to JPG Online – Free Apple Photo Converter | Switchr",
    metaDescription:
      "Convert Apple iPhone HEIC and HEIF photos to standard JPG format online. Fast, free in-browser conversion with zero cloud uploads.",
    h1: "Convert HEIC to JPG Online",
    subtitle:
      "Convert Apple iPhone HEIC/HEIF camera photos into universally viewable JPG format instantly without installing apps or uploading to servers.",
    accept: ".heic,.heif",
    defaultTarget: "jpg",
    recommendedFormats: ["jpg", "png", "webp", "pdf"],
    howTo: [
      {
        name: "Upload your Apple HEIC photo",
        text: "Drop any .HEIC or .HEIF image from your iPhone, iPad, or Mac into the converter.",
      },
      {
        name: "Select JPG format",
        text: "Choose JPG output with optional quality calibration and resolution adjustments.",
      },
      {
        name: "Download standard JPG",
        text: "Click Convert to decode the HEIC container in-browser and save your standard JPG.",
      },
    ],
    faqs: [
      {
        question: "Why can't I open HEIC photos on Windows or Android?",
        answer:
          "Apple uses High Efficiency Image Container (HEIC) format by default on iPhones. Many Windows, Android, and web platforms require standard JPG or PNG to display images.",
      },
      {
        question: "Does converting HEIC to JPG reduce image clarity?",
        answer:
          "No, Switchr converts HEIC image frames at maximum color fidelity with up to 100% JPEG quality preservation.",
      },
      {
        question: "Is there a limit on how many HEIC photos I can convert?",
        answer:
          "No, Switchr has zero quotas, zero hourly limits, and zero subscriptions.",
      },
    ],
    benefits: [
      {
        title: "Native iPhone Support",
        desc: "Seamlessly decode Apple HEIC and HEIF formats directly in Chrome, Safari, Edge, or Firefox.",
      },
      {
        title: "Windows & Android Ready",
        desc: "Share your photos anywhere without compatibility errors on non-Apple devices.",
      },
      {
        title: "100% Private In-Browser",
        desc: "Personal camera roll photos never leave your device. Complete end-to-end privacy.",
      },
    ],
  },

  // ── 4. WebP to PNG ─────────────────────────────────────────────
  {
    slug: "webp-to-png",
    fromFormat: "WEBP",
    toFormat: "PNG",
    category: "image",
    title: "Convert WebP to PNG Online with Transparency – Free | Switchr",
    metaDescription:
      "Convert WebP images to lossless PNG format with full transparency preservation. 100% private, free client-side image converter.",
    h1: "Convert WebP to PNG Online",
    subtitle:
      "Extract lossless PNG images from WebP files with full alpha channel transparency preserved. Free, offline-ready, and private.",
    accept: "image/webp,.webp",
    defaultTarget: "png",
    recommendedFormats: ["png", "jpg", "pdf"],
    howTo: [
      {
        name: "Drop your WebP file",
        text: "Drag and drop your .webp image into the converter field.",
      },
      {
        name: "Select PNG output",
        text: "Ensure PNG is chosen to preserve transparent backgrounds and sharp graphic edges.",
      },
      {
        name: "Download lossless PNG",
        text: "Click Convert and download your PNG file instantly.",
      },
    ],
    faqs: [
      {
        question: "Does WebP to PNG preserve transparent backgrounds?",
        answer:
          "Yes! Switchr's PNG decoder preserves the full 32-bit RGBA alpha channel, keeping transparent backgrounds intact.",
      },
      {
        question: "Why should I convert WebP to PNG?",
        answer:
          "While WebP is great for web browsers, older graphic editing applications like Photoshop, Illustrator, or legacy video editors often require standard PNG files.",
      },
      {
        question: "Is this tool completely free with no limits?",
        answer:
          "Yes, convert as many WebP images as you need with zero limits and no account required.",
      },
    ],
    benefits: [
      {
        title: "Alpha Transparency Kept",
        desc: "Retain crisp transparent layers for logos, icons, stickers, and UI assets.",
      },
      {
        title: "Lossless Quality",
        desc: "Output pixel-perfect PNGs without artifacting or color compression degradation.",
      },
      {
        title: "Instant Conversion",
        desc: "Process graphics in milliseconds with WebAssembly and local GPU rendering.",
      },
    ],
  },

  // ── 5. MP4 to MP3 ──────────────────────────────────────────────
  {
    slug: "mp4-to-mp3",
    fromFormat: "MP4",
    toFormat: "MP3",
    category: "video",
    title: "Convert MP4 to MP3 Online – Extract Audio for Free | Switchr",
    metaDescription:
      "Extract crystal clear MP3 audio sound from MP4 video clips online. 100% in-browser WebAssembly FFmpeg conversion with zero server upload.",
    h1: "Convert MP4 to MP3 Online",
    subtitle:
      "Extract pristine audio from video files directly inside your browser. No software installation, no cloud uploads, and no file size limits.",
    accept: "video/mp4,.mp4,video/*",
    defaultTarget: "mp3",
    recommendedFormats: ["mp3", "wav", "webm", "gif"],
    moreFormats: ["mkv", "mov"],
    howTo: [
      {
        name: "Upload your MP4 video",
        text: "Select or drop your MP4 video file into the converter.",
      },
      {
        name: "Choose MP3 audio preset",
        text: "Pick MP3 as target format with your desired audio encoding quality.",
      },
      {
        name: "Download sound file",
        text: "Click Convert to run client-side FFmpeg WASM and download your MP3 audio track.",
      },
    ],
    faqs: [
      {
        question: "How does Switchr convert video to audio without uploading?",
        answer:
          "Switchr runs FFmpeg compiled to WebAssembly (WASM) directly inside your web browser. The entire extraction occurs on your device CPU.",
      },
      {
        question: "Can I extract audio from large video files?",
        answer:
          "Yes! Because files are not sent across the internet, there are no bandwidth throttling or server file size caps.",
      },
      {
        question: "What audio bitrate does the MP3 converter produce?",
        answer:
          "Switchr extracts audio at high-fidelity 192kbps/320kbps MP3 encoding for crisp music, voice, and podcast reproduction.",
      },
    ],
    benefits: [
      {
        title: "WebAssembly Powered",
        desc: "Hardware-accelerated native audio extraction right in your browser via FFmpeg WASM.",
      },
      {
        title: "Privacy First",
        desc: "Private personal videos, lecture recordings, and voice memos never leave your device.",
      },
      {
        title: "High Bitrate Sound",
        desc: "Studio-quality audio output compatible with all music players and smartphones.",
      },
    ],
  },

  // ── 6. Video to GIF ────────────────────────────────────────────
  {
    slug: "video-to-gif",
    fromFormat: "Video",
    toFormat: "GIF",
    category: "video",
    title: "Convert Video to GIF Online – Make Animated GIFs Free | Switchr",
    metaDescription:
      "Convert MP4, WebM, and MOV videos into lightweight animated GIFs online. 100% free, client-side, zero watermarks, no sign-up required.",
    h1: "Convert Video to GIF Online",
    subtitle:
      "Create high-quality, looping animated GIFs from video clips directly in your browser with zero watermarks and complete privacy.",
    accept: "video/*,.mp4,.webm,.mov",
    defaultTarget: "gif",
    recommendedFormats: ["gif", "mp4", "mp3", "webm"],
    howTo: [
      {
        name: "Select video clip",
        text: "Choose an MP4, WebM, or MOV video clip from your device.",
      },
      {
        name: "Choose GIF format",
        text: "Select animated GIF output to render smooth looping frame animations.",
      },
      {
        name: "Download animated GIF",
        text: "Click Convert and save your animation ready for Discord, Slack, GitHub, or social media.",
      },
    ],
    faqs: [
      {
        question: "Will the generated GIF have watermarks?",
        answer:
          "No, Switchr never adds watermarks or branding to your generated animated GIFs.",
      },
      {
        question: "Which video formats are supported?",
        answer:
          "You can convert MP4, WebM, MOV, and MKV video formats into animated GIF loops.",
      },
      {
        question: "Can I use the GIFs on Discord, Slack, and GitHub?",
        answer:
          "Yes! The output is standard animated GIF format, fully compatible with Discord stickers, Slack emojis, GitHub READMEs, and social apps.",
      },
    ],
    benefits: [
      {
        title: "Watermark Free",
        desc: "Pure animated GIFs with zero promotional stamps, logos, or restrictions.",
      },
      {
        title: "Optimized Frame Palette",
        desc: "Adaptive color dithering creates vibrant animations with small download footprints.",
      },
      {
        title: "Zero Software Needed",
        desc: "No video editing software or browser extensions required.",
      },
    ],
  },

  // ── 7. PDF to PNG (Bonus High Volume) ──────────────────────────
  {
    slug: "pdf-to-png",
    fromFormat: "PDF",
    toFormat: "PNG",
    category: "document",
    title: "Convert PDF to PNG Images Online – High Resolution & Free | Switchr",
    metaDescription:
      "Extract high-resolution PNG images from any PDF document online. Fast, secure, zero server uploads, 100% client-side PDF converter.",
    h1: "Convert PDF to PNG Online",
    subtitle:
      "Extract crystal-clear, high-resolution PNG pages from any PDF document with complete client-side security and zero limits.",
    accept: "application/pdf,.pdf",
    defaultTarget: "png",
    recommendedFormats: ["png", "jpg", "webp"],
    howTo: [
      {
        name: "Upload your PDF file",
        text: "Drag and drop your PDF document into the converter workspace.",
      },
      {
        name: "Choose PNG image output",
        text: "Select PNG output for maximum visual sharpness and text clarity.",
      },
      {
        name: "Download high-res images",
        text: "Convert and download individual pages or a complete image package instantly.",
      },
    ],
    faqs: [
      {
        question: "How do I extract images from PDF without losing text quality?",
        answer:
          "Switchr renders PDF vector paths and fonts at 300 DPI high resolution into crisp PNG images using Mozilla's PDF.js engine.",
      },
      {
        question: "Are my confidential PDF documents safe?",
        answer:
          "Yes. All page rasterization happens 100% locally in your browser memory. Your files never touch a cloud server.",
      },
      {
        question: "Can I convert multi-page PDF documents?",
        answer:
          "Yes, you can convert and extract every page of your PDF document seamlessly.",
      },
    ],
    benefits: [
      {
        title: "300 DPI Crisp Text",
        desc: "Vectors and text remain ultra-sharp and legible even when magnified.",
      },
      {
        title: "100% Confidential",
        desc: "Bank statements, contracts, and confidential records stay securely on your computer.",
      },
      {
        title: "No Daily Caps",
        desc: "Convert as many PDF pages as you need without paying for subscriptions.",
      },
    ],
  },

  // ── 8. HEIC to PNG (Bonus High Volume) ─────────────────────────
  {
    slug: "heic-to-png",
    fromFormat: "HEIC",
    toFormat: "PNG",
    category: "image",
    title: "Convert HEIC to PNG Online Free – Lossless iPhone Converter | Switchr",
    metaDescription:
      "Convert Apple iPhone HEIC and HEIF photos to lossless PNG format online. 100% in-browser private image converter.",
    h1: "Convert HEIC to PNG Online",
    subtitle:
      "Convert Apple iPhone HEIC photos into uncompressed, lossless PNG graphics with complete privacy and zero quality loss.",
    accept: ".heic,.heif",
    defaultTarget: "png",
    recommendedFormats: ["png", "jpg", "webp", "pdf"],
    howTo: [
      {
        name: "Upload your HEIC photo",
        text: "Select an Apple camera roll HEIC image from your iPhone or Mac.",
      },
      {
        name: "Choose PNG output",
        text: "Select PNG format for lossless image retention and transparent layer support.",
      },
      {
        name: "Download your PNG",
        text: "Click Convert to save your photo as a universally compatible PNG file.",
      },
    ],
    faqs: [
      {
        question: "Why convert HEIC to PNG instead of JPG?",
        answer:
          "PNG uses lossless compression, meaning no image data is discarded during conversion. This is ideal for graphic design, logos, and archiving.",
      },
      {
        question: "Is this converter safe for private personal photos?",
        answer:
          "Yes, processing runs entirely on your device with WebAssembly. No data is sent over the internet.",
      },
      {
        question: "Can I convert HEIC on a Windows PC or Android phone?",
        answer:
          "Yes! Switchr works across all modern web browsers on Windows, Android, Mac, iOS, and Linux.",
      },
    ],
    benefits: [
      {
        title: "Lossless Conversion",
        desc: "Preserve 100% of photographic dynamic range and sharpness.",
      },
      {
        title: "Universal Support",
        desc: "Open your iPhone photos in any desktop editing software without plugin errors.",
      },
      {
        title: "Zero Bandwidth Waste",
        desc: "Convert instantly without uploading gigabytes of photo data to cloud servers.",
      },
    ],
  },

  // ── 11. PPTX to PDF ─────────────────────────────────────────────
  {
    slug: "pptx-to-pdf",
    fromFormat: "PPTX",
    toFormat: "PDF",
    category: "document",
    title: "Convert PPTX to PDF Online – Free, Fast & Private | Switchr",
    metaDescription:
      "Convert PowerPoint PPTX presentations to clean, printable PDF slide decks online. 100% private in-browser conversion, zero file uploads, and no size limits.",
    h1: "Convert PPTX to PDF Online",
    subtitle:
      "Transform PowerPoint slides into crisp, multi-page landscape PDF presentation decks directly in your browser. 100% free, confidential, and instant.",
    accept: ".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation",
    defaultTarget: "pdf",
    recommendedFormats: ["pdf", "docx", "txt", "html"],
    howTo: [
      {
        name: "Select your PPTX presentation",
        text: "Drag and drop your .pptx file into the converter or click Choose File to browse from your device.",
      },
      {
        name: "Choose PDF format",
        text: "Ensure PDF is selected as the output format. Each slide is mapped to a dedicated landscape presentation page.",
      },
      {
        name: "Download your converted PDF",
        text: "Click Convert and download your high-resolution presentation PDF immediately.",
      },
    ],
    faqs: [
      {
        question: "Is this PPTX to PDF converter completely private?",
        answer:
          "Yes. All slide parsing and PDF generation runs locally inside your browser using client-side JavaScript. Your presentation is never uploaded to any cloud server.",
      },
      {
        question: "How are the slides formatted in the generated PDF?",
        answer:
          "Each slide is converted into a high-resolution landscape page formatted to widescreen aspect ratio, featuring styled titles, slide numbering badges, and bullet point hierarchies.",
      },
      {
        question: "Are embedded images preserved in the PDF?",
        answer:
          "Yes. Switchr extracts embedded slide illustrations and diagrams from the PPTX archive and renders them cleanly within the PDF deck.",
      },
    ],
    benefits: [
      {
        title: "100% Confidential",
        desc: "Sensitive business slides and student presentations never leave your browser sandbox.",
      },
      {
        title: "Landscape Slide Layout",
        desc: "Preserves the widescreen presentation aspect ratio for seamless projector and screen viewing.",
      },
      {
        title: "Zero File Size Limits",
        desc: "Convert lengthy multi-slide presentations without cloud upload caps or waitlists.",
      },
    ],
  },

  // ── 12. PPT to PDF ──────────────────────────────────────────────
  {
    slug: "ppt-to-pdf",
    fromFormat: "PPT",
    toFormat: "PDF",
    category: "document",
    title: "Convert PPT to PDF Online – Free, Fast & Private | Switchr",
    metaDescription:
      "Convert legacy PowerPoint PPT presentations to high-resolution PDF documents online. 100% private in-browser conversion with zero server uploads.",
    h1: "Convert PPT to PDF Online",
    subtitle:
      "Transform PowerPoint PPT presentations into clean, portable landscape PDF slide decks directly in your browser.",
    accept: ".ppt,application/vnd.ms-powerpoint",
    defaultTarget: "pdf",
    recommendedFormats: ["pdf", "docx", "txt"],
    howTo: [
      {
        name: "Upload your PPT file",
        text: "Drag and drop your legacy .ppt file into the converter box.",
      },
      {
        name: "Select PDF output",
        text: "PDF is automatically configured as the recommended export target.",
      },
      {
        name: "Download PDF deck",
        text: "Click Convert to generate and download your printable PDF presentation.",
      },
    ],
    faqs: [
      {
        question: "Can this tool open older PowerPoint 97-2003 PPT files?",
        answer:
          "Yes! Switchr contains a specialized binary stream parser designed to extract slides and text from legacy .ppt files without requiring Microsoft Office.",
      },
      {
        question: "Do I need PowerPoint installed on my computer?",
        answer:
          "No software installation is required. Everything runs directly inside your web browser.",
      },
    ],
    benefits: [
      {
        title: "Legacy Support",
        desc: "Easily open and convert older PowerPoint files without compatibility errors.",
      },
      {
        title: "Instant In-Browser Conversion",
        desc: "Convert slides in seconds using local hardware acceleration.",
      },
      {
        title: "Full Privacy",
        desc: "Zero data collection, zero tracking, and zero cloud uploads.",
      },
    ],
  },

  // ── 13. PPTX to DOCX ────────────────────────────────────────────
  {
    slug: "pptx-to-docx",
    fromFormat: "PPTX",
    toFormat: "DOCX",
    category: "document",
    title: "Convert PPTX to DOCX Online – Free PowerPoint to Word | Switchr",
    metaDescription:
      "Convert PowerPoint PPTX presentations into structured Microsoft Word DOCX documents online. 100% in-browser, private, and instant.",
    h1: "Convert PPTX to Word DOCX Online",
    subtitle:
      "Turn PowerPoint presentation slides, bullet points, and images into an editable, structured Microsoft Word document directly in your browser.",
    accept: ".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation",
    defaultTarget: "docx",
    recommendedFormats: ["docx", "pdf", "txt"],
    howTo: [
      {
        name: "Select your PPTX file",
        text: "Upload your PowerPoint presentation file into the converter.",
      },
      {
        name: "Choose DOCX",
        text: "Select DOCX as the target format to convert slides into an editable Word document outline.",
      },
      {
        name: "Download your Word document",
        text: "Click Convert and download your formatted .docx file ready for Microsoft Word or Google Docs.",
      },
    ],
    faqs: [
      {
        question: "How does PPTX to DOCX conversion organize my slides?",
        answer:
          "Each slide is organized under a clear Heading (e.g. 'Slide 1: Title') with bullet points, content paragraphs, speaker notes, and embedded illustrations preserved.",
      },
      {
        question: "Is the resulting DOCX compatible with Microsoft Word and Google Docs?",
        answer:
          "Yes. Switchr generates genuine OpenXML (.docx) files fully compliant with Microsoft Word, Google Docs, Apple Pages, and LibreOffice.",
      },
    ],
    benefits: [
      {
        title: "Editable Word Document",
        desc: "Easily edit and expand presentation outlines in Microsoft Word or Google Docs.",
      },
      {
        title: "Structured Slide Headings",
        desc: "Organized with clear Heading 2 sections and Word bullet hierarchies.",
      },
      {
        title: "100% Private",
        desc: "Your document is generated on your device with zero remote server processing.",
      },
    ],
  },

  // ── 14. PPT to DOCX ─────────────────────────────────────────────
  {
    slug: "ppt-to-docx",
    fromFormat: "PPT",
    toFormat: "DOCX",
    category: "document",
    title: "Convert PPT to DOCX Online – PowerPoint to Word | Switchr",
    metaDescription:
      "Convert legacy PPT slides into editable Word DOCX documents with structured headings and bullet outlines. 100% private.",
    h1: "Convert PPT to Word DOCX Online",
    subtitle:
      "Extract PowerPoint presentation content into an editable Microsoft Word document directly in your browser.",
    accept: ".ppt,application/vnd.ms-powerpoint",
    defaultTarget: "docx",
    recommendedFormats: ["docx", "pdf", "txt"],
    howTo: [
      {
        name: "Upload your PPT presentation",
        text: "Drag and drop your PowerPoint presentation into Switchr.",
      },
      {
        name: "Select DOCX target",
        text: "Select DOCX to extract slide content into a Word document.",
      },
      {
        name: "Download .docx file",
        text: "Download and open your new Word document in any word processor.",
      },
    ],
    faqs: [
      {
        question: "Can I convert PPT slides to DOCX without Microsoft Office?",
        answer:
          "Yes. Switchr runs entirely in your browser without needing Microsoft Office or any paid license.",
      },
    ],
    benefits: [
      {
        title: "Universal Word Format",
        desc: "Open legacy presentations in modern word processors instantly.",
      },
      {
        title: "Fast Local Processing",
        desc: "Extract text and outline structure in milliseconds.",
      },
      {
        title: "Safe & Secure",
        desc: "Zero uploads or cloud storage of your proprietary presentations.",
      },
    ],
  },

  // ── 15. DOCX to PDF ─────────────────────────────────────────────
  {
    slug: "docx-to-pdf",
    fromFormat: "DOCX",
    toFormat: "PDF",
    category: "document",
    title: "Convert DOCX to PDF Online – Free Word to PDF | Switchr",
    metaDescription:
      "Convert Microsoft Word DOCX documents to print-ready PDF files directly in your browser. 100% private, no file uploads.",
    h1: "Convert Word DOCX to PDF Online",
    subtitle:
      "Convert Microsoft Word documents into clean, printable PDFs with standard formatting and page breaks. Zero server uploads.",
    accept: ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    defaultTarget: "pdf",
    recommendedFormats: ["pdf", "txt", "html"],
    howTo: [
      {
        name: "Upload your DOCX document",
        text: "Drop your Microsoft Word (.docx) file into the upload zone.",
      },
      {
        name: "Select PDF target",
        text: "PDF is automatically configured as the standard print-ready format.",
      },
      {
        name: "Download your PDF",
        text: "Click Convert and download your clean PDF document.",
      },
    ],
    faqs: [
      {
        question: "Is my Word document kept private during conversion?",
        answer:
          "Absolutely. All document parsing and PDF rendering occurs exclusively in your browser memory. No files are uploaded to any server.",
      },
      {
        question: "Are headings and bullet points formatted in the PDF?",
        answer:
          "Yes. Heading hierarchies, bold titles, bullet points, and margins are rendered into standard A4 pages with clean typography.",
      },
    ],
    benefits: [
      {
        title: "Print-Ready Output",
        desc: "Standard A4 layout suitable for professional printing and digital sharing.",
      },
      {
        title: "Zero Wait Time",
        desc: "Instant conversion without queueing behind server-side queues.",
      },
      {
        title: "Completely Free",
        desc: "No limits on number of documents, watermarks, or hidden paywalls.",
      },
    ],
  },
];

export function getPseoPairBySlug(slug: string): PseoConversionPair | undefined {
  return PSEO_PAIRS.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllPseoSlugs(): string[] {
  return PSEO_PAIRS.map((p) => p.slug);
}
