import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { convertRouter } from "./routes/convert.js";
import { toolsRouter } from "./routes/tools.js";
import { registryRouter } from "./routes/registry.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve paths to web build and public assets
const distPath = path.resolve(process.cwd(), "../web/dist");
const publicPath = path.resolve(process.cwd(), "../web/public");

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve static frontend assets if built
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    engine: "node-express",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use("/api/registry", registryRouter);
app.use("/api/convert", convertRouter);
app.use("/api/tools", toolsRouter);

// SPA fallback for all frontend routes (e.g. /, /convert, /tools)
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }
  const indexPath = path.join(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  // In dev mode when dist isn't built, redirect to Vite dev server
  res.redirect("http://localhost:3000" + req.originalUrl);
});

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled server error:", err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`[Switchr Server] Node.js Express server running on port ${PORT}`);
  console.log(`[Switchr Server] Web app served at http://localhost:${PORT}`);
  console.log(`[Switchr Server] Health check available at http://localhost:${PORT}/api/health`);
});

export default app;
