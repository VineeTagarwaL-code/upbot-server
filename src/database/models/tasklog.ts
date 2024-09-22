import mongoose, { Model } from "mongoose";

import { TaskLog } from "../../types";
const TaskLogSchema = new mongoose.Schema({
  status: { type: String, enum: ["success", "failure"], required: true },
  responseMessage: { type: String },
  responseTime: { type: Number },
  responseStatus: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const PingLog: Model<TaskLog> = mongoose.model<TaskLog>(
  "PingLog",
  TaskLogSchema
);
export { PingLog };
