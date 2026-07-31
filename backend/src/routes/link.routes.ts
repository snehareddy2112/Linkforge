import { Router } from "express";

import {
  createLink,
  deleteLink,
  getLink,
  getLinks,
  updateLink,
} from "../controllers/link.controller";

import { generateQR } from "../controllers/qr.controller";
import { getAnalytics } from "../controllers/analytics.controller";
import { checkLinkHealth } from "../controllers/health.controller";

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