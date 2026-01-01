import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env";

export const createAccessToken = (userId: string) => {
    return jwt.sign({sub: userId}, env.accessSecret, {
        expiresIn: "1m"
    })
}

export const createRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
}

export const hashToken = (token: string) => {
    return crypto.createHash("sha256").update(token).digest("hex");
}
