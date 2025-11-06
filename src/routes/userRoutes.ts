import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getSuggestions } from "../controllers/userController.js";

const router = Router();

router.get("/users/suggestions", authMiddleware, getSuggestions);

export default router;
