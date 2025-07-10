import { Request, Response } from "express";
import { Job, Category, ClientProfile } from "../models";
import { createError, asyncHandler } from "../middlewares/errorHandler";

interface AuthRequest extends Request {
    user?: any;
}

export const createJob = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user._id;
    const jobData = req.body;

    // Get client profile
    const clientProfile = await ClientProfile.findOne({ user: userId });
    if (!clientProfile) {
        throw createError("Client profile not found", 404);
    }

    // Create job
    const job = await Job.create({
        ...jobData,
        client: clientProfile._id,
        created_at: new Date(),
        updated_at: new Date(),
    });

    // Populate category and client info
    await job.populate([
        { path: "category", select: "name description" },
        { path: "client", select: "name location" },
    ]);

    res.status(201).json({
        success: true,
        message: "Job created successfully",
        data: job,
    });
});

export const getJobs = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 10, status, category, budget_min, budget_max, search, is_internship } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const filter: any = {};

    // Apply filters
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (is_internship !== undefined) filter.is_internship = is_internship;
    if (budget_min || budget_max) {
        filter.$and = [];
        if (budget_min) filter.$and.push({ budget_min: { $gte: Number(budget_min) } });
        if (budget_max) filter.$and.push({ budget_max: { $lte: Number(budget_max) } });
    }
    if (search) {
        filter.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];
    }

    const jobs = await Job.find(filter).populate("category", "name description").populate("client", "name location").sort({ created_at: -1 }).skip(skip).limit(Number(limit));

    const total = await Job.countDocuments(filter);

    res.json({
        success: true,
        data: {
            jobs,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        },
    });
});

export const getJobById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const job = await Job.findById(id).populate("category", "name description").populate("client", "name location bio");

    if (!job) {
        throw createError("Job not found", 404);
    }

    res.json({
        success: true,
        data: job,
    });
});

export const updateJob = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    // Get client profile
    const clientProfile = await ClientProfile.findOne({ user: userId });
    if (!clientProfile) {
        throw createError("Client profile not found", 404);
    }

    // Find job and verify ownership
    const job = await Job.findOne({ _id: id, client: clientProfile._id });
    if (!job) {
        throw createError("Job not found or access denied", 404);
    }

    // Update job
    Object.assign(job, updateData, { updated_at: new Date() });
    await job.save();

    // Populate related data
    await job.populate([
        { path: "category", select: "name description" },
        { path: "client", select: "name location" },
    ]);

    res.json({
        success: true,
        message: "Job updated successfully",
        data: job,
    });
});

export const deleteJob = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user._id;

    // Get client profile
    const clientProfile = await ClientProfile.findOne({ user: userId });
    if (!clientProfile) {
        throw createError("Client profile not found", 404);
    }

    // Find job and verify ownership
    const job = await Job.findOne({ _id: id, client: clientProfile._id });
    if (!job) {
        throw createError("Job not found or access denied", 404);
    }

    await Job.findByIdAndDelete(id);

    res.json({
        success: true,
        message: "Job deleted successfully",
    });
});

export const getMyJobs = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const filter: any = {};

    // Get client profile
    const clientProfile = await ClientProfile.findOne({ user: userId });
    if (!clientProfile) {
        throw createError("Client profile not found", 404);
    }

    filter.client = clientProfile._id;
    if (status) filter.status = status;

    const jobs = await Job.find(filter).populate("category", "name description").sort({ created_at: -1 }).skip(skip).limit(Number(limit));

    const total = await Job.countDocuments(filter);

    res.json({
        success: true,
        data: {
            jobs,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        },
    });
});

export const getCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const categories = await Category.find().sort({ name: 1 });

    res.json({
        success: true,
        data: categories,
    });
});
