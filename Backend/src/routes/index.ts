import { Router } from "express";
import authRoutes from "./auth";
import jobRoutes from "./jobs";
import serviceRoutes from "./services";
import proposalRoutes from "./proposals";
import messageRoutes from "./messages";
import reviewRoutes from "./reviews";
import talentRoutes from "./talentRoutes";

const router = Router();

// API version prefix
const API_PREFIX = "/api/v1";

// Mount routes
router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}/talents`, talentRoutes);
router.use(`${API_PREFIX}/jobs`, jobRoutes);
router.use(`${API_PREFIX}/services`, serviceRoutes);
router.use(`${API_PREFIX}/proposals`, proposalRoutes);
router.use(`${API_PREFIX}/messages`, messageRoutes);
router.use(`${API_PREFIX}/reviews`, reviewRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "FeeShay API is running",
        timestamp: new Date().toISOString(),
    });
});

export default router;
