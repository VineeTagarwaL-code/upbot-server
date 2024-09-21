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

    const pingLog = await PingLog.create({
      pingTaskId: pingTaskId,
      status: "success",
      responseTime,
      responseMessage: response.data,
      responseStatus: response.status,
    });

    pingTask.lastPingedAt = new Date();
    pingTask.logs.push(pingLog._id);

    if (pingTask.logs.length > 3) {
      const oldestLogId = pingTask.logs.shift();
      await PingLog.findByIdAndDelete(oldestLogId);
    }

    await pingTask.save();
  } catch (error: any) {
    const responseTime = Date.now() - startTime;

    const pingLog = await PingLog.create({
      pingTaskId,
      status: "failure",
      responseTime,
      responseMessage: error.message || "Unknown error",
      responseStatus: error.response ? error.response.status : 0,
    });

    pingTask.lastPingedAt = new Date();
    pingTask.logs.push(pingLog._id);

    if (pingTask.logs.length > 3) {
      const oldestLogId = pingTask.logs.shift();
      await PingLog.findByIdAndDelete(oldestLogId);
    }

    await pingTask.save();
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

export { pingWorker };
