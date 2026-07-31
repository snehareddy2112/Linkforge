import { Router } from "express";

import {
  createLink,
  deleteLink,
  getLink,
  getLinks,
  updateLink,
} from "../controllers/link.controller.js";

import { generateQR } from "../controllers/qr.controller.js";
import { getAnalytics } from "../controllers/analytics.controller.js";
import { checkLinkHealth } from "../controllers/health.controller.js";

const router = Router();

router.post("/", createLink);
router.get("/", getLinks);

router.get("/:id", getLink);
router.patch("/:id", updateLink);
router.delete("/:id", deleteLink);

router.get("/:id/qr", generateQR);

router.get("/:id/analytics", getAnalytics);

router.post("/:id/health", checkLinkHealth);

export default router;