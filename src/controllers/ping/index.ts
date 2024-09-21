import { logger } from "../../service/logger";
import { PingTask } from "../../database/models/task";
import { Request, Response } from "express";
import { pingQueue } from "../../service/queues/ping.queue";
import { PingLog } from "../../database/models/tasklog";
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

const getPingTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pingTask = await PingTask.findById(id).populate("logs");

    if (!pingTask) {
      res.status(404).json({ message: "Ping task not found" });
      return;
    }

    res.status(200).json({ pingTask });
  } catch (err) {
    logger.error(`Error getting ping task: ${err}`);
    res.status(500).json({ message: "Error getting ping task" });
  }
};

const deactivatePingTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pingTask = await PingTask.findById(id);
    if (!pingTask) {
      res.status(404).json({ message: "Ping task not found" });
      return;
    }
    await pingQueue.removeRepeatableByKey(`pingJob-${id}`);
    pingTask.isActive = false;
    await pingTask.save();
    res.status(200).json({ message: "Ping task deactivated" });
  } catch (err) {
    logger.error(`Error deactivating ping task: ${err}`);
    res.status(500).json({ message: "Error deactivating ping task" });
  }
};

export { createPingTask, getPingTask, deactivatePingTask };
