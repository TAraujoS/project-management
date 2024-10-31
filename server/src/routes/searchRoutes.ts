import { Router } from "express";
import { search } from "../controllers/searchController";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.get("/", [authMiddleware], errorHandler(search));

export default router;
