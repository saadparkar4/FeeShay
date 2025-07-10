import { Router } from "express";
import { createJob, getJobs, getJobById, updateJob, deleteJob, getMyJobs, getCategories } from "../controllers/jobController";
import { validateJobCreation, validateJobUpdate, validateMongoId, validatePagination } from "../middlewares/validation";
import { authenticateToken, requireRole } from "../middlewares/auth";

const router = Router();

// Public routes
router.get("/", validatePagination, getJobs);
router.get("/categories", getCategories);
router.get("/:id", validateMongoId, getJobById);

// Protected routes
router.post("/", authenticateToken, requireRole(["client"]), validateJobCreation, createJob);
router.put("/:id", authenticateToken, requireRole(["client"]), validateMongoId, validateJobUpdate, updateJob);
router.delete("/:id", authenticateToken, requireRole(["client"]), validateMongoId, deleteJob);
router.get("/my/jobs", authenticateToken, requireRole(["client"]), validatePagination, getMyJobs);

export default router;
