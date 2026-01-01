import { Request, Response } from "express";
import axios from "axios";
import { env } from "../../config/env";
import { User } from "./user.model";
import { createAccessToken, createRefreshToken, hashToken } from "../../services/token.service";
import { Session } from "../sessions/session.model";

export const githubRedirect = (_: Request, res: Response) => {
  const url =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${env.github.clientId}` +
    `&redirect_uri=${env.github.callbackUrl}` +
    `&scope=read:user user:email`;

  res.redirect(url);
};

export const githubCallBack = async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: "Missing Code" });
  }

  /*1. exchange the code for access token */
  const tokenRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: env.github.clientId,
      client_secret: env.github.clientSecret,
      code,
    },
    { headers: { Accept: "application/json" } }
  );

  const githubAccessToken = tokenRes.data.access_token;

  const userRes = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${githubAccessToken}`,
    },
  });
  const githubUser = userRes.data;

  /* 3. Find or create user */
  const user = await User.findOneAndUpdate(
    {
      provider: "github",
      providerId: githubUser.id,
    },
    {
      provider: "github",
      providerId: githubUser.id,
      name: githubUser.name,
      email: githubUser.email,
    },
    { upsert: true, new: true }
  );

  /* TEMP response */
  const refreshToken = createRefreshToken();
const refreshTokenHash = hashToken(refreshToken);

await Session.create({
  userId: user._id,
  refreshTokenHash,
  userAgent: req.headers["user-agent"],
  ip: req.ip,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
});

const accessToken = createAccessToken(user._id.toString());

res
  .cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: false, // true in prod
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
  .redirect(`/?token=${accessToken}`);
};

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refresh_token;
  if (!token) return res.sendStatus(401);

  const tokenHash = hashToken(token);

  const session = await Session.findOne({
    refreshTokenHash: tokenHash,
    revoked: false
  });

  if (!session) return res.sendStatus(403);

  session.revoked = true;
  await session.save();

  const newRefreshToken = createRefreshToken();
  const newRefreshTokenHash = hashToken(newRefreshToken);

  await Session.create({
    userId: session.userId,
    refreshTokenHash: newRefreshTokenHash,
    userAgent: req.headers["user-agent"],
    ip: req.ip,
    expiresAt: session.expiresAt
  });

  const accessToken = createAccessToken(session.userId.toString());

  res
    .cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    .json({ accessToken });
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refresh_token;
  if (token) {
    await Session.updateOne(
      { refreshTokenHash: hashToken(token) },
      { revoked: true }
    );
  }

  res.clearCookie("refresh_token").sendStatus(204);
};
