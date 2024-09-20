const mongoose = require("mongoose");

const pingLogSchema = new mongoose.Schema({
  pingTaskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PingTask",
    required: true,
  },
  status: { type: String, enum: ["success", "failure"], required: true },
  responseTime: { type: Number },
  responseStatus: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const PingLog = mongoose.model("PingLog", pingLogSchema);
export { PingLog };
