import { Router } from "express";
import {
  createPingTask,
  getPingTask,
  deactivatePingTask,
} from "../controllers/ping";
import { googleAuth } from "../controllers/auth";
const router = Router();

router.post("/ping", createPingTask);
router.get("/ping/:id", getPingTask);
router.put("/ping/:id/deactivate", deactivatePingTask);
router.get("/auth/google", googleAuth);
export { router };
