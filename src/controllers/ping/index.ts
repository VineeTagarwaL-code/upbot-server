import { logger } from "../../service/logger";
import { PingTask } from "../../database/models/task";
import { Request, Response } from "express";
import { pingQueue } from "../../service/queues/ping.queue";

const createPingTask = async (req: Request, res: Response) => {
  try {
    const { url, interval } = req.body;
    const pingTask = new PingTask({ url, interval });
    await pingTask.save();

    await pingQueue.add(
      "ping-queue",
      { pingTaskId: pingTask._id.toString() },
      {
        repeat: { every: parseInt(interval) },
        jobId: `pingJob-${pingTask._id}`,
      }
    );

    res.status(201).json({ message: "Ping task created", pingTask });
  } catch (err) {
    logger.error(`Error creating ping task: ${err}`);
    res.status(500).json({ message: "Error creating ping task" });
  }
};

export { createPingTask };
