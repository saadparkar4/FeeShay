import { Request, Response } from "express";
import { User, FreelancerProfile, ClientProfile } from "../models";
import { createError, asyncHandler } from "../middlewares/errorHandler";

interface AuthRequest extends Request {
    user?: any;
}

// Get all users except the current user
export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const currentUserId = req.user._id;
    const { search, role, page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build base query
    let query: any = {
        _id: { $ne: currentUserId }, // Exclude current user
        is_active: true,
    };

    if (role && (role === 'freelancer' || role === 'client')) {
        query.role = role;
    }

    // If search exists, we need to find matching users first
    let matchingUserIds: string[] = [];
    if (search) {
        const searchRegex = new RegExp(search.toString(), 'i');
        
        // Search in emails
        const emailMatches = await User.find({
            ...query,
            email: searchRegex
        }).select('_id');
        
        // Search in freelancer profiles
        const freelancerProfileMatches = await FreelancerProfile.find({
            name: searchRegex
        }).select('user');
        
        // Search in client profiles
        const clientProfileMatches = await ClientProfile.find({
            name: searchRegex
        }).select('user');
        
        // Combine all matching user IDs
        const allMatchIds = [
            ...emailMatches.map(u => u._id.toString()),
            ...freelancerProfileMatches.map(p => p.user.toString()),
            ...clientProfileMatches.map(p => p.user.toString())
        ];
        
        // Remove duplicates and filter by base query
        matchingUserIds = [...new Set(allMatchIds)];
        
        // Update query to only include matching users
        if (matchingUserIds.length > 0) {
            query._id = { 
                $in: matchingUserIds.map(id => id),
                $ne: currentUserId 
            };
        } else {
            // No matches found, return empty result
             res.json({
                success: true,
                data: {
                    users: [],
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total: 0,
                        pages: 0,
                    },
                },
            });
        }
    }

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Get paginated users
    const users = await User.find(query)
        .select('email role created_at')
        .skip(skip)
        .limit(Number(limit))
        .sort({ created_at: -1 });

    // Get profiles for each user
    const usersWithProfiles = await Promise.all(
        users.map(async (user) => {
            let profile;
            if (user.role === "freelancer") {
                profile = await FreelancerProfile.findOne({ user: user._id })
                    .select('name bio location profile_image_url skills');
            } else {
                profile = await ClientProfile.findOne({ user: user._id })
                    .select('name bio location profile_image_url');
            }

            return {
                ...user.toObject(),
                profile,
            };
        })
    );

    res.json({
        success: true,
        data: {
            users: usersWithProfiles,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        },
    });
});

// Get user by ID
export const getUserById = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { userId } = req.params;

    const user = await User.findById(userId).select('email role created_at');
    if (!user) {
        throw createError("User not found", 404);
    }

    let profile;
    if (user.role === "freelancer") {
        profile = await FreelancerProfile.findOne({ user: userId });
    } else {
        profile = await ClientProfile.findOne({ user: userId });
    }

    res.json({
        success: true,
        data: {
            ...user.toObject(),
            profile,
        },
    });
});