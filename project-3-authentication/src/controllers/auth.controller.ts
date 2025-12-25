import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../models/user.model";
import mongoose from "mongoose";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== "string") {
    const err = new Error("Name is required");
    (err as any).statusCode = 400;
    throw err;
  }
  if (!email || typeof email !== "string" || !email.includes("@")) {
    const err = new Error("Valid email is required");
    (err as any).statusCode = 400;
    throw err;
  }
  if (!password || typeof password !== "string" || password.length < 8) {
    const err = new Error("Password must be at least 6 characters");
    (err as any).statusCode = 400;
    throw err;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new Error("Email already exists");
    (err as any).statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error("Email and password are required");
    (err as any).statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid credentials");
    (err as any).statusCode = 400;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid credentials");
    (err as any).statusCode = 401;
    throw err;
  }

  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

  if (!jwtSecret) {
    const err = new Error("JWT_SECRET is not defined");
    (err as any).statusCode = 500;
    throw err;
  }
  const signOptions: SignOptions = {};
  if (jwtExpiresIn) {
    signOptions.expiresIn = jwtExpiresIn as SignOptions["expiresIn"];
  }

  const token = jwt.sign({ userId: user._id }, jwtSecret, signOptions);

  res.status(200).json({
    token,
  });
};

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  const user = await User.findById(userId).select("-password");
  if (!user) {
    const err = new Error("User not found");
    (err as any).statusCode = 404;
    throw err;
  }

  res.status(200).json(user);
};
