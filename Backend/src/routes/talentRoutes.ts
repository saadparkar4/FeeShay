/**
 * Talent Routes
 * 
 * API routes for talent (freelancer) operations
 */

import { Router } from 'express';
import {
  getTalents,
  getTalentById,
  getTalentCategories,
} from '../controllers/talentController';

const router = Router();

/**
 * Public routes
 */
// Get talent categories
router.get('/categories', getTalentCategories);

// Get all talents with filtering
router.get('/', getTalents);

// Get single talent by ID
router.get('/:id', getTalentById);

export default router;