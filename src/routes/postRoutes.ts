import { Router } from "express";
import { createPost, deletePost, getPosts, updatePost } from "../auth/post.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getPosts);
router.delete("/:id", authMiddleware, deletePost);
router.put("/:id", authMiddleware, updatePost);

export default router;
