import { NextFunction } from "express";
import { AsyncWrapper } from "../utils/async-catch";
import { ErrorHandler } from "../utils/error.res";
import jwt from "jsonwebtoken";
import { IUser, customPayload } from "../types";
import { Request, Response } from "express";
import { User } from "../database/models/user";
interface CustomRequest extends Request {
  user?: IUser;
}
export const tokenMiddlware = AsyncWrapper(
  async (req: CustomRequest, _res: Response, next: NextFunction) => {
    const token: string | undefined = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new ErrorHandler("TOKEN NOT PROVIDED", "UNAUTHORIZED");
    }
    const decoded_token_data = jwt.decode(token) as customPayload;
    if (!decoded_token_data) {
      throw new ErrorHandler("INVALID TOKEN", "AUTHENTICATION_FAILED");
    }
    const user = await User.findOne({ email: decoded_token_data.email });
    if (!user) {
      throw new ErrorHandler("USER NOT FOUND", "NOT_FOUND");
    }
    req.user = user;
    next();
  }
);
