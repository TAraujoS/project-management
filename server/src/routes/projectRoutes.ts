import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProjects,
} from "../controllers/projectController";

const router = Router();

router.post("/", createProject);
router.get("/", getProjects);
router.delete("/:projectId", deleteProject);

export default router;
