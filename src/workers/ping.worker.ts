import { Worker, Job } from "bullmq";
import axios from "axios";
import { PingTask } from "../database/models/task";
import { PingLog } from "../database/models/tasklog";
import { logger } from "../service/logger";
import { connection } from "../service/queues/ping.queue";

const processPing = async (job: Job) => {
  const { pingTaskId } = job.data;
  const pingTask = await PingTask.findById(pingTaskId);

  if (!pingTask || !pingTask.isActive) {
    logger.warn(`Task ${pingTaskId} not found or inactive`);
    return;
  }

  const startTime = Date.now();
  try {
    const response = await axios.get(pingTask.url);
    const responseTime = Date.now() - startTime;
    await PingLog.create({
      pingTaskId: pingTaskId,
      status: "success",
      responseTime,
      responseStatus: response.status,
    });
    pingTask.lastPingedAt = new Date();
    await pingTask.save();
    logger.info(
      `Successfully pinged ${pingTask.url}. Response time: ${responseTime}ms`
    );
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    await PingLog.create({
      pingTaskId,
      status: "failure",
      responseTime,
      responseStatus: error.response ? error.response.status : 0,
    });
    logger.error(`Failed to ping ${pingTask.url}. Error: ${error.message}`);
  }
};

const pingWorker = new Worker("ping-queue", processPing, {
  connection,
  concurrency: 1,
  lockDuration: 30000,
  limiter: {
    max: 1,
    duration: 10000,
  },
});

pingWorker.on("completed", (job) => {
  logger.info(`Job ${job.id} completed successfully`);
});

pingWorker.on("failed", (job: any, err) => {
  logger.error(`Job ${job.id} failed with error: ${err.message}`);
});

pingWorker.on("error", (err) => {
  logger.error(`Worker error: ${err.message}`);
});

logger.info("Ping worker started and waiting for jobs...");

export { pingWorker };
