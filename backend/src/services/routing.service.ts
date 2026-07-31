import { UAParser } from "ua-parser-js";
import { ILink } from "../models/Link";

export const resolveDestination = (
  link: ILink,
  userAgent: string
): string => {
  const parser = new UAParser(userAgent);

  const device = parser.getDevice();

  if (
    (device.type === "mobile" || device.type === "tablet") &&
    link.mobileUrl
  ) {
    return link.mobileUrl;
  }

  if (!device.type && link.desktopUrl) {
    return link.desktopUrl;
  }

  return link.destinationUrl;
};