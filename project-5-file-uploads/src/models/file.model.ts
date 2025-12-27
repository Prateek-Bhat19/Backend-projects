import { Schema, model, Types } from "mongoose";

const fileSchema = new Schema(
  {
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true, 
    },
  },
  { timestamps: true }
);

export const File = model("File", fileSchema);
