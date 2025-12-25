import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayLoad {
  userId: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const err = new Error("Unauthorized");
    (err as any).statusCode = 401;
    throw err;
  }

  //extracting the token
  const token = authHeader.split(" ")[1];

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET not defined");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayLoad;

    (req as any).userId = decoded.userId;

    next();
  } catch (error) {
    const err = new Error("Invalid or expired token");
    (err as any).statusCode = 401;
    throw err;
  }
};

export default authMiddleware;