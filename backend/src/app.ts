import express from "express";
import cors from "cors";
import linkRoutes from "./routes/link.routes.js";
import { redirectLink } from "./controllers/link.controller.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "LinkForge API is running",
  });
});

app.use("/api/links", linkRoutes);

// Public redirect route
app.get("/r/:shortCode", redirectLink);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;