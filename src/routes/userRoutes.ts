import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getSuggestions } from "../controllers/userController.js";
import { getMe, updateMe } from "../controllers/userController.js";

const router = Router();

router.get("/users/suggestions", authMiddleware, getSuggestions);
router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);

export default router;
