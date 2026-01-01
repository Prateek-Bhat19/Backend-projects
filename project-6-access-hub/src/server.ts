import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";

const start = async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`server running on port ${env.port}`);
  });
};

start();
