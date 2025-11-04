import { Router } from "express";
import { signUp } from "../auth/sign-up.js";
import { signIn } from "../auth/sign-in.js";

const router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);

export default router;
