import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Switchr - Universal File Converter & PDF Suite',
    short_name: 'Switchr',
    description: 'Universal client-side file converter and PDF management suite. 100% private in-browser WebAssembly execution.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#0a0a14',
    theme_color: '#0a0a14',
    categories: ['utilities', 'productivity', 'photo', 'video'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/logo.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
    shortcuts: [
      {
        name: 'Convert Images',
        short_name: 'Images',
        description: 'Convert JPG, PNG, WebP, HEIC and SVG files',
        url: '/convert/images',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'PDF Management Suite',
        short_name: 'PDF Tools',
        description: 'Merge, split, protect, unlock and extract PDFs',
        url: '/pdf-tools',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'AI Photo Enhancer',
        short_name: 'AI Enhancer',
        description: 'Auto-calibrate tone, detail and upscale photos',
        url: '/tools/enhance',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Compress Files',
        short_name: 'Compress',
        description: 'Reduce file sizes with high visual quality',
        url: '/compress',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
    ],
  }
}
