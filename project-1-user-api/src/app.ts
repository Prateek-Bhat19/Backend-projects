import express from "express";
import router from "./routes/user.routes";
import { errorHandler } from "./middleware/error.middleware";
const app = express();

app.use(express.json());

app.use("/api/users", router);

app.use(errorHandler);

export default app;