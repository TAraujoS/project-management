import { Router } from "express";
import { errorHandler } from "../error-handler";
import { login, signup } from "../controllers/authController";

const router = Router();

router.post("/signup", errorHandler(signup));
router.post("/login", errorHandler(login));

export default router;
