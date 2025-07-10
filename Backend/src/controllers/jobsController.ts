/**
 * Jobs Controller
 * 
 * Handles all job-related operations
 * Including fetching jobs and job details
 */

import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import Job from '../models/Job';

/**
 * Get all jobs with optional filtering
 * 
 * @route   GET /api/v1/jobs
 * @access  Public
 * @query   {string} category - Filter by category
 * @query   {string} search - Search by title or description
 * @query   {string} status - Filter by status (open, in_progress, etc.)
 * @query   {number} minBudget - Minimum budget
 * @query   {number} maxBudget - Maximum budget
 * @query   {number} page - Page number for pagination
 * @query   {number} limit - Items per page
 */
export const getJobs = asyncHandler(async (req: Request, res: Response) => {
  const {
    category,
    search,
    status = 'open',
    minBudget,
    maxBudget,
    page = 1,
    limit = 10,
  } = req.query;

  // Build query
  const query: any = {};

  // Status filter (default to open jobs)
  if (status) {
    query.status = status;
  }

  // Category filter
  if (category && category !== 'All Categories') {
    query.category = category;
  }

  // Search filter (title or description)
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Budget range filter
  if (minBudget || maxBudget) {
    query.budget = {};
    if (minBudget) query.budget.$gte = Number(minBudget);
    if (maxBudget) query.budget.$lte = Number(maxBudget);
  }

  // Execute query with pagination
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const jobs = await Job.find(query)
    .select('-__v')
    .sort({ postedDate: -1 }) // Most recent first
    .limit(limitNum)
    .skip(skip);

  // Get total count for pagination
  const totalCount = await Job.countDocuments(query);

  // Transform data to match frontend expectations
  const transformedJobs = jobs.map(job => ({
    id: job._id,
    title: job.title,
    description: job.description,
    image: job.image || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/default-job-image.png',
    sellerAvatar: job.client.avatar,
    sellerName: job.client.name,
    rating: job.client.rating,
    ratingCount: job.client.reviewCount,
    category: job.category,
    price: job.budget,
    duration: job.duration,
    skills: job.skills,
    experienceLevel: job.experienceLevel,
    projectType: job.projectType,
    proposals: job.proposals,
    postedDate: job.postedDate,
    client: job.client,
  }));

  res.status(200).json({
    success: true,
    data: {
      jobs: transformedJobs,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount,
        itemsPerPage: limitNum,
      },
    },
  });
});

/**
 * Get single job by ID
 * 
 * @route   GET /api/v1/jobs/:id
 * @access  Public
 */
export const getJobById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const job = await Job.findById(id).select('-__v');

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Transform data
  const transformedJob = {
    id: job._id,
    title: job.title,
    description: job.description,
    image: job.image || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/default-job-image.png',
    sellerAvatar: job.client.avatar,
    sellerName: job.client.name,
    rating: job.client.rating,
    ratingCount: job.client.reviewCount,
    category: job.category,
    price: job.budget,
    duration: job.duration,
    skills: job.skills,
    experienceLevel: job.experienceLevel,
    projectType: job.projectType,
    proposals: job.proposals,
    postedDate: job.postedDate,
    client: job.client,
    attachments: job.attachments,
  };

  res.status(200).json({
    success: true,
    data: transformedJob,
  });
});