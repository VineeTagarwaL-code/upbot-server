import { Router } from "express";
import {
  createPingTask,
  getPingTask,
  deactivatePingTask,
} from "../controllers/ping";
import { googleAuth } from "../controllers/auth";
import { tokenMiddlware } from "../middleware/token.middleware";
import { getAllTask } from "../controllers/ping";
const router = Router();

router.post("/task", tokenMiddlware, createPingTask);
router.get("/ping/:id", getPingTask);
router.get("/tasks", tokenMiddlware, getAllTask);
router.put("/ping/:id/deactivate", deactivatePingTask);
router.get("/auth/google", googleAuth);
export { router };
