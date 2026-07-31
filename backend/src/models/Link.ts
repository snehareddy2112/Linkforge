import mongoose, { Document, Schema } from "mongoose";

export interface ILink extends Document {
  title: string;
  shortCode: string;
  destinationUrl: string;

  mobileUrl?: string;
  desktopUrl?: string;
  fallbackUrl?: string;

  isActive: boolean;
  expiresAt?: Date;

  clickCount: number;

  healthStatus: "unknown" | "healthy" | "broken";

  createdAt: Date;
  updatedAt: Date;
}

const linkSchema = new Schema<ILink>(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "Untitled Link",
    },

    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    destinationUrl: {
      type: String,
      required: true,
      trim: true,
    },

    mobileUrl: {
      type: String,
      trim: true,
    },

    desktopUrl: {
      type: String,
      trim: true,
    },

    fallbackUrl: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    expiresAt: {
      type: Date,
    },

    clickCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    healthStatus: {
      type: String,
      enum: ["unknown", "healthy", "broken"],
      default: "unknown",
    },
  },
  {
    timestamps: true,
  }
);

export const Link = mongoose.model<ILink>("Link", linkSchema);