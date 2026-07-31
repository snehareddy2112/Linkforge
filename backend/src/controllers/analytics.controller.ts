import { Request, Response } from "express";
import mongoose from "mongoose";
import { Click } from "../models/Click.js";
import { Link } from "../models/Link.js";

export const getAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid link ID.",
      });
      return;
    }

    const link = await Link.findById(id);

    if (!link) {
      res.status(404).json({
        success: false,
        message: "Link not found.",
      });
      return;
    }

    const linkId = new mongoose.Types.ObjectId(id);

    const [deviceStats, browserStats, osStats, recentClicks] =
      await Promise.all([
        Click.aggregate([
          {
            $match: {
              linkId,
            },
          },
          {
            $group: {
              _id: "$device",
              count: { $sum: 1 },
            },
          },
        ]),

        Click.aggregate([
          {
            $match: {
              linkId,
            },
          },
          {
            $group: {
              _id: "$browser",
              count: { $sum: 1 },
            },
          },
          {
            $sort: {
              count: -1,
            },
          },
        ]),

        Click.aggregate([
          {
            $match: {
              linkId,
            },
          },
          {
            $group: {
              _id: "$os",
              count: { $sum: 1 },
            },
          },
          {
            $sort: {
              count: -1,
            },
          },
        ]),

        Click.find({ linkId })
          .sort({ createdAt: -1 })
          .limit(10)
          .select("device browser os referrer createdAt"),
      ]);

    const devices = {
      mobile: 0,
      tablet: 0,
      desktop: 0,
    };

    for (const item of deviceStats) {
      if (item._id in devices) {
        devices[item._id as keyof typeof devices] = item.count;
      }
    }

    const browsers = Object.fromEntries(
      browserStats.map((item) => [
        item._id || "Unknown",
        item.count,
      ])
    );

    const operatingSystems = Object.fromEntries(
      osStats.map((item) => [
        item._id || "Unknown",
        item.count,
      ])
    );

    res.json({
      success: true,

      data: {
        totalClicks: link.clickCount,

        devices,

        browsers,

        operatingSystems,

        recentClicks,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics.",
    });
  }
};