import express  from "express";
import authRoutes from "./routes/auth.routes";
import uploadRoutes from "./routes/upload.routes";
import { errorHandler } from "./middlewares/errorHandler.middleware";
const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/uploads",uploadRoutes);

app.use(errorHandler);
export default app;