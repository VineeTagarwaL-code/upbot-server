import type { Request, Response } from "express";
import { SuccessResponse } from "../../utils/success.res";
import { ErrorHandler } from "../../utils/error.res";
import { AsyncWrapper } from "../../utils/async-catch";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../../database/models/user";

interface customPayload extends JwtPayload {
  email: string;
  image: string;
}

const googleAuth = AsyncWrapper(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new ErrorHandler("TOKEN NOT PROVIDED", "UNAUTHORIZED");
  }
  const decoded_token_data = jwt.decode(token) as customPayload;
  if (!decoded_token_data) {
    throw new ErrorHandler("INVALID TOKEN", "AUTHENTICATION_FAILED");
  }
  const user = await User.findOne({ email: decoded_token_data.email });

  if (!user) {
    let newUser = new User({
      id: decoded_token_data.sub,
      email: decoded_token_data.email,
      image: decoded_token_data.picture,
    });

    await newUser.save();
  }

  const response = new SuccessResponse("USER AUTHENTICATED", 200, {
    token: token,
  });
  return res.status(response.code).json(response.serialize());
});

export { googleAuth };
