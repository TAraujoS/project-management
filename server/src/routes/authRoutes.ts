import { Router } from "express";
import { errorHandler } from "../error-handler";
import { signin, me, signup } from "../controllers/authController";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.post("/signup", errorHandler(signup));
router.post("/login", errorHandler(signin));
router.get("/me", [authMiddleware], errorHandler(me));
export default router;
