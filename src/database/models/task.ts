import mongoose from "mongoose";
const pingTaskSchema = new mongoose.Schema({
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  url: { type: String, required: true },
  interval: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastPingedAt: { type: Date },
});

const PingTask = mongoose.model("PingTask", pingTaskSchema);
export { PingTask };
