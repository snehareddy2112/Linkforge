import { Request, Response } from "express";
import { Link } from "../models/Link.js";

export const checkLinkHealth = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      res.status(404).json({
        success: false,
        message: "Link not found.",
      });
      return;
    }

    let status: "healthy" | "broken" = "broken";
    let statusCode: number | null = null;

    try {
      const response = await fetch(link.destinationUrl, {
        method: "HEAD",

        signal: AbortSignal.timeout(5000),

        redirect: "follow",

        headers: {
          "User-Agent": "LinkForge-HealthCheck/1.0",
        },
      });

      statusCode = response.status;

      status = response.ok ? "healthy" : "broken";
    } catch {
      status = "broken";
    }

    link.healthStatus = status;

    await link.save();

    res.json({
      success: true,

      data: {
        healthStatus: status,
        statusCode,
        checkedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Health check error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to check link health.",
    });
  }
};