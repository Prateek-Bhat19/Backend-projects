import { buffer } from "node:stream/consumers";
import cloudinary from "../config/cloudinary";
import { rejects } from "node:assert";

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  bytes: number;
  format: string;
}

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            return reject(error);
          }

          resolve(result as CloudinaryUploadResult);
        }
      )
      .end(buffer);
  });
};
export const deleteFromCloudinary = async (
  publicId: string
): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};
