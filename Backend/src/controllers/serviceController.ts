import { Request, Response } from "express";
import { Service, Category, FreelancerProfile } from "../models";
import { createError, asyncHandler } from "../middlewares/errorHandler";

interface AuthRequest extends Request {
    user?: any;
}

export const createService = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user._id;
    const serviceData = req.body;

    // Get freelancer profile
    const freelancerProfile = await FreelancerProfile.findOne({ user: userId });
    if (!freelancerProfile) {
        throw createError("Freelancer profile not found", 404);
    }

    // Create service
    const service = await Service.create({
        ...serviceData,
        freelancer: freelancerProfile._id,
        created_at: new Date(),
        updated_at: new Date(),
    });

    // Populate category info
    await service.populate("category", "name description");

    res.status(201).json({
        success: true,
        message: "Service created successfully",
        data: service,
    });
});

export const getServices = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 10, status, category, price_min, price_max, search, freelancer } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const filter: any = {};

    // Apply filters
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (freelancer) filter.freelancer = freelancer;
    if (price_min || price_max) {
        filter.$and = [];
        if (price_min) filter.$and.push({ price: { $gte: Number(price_min) } });
        if (price_max) filter.$and.push({ price: { $lte: Number(price_max) } });
    }
    if (search) {
        filter.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];
    }

    const services = await Service.find(filter)
        .populate("category", "name description")
        .populate("freelancer", "name location skills")
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await Service.countDocuments(filter);

    res.json({
        success: true,
        data: {
            services,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        },
    });
});

export const getServiceById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const service = await Service.findById(id).populate("category", "name description").populate("freelancer", "name location skills bio");

    if (!service) {
        throw createError("Service not found", 404);
    }

    res.json({
        success: true,
        data: service,
    });
});

export const updateService = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    // Get freelancer profile
    const freelancerProfile = await FreelancerProfile.findOne({ user: userId });
    if (!freelancerProfile) {
        throw createError("Freelancer profile not found", 404);
    }

    // Find service and verify ownership
    const service = await Service.findOne({ _id: id, freelancer: freelancerProfile._id });
    if (!service) {
        throw createError("Service not found or access denied", 404);
    }

    // Update service
    Object.assign(service, updateData, { updated_at: new Date() });
    await service.save();

    // Populate related data
    await service.populate("category", "name description");

    res.json({
        success: true,
        message: "Service updated successfully",
        data: service,
    });
});

export const deleteService = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user._id;

    // Get freelancer profile
    const freelancerProfile = await FreelancerProfile.findOne({ user: userId });
    if (!freelancerProfile) {
        throw createError("Freelancer profile not found", 404);
    }

    // Find service and verify ownership
    const service = await Service.findOne({ _id: id, freelancer: freelancerProfile._id });
    if (!service) {
        throw createError("Service not found or access denied", 404);
    }

    await Service.findByIdAndDelete(id);

    res.json({
        success: true,
        message: "Service deleted successfully",
    });
});

export const getMyServices = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
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

    const services = await Service.find(filter).populate("category", "name description").sort({ created_at: -1 }).skip(skip).limit(Number(limit));

    const total = await Service.countDocuments(filter);

    res.json({
        success: true,
        data: {
            services,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        },
    });
});
