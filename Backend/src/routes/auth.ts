import { Router } from "express";
import { register, login, getProfile, updateProfile, changePassword } from "../controllers/authController";
import { validateUserRegistration, validateUserLogin, validateProfileUpdate } from "../middlewares/validation";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

// Public routes
router.post("/register", validateUserRegistration, register);
router.post("/login", validateUserLogin, login);

// Protected routes
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, validateProfileUpdate, updateProfile);
router.put("/change-password", authenticateToken, changePassword);

export default router;
