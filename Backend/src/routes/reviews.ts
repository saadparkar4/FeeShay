import { Router } from "express";
import { createReview, getReviews, getReviewById, updateReview, deleteReview, getUserReviews } from "../controllers/reviewController";
import { validateReviewCreation, validateMongoId, validatePagination } from "../middlewares/validation";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

// Public routes
router.get("/", validatePagination, getReviews);
router.get("/:id", validateMongoId, getReviewById);
router.get("/user/:userId", validateMongoId, validatePagination, getUserReviews);

// Protected routes
router.post("/", authenticateToken, validateReviewCreation, createReview);
router.put("/:id", authenticateToken, validateMongoId, updateReview);
router.delete("/:id", authenticateToken, validateMongoId, deleteReview);

export default router;
