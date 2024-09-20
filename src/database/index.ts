import mongoose from "mongoose";
import { logger } from "../service/logger";
import { config } from "../config";
let connection: mongoose.Connection | null = null;

const connectDB = async (): Promise<mongoose.Connection> => {
  if (connection) {
    return connection;
  }

  try {
    await mongoose.connect(config.MONGO_URI, {
      dbName: "upbot",
    });

    logger.info("SERVER | MongoDB - Connected");
    if (!connection) {
      connection = mongoose.connection;
    }
    connection.on("error", (err: Error) => {
      logger.error(`SERVER | MongoDB - Connection Error: ${err.message}`);
    });

    connection.on("disconnected", () => {
      logger.warn(
        "SERVER | MongoDB - Disconnected. Attempting to reconnect..."
      );
      connection = null;
    });

    connection.on("reconnected", () => {
      logger.info("SERVER | MongoDB - Reconnected");
    });

    connection.on("connected", () => {
      logger.info("SERVER | MongoDB - Connection Established");
    });

    return connection;
  } catch (err) {
    if (err instanceof Error) {
      logger.error(`SERVER | MongoDB - Connection Error: ${err.message}`);
    }
    connection = null;
    throw err;
  }
};

export { connectDB };
