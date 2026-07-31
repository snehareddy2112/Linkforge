import { Request, Response } from "express";
import QRCode from "qrcode";
import { Link } from "../models/Link.js";

export const generateQR = async (
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

    const baseUrl =
      process.env.BASE_URL ||
      `${req.protocol}://${req.get("host")}`;

    const shortUrl = `${baseUrl}/r/${link.shortCode}`;

    const qrDataUrl = await QRCode.toDataURL(shortUrl, {
      width: 500,
      margin: 2,
      errorCorrectionLevel: "H",
    });

    res.json({
      success: true,
      data: {
        shortUrl,
        qrCode: qrDataUrl,
      },
    });
  } catch (error) {
    console.error("QR generation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate QR code.",
    });
  }
};