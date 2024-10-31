import { Router } from "express";
import { getTeams } from "../controllers/teamController";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.get("/", [authMiddleware], errorHandler(getTeams));

export default router;
