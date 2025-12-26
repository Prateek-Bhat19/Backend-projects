import express from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import noteRoutes from "./routes/note.routes";
import adminRoutes from "./routes/admin.routes";
import authRoutes from "./routes/auth.routes";
const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

app.use("/api/notes", noteRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

export default app;
