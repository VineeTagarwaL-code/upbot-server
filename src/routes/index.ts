import { Router } from "express";
import { createPingTask } from "../controllers/ping";

const router = Router();

router.post("/ping", createPingTask);
export { router };
