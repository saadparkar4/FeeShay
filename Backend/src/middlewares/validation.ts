import { Request, Response, NextFunction } from "express";
import { body, param, query, validationResult } from "express-validator";

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            message: "Validation failed",
            errors: errors.array(),
        });
        return;
    }
    next();
};

// User validation rules
export const validateUserRegistration = [
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").isIn(["freelancer", "client"]).withMessage("Role must be freelancer or client"),
    handleValidationErrors,
];

export const validateUserLogin = [
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    handleValidationErrors,
];

// Profile validation rules
export const validateProfileUpdate = [
    body("name").optional().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("bio").optional().isLength({ max: 500 }).withMessage("Bio must be less than 500 characters"),
    body("location").optional().isLength({ max: 100 }).withMessage("Location must be less than 100 characters"),
    body("languages").optional().isArray().withMessage("Languages must be an array"),
    body("skills").optional().isArray().withMessage("Skills must be an array"),
    handleValidationErrors,
];

// Job validation rules
export const validateJobCreation = [
    body("title").isLength({ min: 5, max: 100 }).withMessage("Title must be between 5 and 100 characters"),
    body("description").isLength({ min: 10, max: 2000 }).withMessage("Description must be between 10 and 2000 characters"),
    body("category").optional().isMongoId().withMessage("Valid category ID is required"),
    body("budget_min").optional().isNumeric().withMessage("Budget min must be a number"),
    body("budget_max").optional().isNumeric().withMessage("Budget max must be a number"),
    body("is_internship").optional().isBoolean().withMessage("Internship flag must be boolean"),
    handleValidationErrors,
];

export const validateJobUpdate = [
    body("title").optional().isLength({ min: 5, max: 100 }).withMessage("Title must be between 5 and 100 characters"),
    body("description").optional().isLength({ min: 10, max: 2000 }).withMessage("Description must be between 10 and 2000 characters"),
    body("status").optional().isIn(["open", "in_progress", "completed", "cancelled"]).withMessage("Invalid status"),
    handleValidationErrors,
];

// Service validation rules
export const validateServiceCreation = [
    body("title").isLength({ min: 5, max: 100 }).withMessage("Title must be between 5 and 100 characters"),
    body("description").isLength({ min: 10, max: 2000 }).withMessage("Description must be between 10 and 2000 characters"),
    body("category").optional().isMongoId().withMessage("Valid category ID is required"),
    body("price").optional().isNumeric().withMessage("Price must be a number"),
    body("delivery_time_days").optional().isInt({ min: 1 }).withMessage("Delivery time must be a positive integer"),
    handleValidationErrors,
];

// Proposal validation rules
export const validateProposalCreation = [
    body("job").isMongoId().withMessage("Valid job ID is required"),
    body("cover_letter").isLength({ min: 10, max: 2000 }).withMessage("Cover letter must be between 10 and 2000 characters"),
    body("proposed_price").isNumeric().withMessage("Proposed price must be a number"),
    handleValidationErrors,
];

// Message validation rules
export const validateMessageCreation = [
    body("chat").isMongoId().withMessage("Valid chat ID is required"),
    body("content").isLength({ min: 1, max: 1000 }).withMessage("Message content must be between 1 and 1000 characters"),
    handleValidationErrors,
];

// Review validation rules
export const validateReviewCreation = [
    body("reviewee").isMongoId().withMessage("Valid reviewee ID is required"),
    body("job").optional().isMongoId().withMessage("Valid job ID is required"),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
    body("comment").optional().isLength({ max: 500 }).withMessage("Comment must be less than 500 characters"),
    handleValidationErrors,
];

// ID validation
export const validateMongoId = [param("id").isMongoId().withMessage("Valid ID is required"), handleValidationErrors];

// Pagination validation
export const validatePagination = [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    handleValidationErrors,
];
