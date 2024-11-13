import { Router } from "express";
import { errorHandler } from "../error-handler";
import { signin, me, signup, signout } from "../controllers/authController";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.post("/signup", errorHandler(signup));
router.post("/signin", errorHandler(signin));
router.get("/me", [authMiddleware], errorHandler(me));
router.post("/signout", [authMiddleware], errorHandler(signout));
export default router;
