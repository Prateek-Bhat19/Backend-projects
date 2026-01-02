import { Queue } from "bullmq";
import { redis } from "./redis";

export const linkQueue = new Queue("link-processing", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
