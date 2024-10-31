import { Router } from "express";
import { getUser, getUsers } from "../controllers/usersController";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.get("/", [authMiddleware], errorHandler(getUsers));
router.get("/:userId", [authMiddleware], errorHandler(getUser));

export default router;
