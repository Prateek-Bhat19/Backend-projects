import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = header.split(" ")[1];

  const decoded = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!
  ) as {
    id: string;
    role: "user" | "admin";
  };

  req.user = decoded;
  next();
};
