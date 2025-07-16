import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
import { User, ClientProfile, FreelancerProfile } from '../src/models';

async function fixClientProfiles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/feeshay');
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      console.log(`\nChecking user: ${user.email} (${user.role})`);

      if (user.role === 'client') {
        // Check if client profile exists
        const clientProfile = await ClientProfile.findOne({ user: user._id });
        
        if (!clientProfile) {
          console.log('⚠️  Missing client profile! Creating...');
          
          // Create client profile
          const newProfile = await ClientProfile.create({
            user: user._id,
            name: user.email.split('@')[0], // Use email prefix as name
            client_since: user.created_at || new Date(),
            location: 'Not specified',
            onboarding_complete: false,
          });
          
          console.log('✅ Created client profile:', newProfile._id);
        } else {
          console.log('✓ Client profile exists:', clientProfile._id);
        }
      } else if (user.role === 'freelancer') {
        // Check if freelancer profile exists
        const freelancerProfile = await FreelancerProfile.findOne({ user: user._id });
        
        if (!freelancerProfile) {
          console.log('⚠️  Missing freelancer profile! Creating...');
          
          // Create freelancer profile
          const newProfile = await FreelancerProfile.create({
            user: user._id,
            name: user.email.split('@')[0], // Use email prefix as name
            member_since: user.created_at || new Date(),
            location: 'Not specified',
            skills: [],
            onboarding_complete: false,
          });
          
          console.log('✅ Created freelancer profile:', newProfile._id);
        } else {
          console.log('✓ Freelancer profile exists:', freelancerProfile._id);
        }
      }
    }

    // Summary
    console.log('\n=== Summary ===');
    const clientCount = await ClientProfile.countDocuments();
    const freelancerCount = await FreelancerProfile.countDocuments();
    console.log(`Total client profiles: ${clientCount}`);
    console.log(`Total freelancer profiles: ${freelancerCount}`);

    console.log('\nProfile fix complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing profiles:', error);
    process.exit(1);
  }
}

fixClientProfiles();