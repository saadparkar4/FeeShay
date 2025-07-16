import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
import { Category } from '../src/models';

const categories = [
  { name: 'Tech & Development', description: 'Software development, web development, mobile apps, etc.' },
  { name: 'Design & Creative', description: 'Graphic design, UI/UX, branding, illustrations, etc.' },
  { name: 'Writing & Content', description: 'Content writing, copywriting, blogging, technical writing, etc.' },
  { name: 'Marketing', description: 'Digital marketing, SEO, social media, advertising, etc.' },
  { name: 'Business', description: 'Business consulting, finance, accounting, legal, etc.' },
  { name: 'Other', description: 'Other services and projects' },
];

async function seedCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/feeshay');
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert new categories
    const insertedCategories = await Category.insertMany(categories);
    console.log(`Inserted ${insertedCategories.length} categories`);

    // Display inserted categories
    console.log('\nInserted categories:');
    insertedCategories.forEach(cat => {
      console.log(`- ${cat.name} (ID: ${cat._id})`);
    });

    console.log('\nCategories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();