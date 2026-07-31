import mongoose, { Schema, Document } from "mongoose";

export interface IClick extends Document {
  linkId: mongoose.Types.ObjectId;
  device: "mobile" | "tablet" | "desktop";
  browser: string;
  os: string;
  referrer: string;
  createdAt: Date;
}

const clickSchema = new Schema<IClick>(
  {
    linkId: {
      type: Schema.Types.ObjectId,
      ref: "Link",
      required: true,
      index: true,
    },

    device: {
      type: String,
      enum: ["mobile", "tablet", "desktop"],
      default: "desktop",
    },

    browser: {
      type: String,
      default: "Unknown",
    },

    os: {
      type: String,
      default: "Unknown",
    },

    referrer: {
      type: String,
      default: "Direct",
    },
  },
  {
    timestamps: true,
  }
);

export const Click = mongoose.model<IClick>("Click", clickSchema);