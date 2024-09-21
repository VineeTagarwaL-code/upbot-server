import type { Request, Response } from "express";
import { SuccessResponse } from "../../utils/success.res";
import { ErrorHandler } from "../../utils/error.res";
import { generateToken } from "../../service/googleauth/generateToken";
import { AsyncWrapper } from "../../utils/async-catch";

const googleAuth = AsyncWrapper(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new ErrorHandler("TOKEN NOT PROVIDED", "UNAUTHORIZED");
  }
  const jwtToken = await generateToken(token);
  if (!jwtToken) {
    throw new ErrorHandler("INVALID TOKEN", "AUTHENTICATION_FAILED");
  }
  const response = new SuccessResponse("Authorization Successfull", 200, {
    token: jwtToken,
  });
  return res.status(response.code).json(response.serialize());
});

export { googleAuth };
