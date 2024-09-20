import { logger } from "../logger";
import IORedis, { Redis } from "ioredis";

const redisUri = (process.env.REDIS_URL as string) || "redis://localhost:6379";
let redisClient: Redis | undefined;

const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new IORedis(redisUri, {
      maxRetriesPerRequest: null,
    });
    redisClient.on("connect", () => {
      logger.info("SERVER | REDIS: Connected to Redis");
    });

    redisClient.on("error", (err) => {
      logger.error("SERVER: ERROR Connecting to Redis", err);
    });
  }

  return redisClient;
};

export default getRedisClient;
