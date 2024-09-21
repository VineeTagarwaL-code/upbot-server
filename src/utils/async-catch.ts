import { Request, Response, NextFunction } from "express";
import { standardizeApiError } from "./error.res";
type asyncHandler<T = any> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T>;
export const AsyncWrapper = <T>(handler: asyncHandler<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch((error: unknown) => {
      const standardizedError = standardizeApiError(error);
      res.status(standardizedError.code).json(standardizedError);
    });
  };
};
