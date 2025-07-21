import { Request, Response } from "express";
import { Proposal, Job, FreelancerProfile, ClientProfile } from "../models";
import { createError, asyncHandler } from "../middlewares/errorHandler";

interface AuthRequest extends Request {
    user?: any;
}

export const createProposal = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user._id;
    const { job: jobId, cover_letter, proposed_price } = req.body;

    // Get freelancer profile
    const freelancerProfile = await FreelancerProfile.findOne({ user: userId });
    if (!freelancerProfile) {
        throw createError("Freelancer profile not found", 404);
    }

    // Check if job exists and is open
    const job = await Job.findById(jobId);
    if (!job) {
        throw createError("Job not found", 404);
    }
    if (job.status !== "open") {
        throw createError("Job is not open for proposals", 400);
    }

    // Check if proposal already exists
    const existingProposal = await Proposal.findOne({
        job: jobId,
        freelancer: freelancerProfile._id,
    });
    if (existingProposal) {
        throw createError("You have already submitted a proposal for this job", 400);
    }

    // Create proposal
    const proposal = await Proposal.create({
        job: jobId,
        freelancer: freelancerProfile._id,
        cover_letter,

        proposed_price,
        created_at: new Date(),
        updated_at: new Date(),
    });

    // Populate related data
    await proposal.populate([
        { path: "job", select: "title description budget_min budget_max" },
        { path: "freelancer", select: "name location skills" },
    ]);

    res.status(201).json({
        success: true,
        message: "Proposal submitted successfully",
        data: proposal,
    });
});

export const getProposals = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 10, status, job, freelancer } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const filter: any = {};

    // Apply filters
    if (status) filter.status = status;
    if (job) filter.job = job;
    if (freelancer) filter.freelancer = freelancer;

    const proposals = await Proposal.find(filter)
        .populate("job", "title description budget_min budget_max status")
        .populate("freelancer", "name location skills")
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await Proposal.countDocuments(filter);

    res.json({
        success: true,
        data: {
            proposals,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        },
    });
});

export const getProposalById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const proposal = await Proposal.findById(id).populate("job", "title description budget_min budget_max status client").populate("freelancer", "name location skills bio");

    if (!proposal) {
        throw createError("Proposal not found", 404);
    }

    res.json({
        success: true,
        data: proposal,
    });
});

export const updateProposal = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    // Get freelancer profile
    const freelancerProfile = await FreelancerProfile.findOne({ user: userId });
    if (!freelancerProfile) {
        throw createError("Freelancer profile not found", 404);
    }

    // Find proposal and verify ownership
    const proposal = await Proposal.findOne({ _id: id, freelancer: freelancerProfile._id });
    if (!proposal) {
        throw createError("Proposal not found or access denied", 404);
    }

    // Only allow updates if proposal is active
    if (proposal.status !== "active") {
        throw createError("Cannot update proposal that is not active", 400);
    }

    // Update proposal
    Object.assign(proposal, updateData, { updated_at: new Date() });
    await proposal.save();

    // Populate related data
    await proposal.populate([
        { path: "job", select: "title description budget_min budget_max" },
        { path: "freelancer", select: "name location skills" },
    ]);

    res.json({
        success: true,
        message: "Proposal updated successfully",
        data: proposal,
    });
});

export const deleteProposal = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user._id;

    // Get freelancer profile
    const freelancerProfile = await FreelancerProfile.findOne({ user: userId });
    if (!freelancerProfile) {
        throw createError("Freelancer profile not found", 404);
    }

    // Find proposal and verify ownership
    const proposal = await Proposal.findOne({ _id: id, freelancer: freelancerProfile._id });
    if (!proposal) {
        throw createError("Proposal not found or access denied", 404);
    }

    await Proposal.findByIdAndDelete(id);

    res.json({
        success: true,
        message: "Proposal deleted successfully",
    });
});

export const getMyProposals = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const filter: any = {};

    // Get freelancer profile
    const freelancerProfile = await FreelancerProfile.findOne({ user: userId });
    if (!freelancerProfile) {
        throw createError("Freelancer profile not found", 404);
    }

    filter.freelancer = freelancerProfile._id;
    if (status) filter.status = status;

    const proposals = await Proposal.find(filter).populate("job", "title description budget_min budget_max status").sort({ created_at: -1 }).skip(skip).limit(Number(limit));

    const total = await Proposal.countDocuments(filter);

    res.json({
        success: true,
        data: {
            proposals,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        },
    });
});

export const getJobProposals = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { jobId } = req.params;
    const userId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const filter: any = { job: jobId };

    // Verify job ownership
    const clientProfile = await ClientProfile.findOne({ user: userId });
    if (!clientProfile) {
        throw createError("Client profile not found", 404);
    }

    const job = await Job.findOne({ _id: jobId, client: clientProfile._id });
    if (!job) {
        throw createError("Job not found or access denied", 404);
    }

    if (status) filter.status = status;

    const proposals = await Proposal.find(filter).populate("freelancer", "name location skills bio").sort({ created_at: -1 }).skip(skip).limit(Number(limit));

    const total = await Proposal.countDocuments(filter);

    res.json({
        success: true,
        data: {
            proposals,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        },
    });
});

export const updateProposalStatus = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    // Get client profile
    const clientProfile = await ClientProfile.findOne({ user: userId });
    if (!clientProfile) {
        throw createError("Client profile not found", 404);
    }

    // Find proposal and verify job ownership
    const proposal = await Proposal.findById(id).populate("job");
    if (!proposal) {
        throw createError("Proposal not found", 404);
    }

    const job = await Job.findOne({ _id: proposal.job, client: clientProfile._id });
    if (!job) {
        throw createError("Access denied", 403);
    }

    // Update proposal status
    proposal.status = status;
    proposal.updated_at = new Date();
    await proposal.save();

    // If proposal is accepted, update job status
    if (status === "completed") {
        job.status = "in_progress";
        job.updated_at = new Date();
        await job.save();
    }

    res.json({
        success: true,
        message: "Proposal status updated successfully",
        data: proposal,
    });
});
