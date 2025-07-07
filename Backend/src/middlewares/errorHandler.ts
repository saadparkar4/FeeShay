import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

export const createError = (message: string, statusCode: number = 500): AppError => {
    const error = new Error(message) as AppError;
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
};

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
    let { statusCode = 500, message } = err;

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation Error";
    }

    // Mongoose duplicate key error
    if (err.name === "MongoError" && (err as any).code === 11000) {
        statusCode = 400;
        message = "Duplicate field value";
    }

    // Mongoose cast error
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }

    // Log error in development
    if (process.env.NODE_ENV === "development") {
        console.error("Error:", err);
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
    const error = createError(`Route ${req.originalUrl} not found`, 404);
    next(error);
};

export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
