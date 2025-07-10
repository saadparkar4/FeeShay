/**
 * Database Seeding Script
 * 
 * Populates the database with initial data for development and testing
 * Run with: npm run seed
 * 
 * @requires MongoDB connection
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';
import Job from '../models/Job';
import { talentsSeedData, jobsSeedData, categoriesSeedData } from '../data/seedData';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL as string);
    console.log('✅ MongoDB connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

/**
 * Hash password for user creation
 */
const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Seed talents (freelancers) into the database
 */
const seedTalents = async () => {
  console.log('🌱 Seeding talents...');
  
  try {
    // Clear existing freelancers
    await User.deleteMany({ role: 'freelancer' });
    
    // Create new freelancers
    for (const talentData of talentsSeedData) {
      const hashedPassword = await hashPassword(talentData.password);
      
      const talent = new User({
        name: talentData.name,
        email: talentData.email,
        password: hashedPassword,
        role: talentData.role,
        profile: talentData.profile,
        isVerified: true,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
      });
      
      await talent.save();
      console.log(`  ✓ Created talent: ${talent.name}`);
    }
    
    console.log(`✅ Successfully seeded ${talentsSeedData.length} talents`);
  } catch (error) {
    console.error('❌ Error seeding talents:', error);
    throw error;
  }
};

/**
 * Seed jobs (projects) into the database
 */
const seedJobs = async () => {
  console.log('🌱 Seeding jobs...');
  
  try {
    // Clear existing jobs
    await Job.deleteMany({});
    
    // Create new jobs
    for (const jobData of jobsSeedData) {
      const job = new Job({
        ...jobData,
        postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
      
      await job.save();
      console.log(`  ✓ Created job: ${job.title}`);
    }
    
    console.log(`✅ Successfully seeded ${jobsSeedData.length} jobs`);
  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
    throw error;
  }
};

/**
 * Seed categories into the database
 * Note: This requires a Category model to be created
 */
const seedCategories = async () => {
  console.log('🌱 Seeding categories...');
  
  try {
    // TODO: Implement category seeding once Category model is created
    console.log('⚠️  Category model not yet implemented. Skipping category seeding.');
    
    // Uncomment and implement when Category model is ready:
    /*
    await Category.deleteMany({});
    
    for (const categoryData of categoriesSeedData) {
      const category = new Category(categoryData);
      await category.save();
      console.log(`  ✓ Created category: ${category.name}`);
    }
    
    console.log(`✅ Successfully seeded ${categoriesSeedData.length} categories`);
    */
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
};

/**
 * Main seeding function
 */
const seedDatabase = async () => {
  try {
    console.log('🚀 Starting database seeding...\n');
    
    // Connect to database
    await connectDB();
    
    // Run seeders
    await seedTalents();
    await seedJobs();
    await seedCategories();
    
    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();