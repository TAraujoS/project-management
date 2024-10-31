import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  getUserTasks,
  updateTaskStatus,
} from "../controllers/taskController";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../error-handler";

const router = Router();

router.post("/", [authMiddleware], errorHandler(createTask));
router.get("/", [authMiddleware], errorHandler(getTasks));
router.patch(
  "/:taskId/status",
  [authMiddleware],
  errorHandler(updateTaskStatus)
);
router.get("/user/:userId", [authMiddleware], errorHandler(getUserTasks));
router.delete("/:taskId", [authMiddleware], errorHandler(deleteTask));

export default router;
