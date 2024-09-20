import dotenv from "dotenv";
import { configProp } from "../types";
import { logger } from "../service/logger";
dotenv.config();

const requiredEnvVars = ["MONGO_URI"];

try {
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`${varName}`);
    }
  });
} catch (err) {
  if (err instanceof Error) {
    logger.error(`ENV MISSING | REQUIRED ENVIRONMENT VARIABLE: ${err.message}`);
    process.exit(1);
  }
}

const config: configProp = {
  PORT: process.env.PORT as string,
  MONGO_URI: process.env.MONGO_URI as string,
};

export { config };
