import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcrypt';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
import { User } from '../src/models';

async function checkAndFixUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/feeshay');
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    // Check each user
    for (const user of users) {
      console.log(`\nUser: ${user.email}`);
      console.log(`- Has password_hash: ${!!user.password_hash}`);
      console.log(`- Role: ${user.role}`);
      
      // If user doesn't have a password, create a temporary one
      if (!user.password_hash) {
        console.log('⚠️  User missing password! Creating temporary password...');
        
        // Create a temporary password
        const tempPassword = 'TempPass123!';
        const saltRounds = 12;
        const password_hash = await bcrypt.hash(tempPassword, saltRounds);
        
        // Update user
        user.password_hash = password_hash;
        await user.save();
        
        console.log(`✅ Updated user ${user.email} with temporary password: ${tempPassword}`);
        console.log('   Please ask the user to change their password immediately!');
      }
    }

    console.log('\nUser check complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
}

checkAndFixUsers();