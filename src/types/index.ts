import { JwtPayload } from "jsonwebtoken";
import { Document, Types } from "mongoose";
type configProp = {
  PORT: string;
  MONGO_URI: string;
  JWT_SECRET: string;
};
interface customPayload extends JwtPayload {
  email: string;
  picture: string;
}
interface CustomRequest extends Request {
  user?: customPayload;
}

interface TaskLog extends Document {
  status: "success" | "failure";
  responseMessage?: string;
  responseTime?: number;
  responseStatus?: number;
  createdAt: Date;
}

interface Task extends Document {
  userId: Types.ObjectId;
  url: string;
  interval: number;
  isActive: boolean;
  createdAt: Date;
  logs: Types.Array<Types.ObjectId | TaskLog>;
  lastPingedAt?: Date;
}

interface IUser extends Document {
  email: string;
  image?: string;
  tasks: Types.Array<Types.ObjectId | Task>;
  createdAt: Date;
}
export { configProp, customPayload, CustomRequest, TaskLog, Task, IUser };
