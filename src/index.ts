import express from "express";
import "dotenv/config";
import cors from "cors";
import { logger } from "./service/logger";
import { connectDB } from "./database";
const app = express();
app.use(cors());

app.use("/*", (req, res, next) => {
  logger.info(`REQUEST | METHOD: ${req.method} | URL: ${req.url}`);
  next();
});

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
