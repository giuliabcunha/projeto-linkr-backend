import { Router } from "express";
import { createPost } from "../auth/post.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, createPost);

export default router;
