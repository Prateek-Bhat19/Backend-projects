import { Request, Response } from "express";
import { User } from "../models/user.model";
import { AppError } from "../utils/appError";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { signToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    throw new AppError("Invalid email", 400);
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    throw new AppError("Invalid password", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    role: "user",
  });

  const token = signToken({
    id: user._id.toString(),
    role: user.role,
  });

  res.status(201).json({
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string") {
    throw new AppError("Invalid email", 400);
  }

  if (!password || typeof password !== "string") {
    throw new AppError("Invalid password", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = signToken({
    id: user._id.toString(),
    role: user.role,
  });

  res.status(200).json({
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
  });
};
