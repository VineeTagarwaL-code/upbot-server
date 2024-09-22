import { logger } from "../../service/logger";
import { PingTask } from "../../database/models/task";
import { Request, Response } from "express";
import { pingQueue } from "../../service/queues/ping.queue";
import { PingLog } from "../../database/models/tasklog";
import { AsyncWrapper } from "../../utils/async-catch";
import { IUser, customPayload } from "../../types";
import { SuccessResponse } from "../../utils/success.res";
import { ErrorHandler } from "../../utils/error.res";
import { Types } from "mongoose";
import { User } from "../../database/models/user";

interface CustomRequest extends Request {
  user?: IUser;
}

const createPingTask = AsyncWrapper(
  async (req: CustomRequest, res: Response) => {
    const { url, interval } = req.body;
    const user = req.user;
    if (!user) {
      throw new ErrorHandler("User not found", "NOT_FOUND");
    }
    const existingTask = await PingTask.findOne({ url, userId: user._id });
    if (existingTask) {
      throw new ErrorHandler("Task already exists", "CONFLICT");
    }
    const pingTask = new PingTask({ userId: user._id, url, interval });
    const pingTaskid = pingTask._id as Types.ObjectId;
    const dbUser = await User.findById(user._id);
    if (!dbUser) {
      throw new ErrorHandler("User not found", "NOT_FOUND");
    }
    dbUser.tasks.push(pingTaskid);
    await dbUser.save();
    await pingTask.save();

    await pingQueue.add(
      "ping-queue",
      { pingTaskId: pingTaskid.toString() },
      {
        repeat: { every: parseInt(interval) * 60 * 1000 },
        jobId: `pingJob-${pingTask._id}`,
      }
    );

    const response = new SuccessResponse("Ping task created", 201, {
      task: pingTask,
    });
    return res.status(response.code).json(response.serialize());
  }
);

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

const getAllTask = AsyncWrapper(async (req: CustomRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new ErrorHandler("User not found", "NOT_FOUND");
  }
  const tasks = await PingTask.find({ userId: user._id }).populate("logs");
  const response = new SuccessResponse("TASK FETCHED", 200, {
    tasks,
  });
  return res.status(response.code).json(response.serialize());
});

export { createPingTask, getPingTask, deactivatePingTask, getAllTask };
