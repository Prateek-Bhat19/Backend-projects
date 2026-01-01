import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import authRoutes from "./modules/auth/auth.routes";
import { requireAuth } from "./middlewares/auth.middleware";
const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));
app.use("/auth", authRoutes);
app.get("/protected", requireAuth, (req, res) => {
  res.json({ userId: req.userId });
});

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

export default app;
