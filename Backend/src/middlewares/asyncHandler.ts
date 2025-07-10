/**
 * Async Handler Middleware
 * 
 * Wraps async route handlers to catch errors automatically
 * Eliminates the need for try-catch blocks in every route
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Higher-order function that wraps async route handlers
 * @param fn Async route handler function
 * @returns Wrapped function that catches errors
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};