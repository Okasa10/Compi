import { Worker } from "bullmq";
import { connection } from "../config/bullmq";

const worker = new Worker(
  "containers",
  async (job) => {
    console.log("Processing Job:", job.id);

    return { success: true, id: job.id };
  },
  {
    connection,
    concurrency: 5,
  }
);

worker.on("completed", (job, result) => {
  console.log(`${job.id} completed`, result);
});

worker.on("failed", (job, err) => {
  console.log(`${job?.id ?? "unknown"} failed: ${err.message}`);
});

worker.on("error", (err) => {
  console.error("Worker error:", err);
});

worker.on("stalled", (jobId) => {
  console.warn(`Job stalled: ${jobId}`);
});

process.on("SIGINT", async () => {
  await worker.close();
  process.exit(0);
});