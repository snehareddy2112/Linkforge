import express from "express";
import cors from "cors";

import linkRoutes from "./routes/link.routes.js";
import { redirectLink } from "./controllers/link.controller.js";

const app = express();

/* =========================================
   CORS
   ========================================= */

const allowedOrigins = [
  // Local frontend
  "http://localhost:5173",

  // Current Vercel frontend
  "https://linkforge-6cvpdv12i-snehareddy2112s-projects.vercel.app",

  // Optional production frontend URL from Render env
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests such as Postman, curl, server-to-server,
      // and normal redirects may not contain an Origin header.
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      console.warn(`Blocked CORS origin: ${origin}`);

      callback(new Error(`CORS blocked origin: ${origin}`));
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
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