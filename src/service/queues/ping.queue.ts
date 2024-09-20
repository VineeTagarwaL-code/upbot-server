import { Queue } from "bullmq";
import IORedis from "ioredis";
export const connection = new IORedis("redis://localhost:6379", {
  maxRetriesPerRequest: null,
});
const pingQueue = new Queue("ping-queue", { connection });

export { pingQueue };
