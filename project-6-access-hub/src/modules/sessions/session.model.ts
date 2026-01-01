import { Schema, model, Types } from "mongoose";

const sessionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    refreshTokenHash: { type: String, required: true },
    userAgent: String,
    ip: String,
    revoked: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Session = model("Session", sessionSchema);
