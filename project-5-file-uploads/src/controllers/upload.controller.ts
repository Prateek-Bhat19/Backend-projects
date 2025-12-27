import { Request, Response } from "express";
import { uploadToCloudinary,deleteFromCloudinary } from "../services/upload.service";
import { File } from "../models/file.model";
import { AppError } from "../utils/appError";

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 400);
  }

  if (!req.file) {
    throw new AppError("File is required", 400);
  }
  const result = await uploadToCloudinary(req.file.buffer, "uploads");

  const file = await File.create({
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    url: result.secure_url,
    publicId: result.public_id,
    uploadedBy: req.user.id,
  });
  res.status(201).json({
    id: file.id,
    url: file.url,
  });
};

export const deleteFile = async (
  req: Request,
  res: Response
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const file = await File.findById(req.params.id);
  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  const isOwner =
    file.uploadedBy.toString() === req.user.id;
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await deleteFromCloudinary(file.publicId);
  await file.deleteOne();

  res.json({ message: "File deleted" });
};