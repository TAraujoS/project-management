import { Router } from "express";
import { createProject, getProjects } from "../controllers/projectController";

const router = Router();

router.post("/", createProject);
router.get("/", getProjects);

export default router;
