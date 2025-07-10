/**
 * Jobs Routes
 * 
 * API routes for job operations
 */

import { Router } from 'express';
import {
  getJobs,
  getJobById,
} from '../controllers/jobsController';

const router = Router();

/**
 * Public routes
 */
// Get all jobs with filtering
router.get('/', getJobs);

// Get single job by ID
router.get('/:id', getJobById);

export default router;