import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  if (!auth) return res.sendStatus(401);

  const token = auth.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.accessSecret) as any;
    req.userId = payload.sub;
    next();
  } catch {
    res.sendStatus(401);
  }
};
