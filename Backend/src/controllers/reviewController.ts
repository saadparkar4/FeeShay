import { Request, Response } from "express";
import { Review, User, Job } from "../models";
import { createError, asyncHandler } from "../middlewares/errorHandler";

interface AuthRequest extends Request {
    user?: any;
}

export const createReview = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user._id;
    const { reviewee, job, rating, comment } = req.body;

    // Check if reviewee exists
    const revieweeUser = await User.findById(reviewee);
    if (!revieweeUser) {
        throw createError("User to review not found", 404);
    }

    // Check if job exists (if provided)
    if (job) {
        const jobExists = await Job.findById(job);
        if (!jobExists) {
            throw createError("Job not found", 404);
        }
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
        reviewer: userId,
        reviewee,
        job: job || null,
    });
    if (existingReview) {
        throw createError("You have already reviewed this user for this job", 400);
    }

    // Determine sentiment based on rating
    let sentiment = "neutral";
    if (rating >= 4) sentiment = "positive";
    else if (rating <= 2) sentiment = "negative";

    // Create review
    const review = await Review.create({
        reviewer: userId,
        reviewee,
        job,
        rating,
        comment,
        sentiment,
        created_at: new Date(),
    });

    // Populate related data
    await review.populate([
        { path: "reviewer", select: "email" },
        { path: "reviewee", select: "email" },
        { path: "job", select: "title" },
    ]);

    res.status(201).json({
        success: true,
        message: "Review created successfully",
        data: review,
    });
});

export const getReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 10, reviewee, reviewer, job, rating, sentiment } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const filter: any = {};

    // Apply filters
    if (reviewee) filter.reviewee = reviewee;
    if (reviewer) filter.reviewer = reviewer;
    if (job) filter.job = job;
    if (rating) filter.rating = Number(rating);
    if (sentiment) filter.sentiment = sentiment;

    const reviews = await Review.find(filter)
        .populate("reviewer", "email")
        .populate("reviewee", "email")
        .populate("job", "title")
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await Review.countDocuments(filter);

    res.json({
        success: true,
        data: {
            reviews,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        },
    });
});

export const getReviewById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const review = await Review.findById(id).populate("reviewer", "email").populate("reviewee", "email").populate("job", "title description");

    if (!review) {
        throw createError("Review not found", 404);
    }

    res.json({
        success: true,
        data: review,
    });
});

export const updateReview = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user._id;
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Find review and verify ownership
    const review = await Review.findOne({ _id: id, reviewer: userId });
    if (!review) {
        throw createError("Review not found or access denied", 404);
    }

    // Update review
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    // Update sentiment based on new rating
    if (rating) {
        if (rating >= 4) review.sentiment = "positive";
        else if (rating <= 2) review.sentiment = "negative";
        else review.sentiment = "neutral";
    }

    await review.save();

    // Populate related data
    await review.populate([
        { path: "reviewer", select: "email" },
        { path: "reviewee", select: "email" },
        { path: "job", select: "title" },
    ]);

    res.json({
        success: true,
        message: "Review updated successfully",
        data: review,
    });
});

export const deleteReview = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user._id;
    const { id } = req.params;

    // Find review and verify ownership
    const review = await Review.findOne({ _id: id, reviewer: userId });
    if (!review) {
        throw createError("Review not found or access denied", 404);
    }

    await Review.findByIdAndDelete(id);

    res.json({
        success: true,
        message: "Review deleted successfully",
    });
});

export const getUserReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const { page = 1, limit = 10, type = "received" } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const filter: any = {};

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        throw createError("User not found", 404);
    }

    // Filter by review type
    if (type === "received") {
        filter.reviewee = userId;
    } else if (type === "given") {
        filter.reviewer = userId;
    }

    const reviews = await Review.find(filter)
        .populate("reviewer", "email")
        .populate("reviewee", "email")
        .populate("job", "title")
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await Review.countDocuments(filter);

    // Calculate average rating for received reviews
    let averageRating = 0;
    if (type === "received") {
        const ratings = await Review.find({ reviewee: userId }).select("rating");
        if (ratings.length > 0) {
            averageRating = ratings.reduce((sum, review) => sum + (review.rating || 0), 0) / ratings.length;
        }
    }

    res.json({
        success: true,
        data: {
            reviews,
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: total,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        },
    });
});
