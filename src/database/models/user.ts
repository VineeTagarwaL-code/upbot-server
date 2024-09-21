import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  image: { type: String },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "PingTask" }],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export { User };
