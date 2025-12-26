import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError";

interface JwtPayLoad {
  id: string;
  role: 'user' | 'admin';
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError("Unauthorized", 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayLoad;

    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError("Unauthorized", 401);
  }
};
