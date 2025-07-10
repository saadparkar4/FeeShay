import { Router } from "express";
import {
    createProposal,
    getProposals,
    getProposalById,
    updateProposal,
    deleteProposal,
    getMyProposals,
    getJobProposals,
    updateProposalStatus,
} from "../controllers/proposalController";
import { validateProposalCreation, validateMongoId, validatePagination } from "../middlewares/validation";
import { authenticateToken, requireRole } from "../middlewares/auth";

const router = Router();

// Public routes
router.get("/", validatePagination, getProposals);
router.get("/:id", validateMongoId, getProposalById);

// Protected routes
router.post("/", authenticateToken, requireRole(["freelancer"]), validateProposalCreation, createProposal);
router.put("/:id", authenticateToken, requireRole(["freelancer"]), validateMongoId, updateProposal);
router.delete("/:id", authenticateToken, requireRole(["freelancer"]), validateMongoId, deleteProposal);
router.get("/my/proposals", authenticateToken, requireRole(["freelancer"]), validatePagination, getMyProposals);
router.get("/job/:jobId", authenticateToken, requireRole(["client"]), validatePagination, getJobProposals);
router.put("/:id/status", authenticateToken, requireRole(["client"]), validateMongoId, updateProposalStatus);

export default router;
