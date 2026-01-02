import cron from "node-cron";
import { redis } from "../queue/redis";
import { linkQueue } from "../queue/link.queue";

cron.schedule("0 */6 * * *", async () => {
  console.log("Cron: reprocessing cached links");

  const keys = await redis.keys("link:meta:*");

  if (!Array.isArray(keys) || keys.length === 0) {
    console.log("Cron: no cached links found");
    return;
  }

  for (const key of keys) {
    // 🔒 Defensive checks
    if (typeof key !== "string") {
      continue;
    }

    if (!key.startsWith("link:meta:")) {
      continue;
    }

    const url = key.slice("link:meta:".length);

    if (!url) {
      continue;
    }

    await linkQueue.add("process-link", { url });

    console.log("Re-enqueued:", url);
  }
});
