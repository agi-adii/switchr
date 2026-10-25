import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./"),
      "next/link": path.resolve(import.meta.dirname, "./lib/shims/next-link.tsx"),
      "next/image": path.resolve(import.meta.dirname, "./lib/shims/next-image.tsx"),
      "next/navigation": path.resolve(import.meta.dirname, "./lib/shims/next-navigation.ts"),
      "next-themes": path.resolve(import.meta.dirname, "./lib/shims/next-themes.tsx"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
