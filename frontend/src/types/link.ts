export interface SmartLink {
  _id: string;
  title: string;
  shortCode: string;
  shortUrl: string;
  destinationUrl: string;

  mobileUrl?: string;
  desktopUrl?: string;
  fallbackUrl?: string;

  isActive: boolean;
  expiresAt?: string;

  clickCount: number;

  healthStatus: "unknown" | "healthy" | "broken";

  createdAt: string;
  updatedAt: string;
}

export interface CreateLinkPayload {
  title: string;
  destinationUrl: string;
  customAlias?: string;
  mobileUrl?: string;
  desktopUrl?: string;
  fallbackUrl?: string;
  expiresAt?: string;
}