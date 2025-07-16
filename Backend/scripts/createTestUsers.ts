import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcrypt';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
import { User, FreelancerProfile, ClientProfile } from '../src/models';

const testUsers = [
  {
    email: 'testclient@feeshay.com',
    password: 'TestPass123!',
    role: 'client',
    name: 'Test Client'
  },
  {
    email: 'testfreelancer@feeshay.com',
    password: 'TestPass123!',
    role: 'freelancer',
    name: 'Test Freelancer'
  }
];

async function createTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/feeshay');
    console.log('Connected to MongoDB');

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`User ${userData.email} already exists`);
        continue;
      }

      // Hash password
      const saltRounds = 12;
      const password_hash = await bcrypt.hash(userData.password, saltRounds);

      // Create user
      const user = await User.create({
        email: userData.email,
        password_hash,
        role: userData.role,
        created_at: new Date(),
      });

      // Create profile based on role
      if (userData.role === 'freelancer') {
        await FreelancerProfile.create({
          user: user._id,
          name: userData.name,
          member_since: new Date(),
          skills: ['JavaScript', 'React', 'Node.js'],
          location: 'Remote',
        });
      } else {
        await ClientProfile.create({
          user: user._id,
          name: userData.name,
          client_since: new Date(),
          location: 'USA',
        });
      }

      console.log(`\n✅ Created user:`);
      console.log(`- Email: ${userData.email}`);
      console.log(`- Password: ${userData.password}`);
      console.log(`- Role: ${userData.role}`);
    }

    console.log('\nTest users created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test users:', error);
    process.exit(1);
  }
}

createTestUsers();