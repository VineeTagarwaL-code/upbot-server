import mongoose, { Model } from "mongoose";
import { IUser } from "../../types";
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  image: { type: String },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "PingTask" }],
  createdAt: { type: Date, default: Date.now },
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export { User };
