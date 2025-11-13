import { Router } from "express";
import { createPost, getPosts, updatePost, getMyPosts, deletePost } from "../auth/post.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getPosts);
router.get("/me", authMiddleware, getMyPosts);
router.delete("/:id", authMiddleware, deletePost);
router.put("/:id", authMiddleware, updatePost);

export default router;
