import express from "express";
import userRoutes from "./routes/user.routes";
import noteRoutes from "./routes/note.routers";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);
app.use(errorHandler)
export default app;
