import { Router } from "express";
import { getUsers } from "../controllers/usersController";

const router = Router();

router.get("/", getUsers);

export default router;
