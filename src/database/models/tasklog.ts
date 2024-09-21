const mongoose = require("mongoose");

const pingLogSchema = new mongoose.Schema({
  status: { type: String, enum: ["success", "failure"], required: true },
  responseMessage: { type: String },
  responseTime: { type: Number },
  responseStatus: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const PingLog = mongoose.model("PingLog", pingLogSchema);
export { PingLog };
