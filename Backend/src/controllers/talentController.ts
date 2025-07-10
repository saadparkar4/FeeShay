/**
 * Talent Controller
 * 
 * Handles all talent (freelancer) related operations
 * Including fetching talents, filtering, and talent profiles
 */

import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import User from '../models/User';

/**
 * Get all talents with optional filtering
 * 
 * @route   GET /api/v1/talents
 * @access  Public
 * @query   {string} category - Filter by category
 * @query   {string} search - Search by name or title
 * @query   {number} minPrice - Minimum hourly rate
 * @query   {number} maxPrice - Maximum hourly rate
 * @query   {string} skills - Comma-separated skills
 * @query   {number} page - Page number for pagination
 * @query   {number} limit - Items per page
 */
export const getTalents = asyncHandler(async (req: Request, res: Response) => {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    skills,
    page = 1,
    limit = 10,
  } = req.query;

  // Build query
  const query: any = { role: 'freelancer' };

  // Category filter
  if (category && category !== 'All Categories') {
    query['profile.category'] = category;
  }

  // Search filter (name or title)
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { 'profile.title': { $regex: search, $options: 'i' } },
    ];
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query['profile.hourlyRate'] = {};
    if (minPrice) query['profile.hourlyRate'].$gte = Number(minPrice);
    if (maxPrice) query['profile.hourlyRate'].$lte = Number(maxPrice);
  }

  // Skills filter
  if (skills) {
    const skillsArray = (skills as string).split(',').map(s => s.trim());
    query['profile.skills'] = { $in: skillsArray };
  }

  // Execute query with pagination
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const talents = await User.find(query)
    .select('-password -__v')
    .sort({ 'profile.rating': -1, 'profile.reviewCount': -1 }) // Sort by rating and review count
    .limit(limitNum)
    .skip(skip);

  // Get total count for pagination
  const totalCount = await User.countDocuments(query);

  // Transform data to match frontend expectations
  const transformedTalents = talents.map(talent => ({
    id: talent._id,
    name: talent.name,
    email: talent.email,
    title: talent.profile?.title || '',
    avatar: talent.profile?.avatar || '',
    location: talent.profile?.location || '',
    skills: talent.profile?.skills || [],
    rating: talent.profile?.rating || 0,
    reviewCount: talent.profile?.reviewCount || 0,
    price: talent.profile?.hourlyRate || 0,
    category: talent.profile?.category || '',
    bio: talent.profile?.bio || '',
    responseTime: talent.profile?.responseTime || '',
    languages: talent.profile?.languages || [],
    completedProjects: talent.profile?.completedProjects || 0,
  }));

  res.status(200).json({
    success: true,
    data: {
      talents: transformedTalents,
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
 * Get single talent by ID
 * 
 * @route   GET /api/v1/talents/:id
 * @access  Public
 */
export const getTalentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const talent = await User.findById(id)
    .select('-password -__v')
    .where('role').equals('freelancer');

  if (!talent) {
    res.status(404);
    throw new Error('Talent not found');
  }

  // Transform data
  const transformedTalent = {
    id: talent._id,
    name: talent.name,
    email: talent.email,
    title: talent.profile?.title || '',
    avatar: talent.profile?.avatar || '',
    location: talent.profile?.location || '',
    skills: talent.profile?.skills || [],
    rating: talent.profile?.rating || 0,
    reviewCount: talent.profile?.reviewCount || 0,
    price: talent.profile?.hourlyRate || 0,
    category: talent.profile?.category || '',
    bio: talent.profile?.bio || '',
    responseTime: talent.profile?.responseTime || '',
    languages: talent.profile?.languages || [],
    completedProjects: talent.profile?.completedProjects || 0,
    memberSince: talent.createdAt,
  };

  res.status(200).json({
    success: true,
    data: transformedTalent,
  });
});

/**
 * Get talent categories
 * 
 * @route   GET /api/v1/talents/categories
 * @access  Public
 */
export const getTalentCategories = asyncHandler(async (req: Request, res: Response) => {
  // For now, return static categories
  // TODO: Make this dynamic based on actual talent categories in database
  const categories = [
    { name: 'All Categories', icon: 'apps-outline' },
    { name: 'Graphic Designing', icon: 'color-palette-outline' },
    { name: 'Web Development', icon: 'code-slash-outline' },
    { name: 'UI/UX Design', icon: 'phone-portrait-outline' },
    { name: 'Digital Marketing', icon: 'megaphone-outline' },
    { name: 'Content Writing', icon: 'document-text-outline' },
    { name: 'Video Editing', icon: 'videocam-outline' },
    { name: 'Photography', icon: 'camera-outline' },
    { name: 'Animation', icon: 'film-outline' },
    { name: 'Music Production', icon: 'musical-notes-outline' },
  ];

  res.status(200).json({
    success: true,
    data: categories,
  });
});