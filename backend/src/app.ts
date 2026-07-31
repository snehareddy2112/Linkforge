import express from "express";
import cors from "cors";

import linkRoutes from "./routes/link.routes.js";
import { redirectLink } from "./controllers/link.controller.js";

const app = express();

/* =========================================
   CORS
   ========================================= */

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

const isAllowedOrigin = (origin: string) => {
  // Local development
  if (allowedOrigins.includes(origin)) {
    return true;
  }

  // LinkForge Vercel deployments
  try {
    const url = new URL(origin);

    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".vercel.app") &&
      url.hostname.includes("snehareddy2112s-projects")
    );
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin: (origin, callback) => {
      // curl, Postman, redirects, server-to-server, etc.
      if (!origin) {
        callback(null, true);
        return;
      }

      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      console.warn(`Blocked CORS origin: ${origin}`);
      callback(new Error(`CORS blocked origin: ${origin}`));
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
/* =========================================
   MIDDLEWARE
   ========================================= */

app.use(express.json());

/* =========================================
   HEALTH
   ========================================= */

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "LinkForge API is running",
  });
});

/* =========================================
   API ROUTES
   ========================================= */

app.use("/api/links", linkRoutes);

/* =========================================
   PUBLIC REDIRECT
   ========================================= */

app.get("/r/:shortCode", redirectLink);

/* =========================================
   404
   ========================================= */

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;