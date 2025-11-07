import { Router } from "express";
import { createPost, getPosts } from "../auth/post.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getPosts);

export default router;
