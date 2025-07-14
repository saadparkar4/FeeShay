import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/userController";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

// Get all users (for starting new chats)
router.get("/", authenticateToken, getAllUsers);

// Get user by ID
router.get("/:userId", authenticateToken, getUserById);

export default router;