import { Request, Response } from "express";
import { Link } from "../models/Link.js";
import { generateShortCode } from "../utils/generateCode.js";
import { recordClick } from "../services/analytics.service.js";
import { resolveDestination } from "../services/routing.service.js";



const isValidHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const createLink = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      destinationUrl,
      customAlias,
      mobileUrl,
      desktopUrl,
      fallbackUrl,
      expiresAt,
    } = req.body;

    if (!destinationUrl || !isValidHttpUrl(destinationUrl)) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid destination URL.",
      });
      return;
    }

    if (mobileUrl && !isValidHttpUrl(mobileUrl)) {
      res.status(400).json({
        success: false,
        message: "Mobile URL is invalid.",
      });
      return;
    }

    if (desktopUrl && !isValidHttpUrl(desktopUrl)) {
      res.status(400).json({
        success: false,
        message: "Desktop URL is invalid.",
      });
      return;
    }

    if (fallbackUrl && !isValidHttpUrl(fallbackUrl)) {
      res.status(400).json({
        success: false,
        message: "Fallback URL is invalid.",
      });
      return;
    }

    let shortCode: string;

    if (customAlias) {
      shortCode = String(customAlias).trim();

      if (!/^[a-zA-Z0-9_-]{3,30}$/.test(shortCode)) {
        res.status(400).json({
          success: false,
          message:
            "Custom alias must be 3-30 characters and contain only letters, numbers, hyphens or underscores.",
        });
        return;
      }

      const aliasExists = await Link.exists({ shortCode });

      if (aliasExists) {
        res.status(409).json({
          success: false,
          message: "That custom alias is already taken.",
        });
        return;
      }
    } else {
      do {
        shortCode = generateShortCode();
      } while (await Link.exists({ shortCode }));
    }

    const link = await Link.create({
      title: title?.trim() || "Untitled Link",
      shortCode,
      destinationUrl,
      mobileUrl: mobileUrl || undefined,
      desktopUrl: desktopUrl || undefined,
      fallbackUrl: fallbackUrl || undefined,
      expiresAt: expiresAt || undefined,
    });

    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

    res.status(201).json({
      success: true,
      message: "Smart link created.",
      data: {
        ...link.toObject(),
        shortUrl: `${baseUrl}/r/${link.shortCode}`,
      },
    });
  } catch (error) {
    console.error("Create link error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create link.",
    });
  }
};

export const getLinks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });

    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

    const data = links.map((link) => ({
      ...link.toObject(),
      shortUrl: `${baseUrl}/r/${link.shortCode}`,
    }));

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Get links error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch links.",
    });
  }
};

export const getLink = async (
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
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

    res.json({
      success: true,
      data: {
        ...link.toObject(),
        shortUrl: `${baseUrl}/r/${link.shortCode}`,
      },
    });
  } catch {
    res.status(400).json({
      success: false,
      message: "Invalid link ID.",
    });
  }
};

export const updateLink = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      destinationUrl,
      mobileUrl,
      desktopUrl,
      fallbackUrl,
      isActive,
      expiresAt,
    } = req.body;

    const link = await Link.findById(req.params.id);

    if (!link) {
      res.status(404).json({
        success: false,
        message: "Link not found.",
      });
      return;
    }

    if (destinationUrl !== undefined) {
      if (!isValidHttpUrl(destinationUrl)) {
        res.status(400).json({
          success: false,
          message: "Destination URL is invalid.",
        });
        return;
      }

      link.destinationUrl = destinationUrl;
    }

    if (mobileUrl !== undefined) {
      if (mobileUrl && !isValidHttpUrl(mobileUrl)) {
        res.status(400).json({
          success: false,
          message: "Mobile URL is invalid.",
        });
        return;
      }

      link.mobileUrl = mobileUrl || undefined;
    }

    if (desktopUrl !== undefined) {
      if (desktopUrl && !isValidHttpUrl(desktopUrl)) {
        res.status(400).json({
          success: false,
          message: "Desktop URL is invalid.",
        });
        return;
      }

      link.desktopUrl = desktopUrl || undefined;
    }

    if (fallbackUrl !== undefined) {
      if (fallbackUrl && !isValidHttpUrl(fallbackUrl)) {
        res.status(400).json({
          success: false,
          message: "Fallback URL is invalid.",
        });
        return;
      }

      link.fallbackUrl = fallbackUrl || undefined;
    }

    if (title !== undefined) {
      link.title = title.trim() || "Untitled Link";
    }

    if (typeof isActive === "boolean") {
      link.isActive = isActive;
    }

    if (expiresAt !== undefined) {
      link.expiresAt = expiresAt ? new Date(expiresAt) : undefined;
    }

    await link.save();

    res.json({
      success: true,
      message: "Link updated.",
      data: link,
    });
  } catch (error) {
    console.error("Update link error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update link.",
    });
  }
};

export const deleteLink = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const link = await Link.findByIdAndDelete(req.params.id);

    if (!link) {
      res.status(404).json({
        success: false,
        message: "Link not found.",
      });
      return;
    }

    res.json({
      success: true,
      message: "Link deleted.",
    });
  } catch {
    res.status(400).json({
      success: false,
      message: "Invalid link ID.",
    });
  }
};
export const redirectLink = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const link = await Link.findOne({
      shortCode: req.params.shortCode,
    });

    if (!link) {
      res.status(404).send("Link not found");
      return;
    }

    if (!link.isActive) {
      res.status(410).send("This link is currently disabled.");
      return;
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
      if (link.fallbackUrl) {
        res.redirect(302, link.fallbackUrl);
        return;
      }

      res.status(410).send("This link has expired.");
      return;
    }

    const userAgent = req.get("user-agent") || "";

    const destination = resolveDestination(link, userAgent);

    // Don't make redirect dependent on analytics succeeding.
    try {
      await recordClick(
        link._id.toString(),
        userAgent,
        req.get("referer")
      );
    } catch (analyticsError) {
      console.error("Analytics recording failed:", analyticsError);
    }

    await Link.updateOne(
      { _id: link._id },
      {
        $inc: {
          clickCount: 1,
        },
      }
    );

    res.redirect(302, destination);
  } catch (error) {
    console.error("Redirect error:", error);

    res.status(500).send("Unable to redirect.");
  }
};
