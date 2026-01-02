import { Worker } from "bullmq";
import { redis } from "../queue/redis";
import { extractMetadata } from "./extractMetadata";
import { setCachedMetadata } from "../queue/cache";
console.log("Worker process started");

const worker = new Worker(
  "link-processing",
  async (job) => {
    const { url } = job.data;

    const metadata = await extractMetadata(url);

    await setCachedMetadata(url, metadata);

    return metadata;
  },
  { connection: redis }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed`, err.message);
});
