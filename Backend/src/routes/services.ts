import { Router } from "express";
import { createService, getServices, getServiceById, updateService, deleteService, getMyServices } from "../controllers/serviceController";
import { validateServiceCreation, validateMongoId, validatePagination } from "../middlewares/validation";
import { authenticateToken, requireRole } from "../middlewares/auth";

const router = Router();

// Public routes
router.get("/", validatePagination, getServices);
router.get("/:id", validateMongoId, getServiceById);

// Protected routes
router.post("/", authenticateToken, requireRole(["freelancer"]), validateServiceCreation, createService);
router.put("/:id", authenticateToken, requireRole(["freelancer"]), validateMongoId, updateService);
router.delete("/:id", authenticateToken, requireRole(["freelancer"]), validateMongoId, deleteService);
router.get("/my/services", authenticateToken, requireRole(["freelancer"]), validatePagination, getMyServices);

export default router;
