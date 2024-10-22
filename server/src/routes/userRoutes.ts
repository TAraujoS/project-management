import { Router } from "express";
import { createUser, getUsers } from "../controllers/usersController";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);

export default router;
