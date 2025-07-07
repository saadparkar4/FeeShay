import multer from "multer";
import path from "path";
import { Request } from "express";

// Configure storage
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, "uploads/");
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allow images only
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"));
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
        files: 1, // Only one file at a time
    },
});

// Export different upload configurations
export const uploadProfileImage = upload.single("profile_image");
export const uploadPortfolioImage = upload.single("portfolio_image");
export const uploadServiceImage = upload.single("service_image");

// Error handling middleware for multer
export const handleUploadError = (err: any, req: Request, res: any, next: any) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "File too large. Maximum size is 5MB",
            });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                success: false,
                message: "Too many files. Only one file allowed",
            });
        }
    }

    if (err.message === "Only image files are allowed!") {
        return res.status(400).json({
            success: false,
            message: "Only image files are allowed",
        });
    }

    next(err);
};
