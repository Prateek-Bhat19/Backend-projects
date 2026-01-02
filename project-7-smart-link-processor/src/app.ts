import express from "express";
import { linkQueue } from "./queue/link.queue";
import { normalizeUrl } from "./utils/normalizeUrl";
import { getCachedMetadata } from "./queue/cache";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
  })
);
app.use(express.json());

app.post("/links", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL required" });
  }

  const normalizedUrl = normalizeUrl(url);
  
  const cached = await getCachedMetadata(normalizedUrl);
  if(cached) {
    return res.status(200).json({
        status: "cached",
        data: cached
    })
  }

  const job = await linkQueue.add("process-link", { url: normalizedUrl });

  res.status(202).json({
    jobId: job.id,
    status: "queued"
  });
});

export default app;
