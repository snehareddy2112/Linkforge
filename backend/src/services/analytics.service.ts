import { UAParser } from "ua-parser-js";
import { Click } from "../models/Click.js";

export const recordClick = async (
  linkId: string,
  userAgent: string,
  referrer?: string
) => {
  const parser = new UAParser(userAgent);

  const deviceInfo = parser.getDevice();
  const browserInfo = parser.getBrowser();
  const osInfo = parser.getOS();

  let device: "mobile" | "tablet" | "desktop" = "desktop";

  if (deviceInfo.type === "mobile") {
    device = "mobile";
  }

  if (deviceInfo.type === "tablet") {
    device = "tablet";
  }

  await Click.create({
    linkId,
    device,
    browser: browserInfo.name || "Unknown",
    os: osInfo.name || "Unknown",
    referrer: referrer || "Direct",
  });

  return device;
};