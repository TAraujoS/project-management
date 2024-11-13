import { Router } from "express";
import { getUser, getUsers, updateUser } from "../controllers/usersController";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.get("/", [authMiddleware], errorHandler(getUsers));
router.get("/:userId", [authMiddleware], errorHandler(getUser));
router.patch("/:userId", [authMiddleware], errorHandler(updateUser));

export default router;
