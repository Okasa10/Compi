import { Queue, QueueEvents } from "bullmq";

export const connection = {
  host: "localhost",
  port: 6379,
};
export const executionQueue = new Queue("containers", {
  connection,
});

export const queueEvents = new QueueEvents("containers", {
  connection,
});

async function initializeQueueEvents() {
  await queueEvents.waitUntilReady();
}
initializeQueueEvents().catch((err) => {
  console.error("Failed to initialize queue events:", err);
});
