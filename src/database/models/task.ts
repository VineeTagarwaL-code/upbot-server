import mongoose, { Model } from "mongoose";
import { Task } from "../../types";
const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  url: { type: String, required: true },
  interval: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  logs: [{ type: mongoose.Schema.Types.ObjectId, ref: "PingLog" }],
  lastPingedAt: { type: Date },
});

const PingTask: Model<Task> = mongoose.model<Task>("PingTask", taskSchema);
export { PingTask };
