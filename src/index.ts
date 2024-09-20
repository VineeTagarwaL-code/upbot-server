import express from "express";
import "dotenv/config";
import cors from "cors";
import { logger } from "./service/logger";
import { connectDB } from "./database";
import getRedisClient from "./service/redis";
import { router } from "./routes";
import "./workers/ping.worker";
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", router);
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
async function startServer() {
  await connectDB();
  app.listen(process.env.PORT, () => {
    logger.info(`SERVER | RUNNING ON PORT: ${process.env.PORT}`);
  });
}

(() => {
  startServer();
})();
