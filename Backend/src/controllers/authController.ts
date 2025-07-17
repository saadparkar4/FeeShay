import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, FreelancerProfile, ClientProfile } from "../models";
import { createError, asyncHandler } from "../middlewares/errorHandler";

interface AuthRequest extends Request {
    user?: any;
}

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password, role, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw createError("User already exists", 400);
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
        email,
        password_hash,
        role,
        created_at: new Date(),
    });

    // Create profile based on role
    if (role === "freelancer") {
        await FreelancerProfile.create({
            user: user._id,
            name,
            member_since: new Date(),
        });
    } else {
        await ClientProfile.create({
            user: user._id,
            name,
            client_since: new Date(),
        });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || "fallback-secret", {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    } as jwt.SignOptions);

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
            },
            token,
        },
    });
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
        throw createError("Invalid credentials", 401);
    }

    // Debug log
    console.log("User found:", { email: user.email, hasPassword: !!user.password_hash });
    
    // Check if password_hash exists
    if (!user.password_hash) {
        throw createError("User account is corrupted. Please contact support.", 500);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        throw createError("Invalid credentials", 401);
    }

    // Update last login
    user.last_login = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || "fallback-secret", {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    } as jwt.SignOptions);

    res.json({
        success: true,
        message: "Login successful",
        data: {
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                last_login: user.last_login,
            },
            token,
        },
    });
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password_hash");
    if (!user) {
        throw createError("User not found", 404);
    }

    // Get profile based on role
    let profile;
    if (user.role === "freelancer") {
        profile = await FreelancerProfile.findOne({ user: userId });
    } else {
        profile = await ClientProfile.findOne({ user: userId });
    }

    res.json({
        success: true,
        data: {
            user,
            profile,
        },
    });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user._id;
    const updateData = req.body;

    const user = await User.findById(userId);
    if (!user) {
        throw createError("User not found", 404);
    }

    // Update user preferences
    if (updateData.dark_mode !== undefined) {
        user.dark_mode = updateData.dark_mode;
    }

    await user.save();

    // Update profile based on role
    let profile;
    if (user.role === "freelancer") {
        profile = await FreelancerProfile.findOneAndUpdate({ user: userId }, { $set: updateData }, { new: true, runValidators: true });
    } else {
        profile = await ClientProfile.findOneAndUpdate({ user: userId }, { $set: updateData }, { new: true, runValidators: true });
    }

    res.json({
        success: true,
        message: "Profile updated successfully",
        data: {
            user,
            profile,
        },
    });
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        throw createError("User not found", 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
        throw createError("Current password is incorrect", 400);
    }

    // Hash new password
    const saltRounds = 12;
    user.password_hash = await bcrypt.hash(newPassword, saltRounds);
    await user.save();

    res.json({
        success: true,
        message: "Password changed successfully",
    });
});

export const switchRole = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user._id;
    const { newRole } = req.body;

    // Validate new role
    if (!["freelancer", "client"].includes(newRole)) {
        throw createError("Invalid role. Must be 'freelancer' or 'client'", 400);
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
        throw createError("User not found", 404);
    }

    // Check if user is already in the requested role
    if (user.role === newRole) {
        throw createError(`You are already a ${newRole}`, 400);
    }

    // Update user role
    user.role = newRole;
    await user.save();

    // Check if profile exists for new role, create if not
    if (newRole === "freelancer") {
        const existingProfile = await FreelancerProfile.findOne({ user: userId });
        if (!existingProfile) {
            await FreelancerProfile.create({
                user: userId,
                name: user.email.split('@')[0], // Default name from email
                member_since: new Date(),
            });
        }
    } else {
        const existingProfile = await ClientProfile.findOne({ user: userId });
        if (!existingProfile) {
            await ClientProfile.create({
                user: userId,
                name: user.email.split('@')[0], // Default name from email
                client_since: new Date(),
            });
        }
    }

    // Generate new JWT token with updated role
    const token = jwt.sign({ userId: user._id, email: user.email, role: newRole }, process.env.JWT_SECRET || "fallback-secret", {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    } as jwt.SignOptions);

    res.json({
        success: true,
        message: `Successfully switched to ${newRole} role`,
        data: {
            user: {
                id: user._id,
                email: user.email,
                role: newRole,
            },
            token,
        },
    });
});
