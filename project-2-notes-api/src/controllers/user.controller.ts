import { Request, Response } from "express";
import { User } from "../models/user.model";
import mongoose from "mongoose";

export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || typeof name !== "string") {
    const err = new Error("Name is required");
    (err as any).statusCode = 400;
    throw err;
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    const err = new Error("Email field is required");
    (err as any).statusCode = 400;
    throw err;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new Error("User already exists");
    (err as any).statusCode = 400;
    throw err;
  }

  const user = await User.create({ name, email });

  res.status(201).json(user);
};

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  res.status(200).json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid user id");
    (err as any).statusCode = 400;
    throw err;
  }

  const user = await User.findById(id);

  if (!user) {
    const err = new Error("User not found");
    (err as any).statusCode = 404;
    throw err;
  }

  res.status(200).json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid user ID");
    (err as any).statusCode = 400;
    throw err;
  }

  if (!name || typeof name !== "string") {
    const err = new Error("Name is required");
    (err as any).statusCode = 400;
    throw err;
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    const err = new Error("Email field is required");
    (err as any).statusCode = 400;
    throw err;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser._id.toString() !== id) {
    const err = new Error("email already exists");
    (err as any).statusCode = 400;
    throw err;
  }

  const user = await User.findByIdAndUpdate(id, { name, email }, { new: true });

  if (!user) {
    const err = new Error("User not found");
    (err as any).statusCode = 404;
    throw err;
  }

  res.status(200).json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid user Id");
    (err as any).statusCode = 400;
    throw err;
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    const err = new Error("user not found");
    (err as any).statusCode = 404;
    throw err;
  }

  res.status(200).json({ message: "User deleted successfully" });
};
