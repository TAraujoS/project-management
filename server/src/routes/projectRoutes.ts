import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProjects,
} from "../controllers/projectController";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../error-handler";

const router = Router();

router.post("/", [authMiddleware], errorHandler(createProject));
router.get("/", [authMiddleware], errorHandler(getProjects));
router.delete("/:projectId", [authMiddleware], errorHandler(deleteProject));

export default router;
