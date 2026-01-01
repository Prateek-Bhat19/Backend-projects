import dotenv from "dotenv";

dotenv.config();

const required = [
    "PORT",
    "MONGODB_URI",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "GITHUB_CALLBACK_URL"
];

required.forEach((key) => {
    if(!process.env[key]) {
        throw new Error(`Missing env variable : ${key}`);
    }
});

export const env = {
    port: Number(process.env.PORT),
    mongoUri: process.env.MONGODB_URI!,
  accessSecret: process.env.JWT_ACCESS_SECRET!,
  refreshSecret: process.env.JWT_REFRESH_SECRET!,
  cookieDomain: process.env.COOKIE_DOMAIN || "localhost",
  github: {
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  callbackUrl: process.env.GITHUB_CALLBACK_URL!
}
}