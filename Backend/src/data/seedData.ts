/**
 * Seed Data for FeeShay Platform
 * 
 * This file contains initial data for populating the database
 * Used for development, testing, and new deployments
 * 
 * Run with: npm run seed (add this script to package.json)
 */

export const talentsSeedData = [
  {
    name: 'Alex Johnsonnnn',
    email: 'alex.johnson@example.com',
    password: 'password123', // Will be hashed during seeding
    role: 'freelancer',
    profile: {
      title: 'Logo & Brand Designer',
      bio: 'Creative designer with 5+ years of experience in brand identity and logo design. Passionate about creating memorable visual identities.',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
      location: 'New York, US',
      skills: ['Logo Design', 'Branding', 'Illustration'],
      hourlyRate: 75,
      category: 'Graphic Designing',
      rating: 4.8,
      reviewCount: 156,
      completedProjects: 89,
      responseTime: '1 hour',
      languages: ['English', 'Spanish'],
    }
  },
  {
    name: 'Sophia Lee',
    email: 'sophia.lee@example.com', 
    password: 'password123',
    role: 'freelancer',
    profile: {
      title: 'Full-Stack Developer',
      bio: 'Experienced full-stack developer specializing in modern web applications. Expert in React, Node.js, and cloud technologies.',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
      location: 'San Francisco, US',
      skills: ['React', 'Node.js', 'MongoDB'],
      hourlyRate: 120,
      category: 'Web Development',
      rating: 4.9,
      reviewCount: 203,
      completedProjects: 147,
      responseTime: '2 hours',
      languages: ['English'],
    }
  },
  {
    name: 'Marcus Chen',
    email: 'marcus.chen@example.com',
    password: 'password123',
    role: 'freelancer',
    profile: {
      title: 'Digital Marketing Expert',
      bio: 'Results-driven digital marketing specialist with expertise in SEO, social media marketing, and analytics.',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg',
      location: 'Austin, US',
      skills: ['SEO', 'Social Media', 'Analytics'],
      hourlyRate: 55,
      category: 'Digital Marketing',
      rating: 4.6,
      reviewCount: 89,
      completedProjects: 56,
      responseTime: '30 minutes',
      languages: ['English', 'Mandarin'],
    }
  },
  {
    name: 'Isabella Martinez',
    email: 'isabella.martinez@example.com',
    password: 'password123',
    role: 'freelancer',
    profile: {
      title: 'Video Editor & Motion Designer',
      bio: 'Creative video editor with a passion for storytelling. Specialized in motion graphics and post-production.',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg',
      location: 'Los Angeles, US',
      skills: ['Video Editing', 'After Effects', 'Animation'],
      hourlyRate: 85,
      category: 'Video Editing',
      rating: 4.7,
      reviewCount: 112,
      completedProjects: 78,
      responseTime: '3 hours',
      languages: ['English', 'Spanish'],
    }
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    password: 'password123',
    role: 'freelancer',
    profile: {
      title: 'UI/UX Designer',
      bio: 'User-focused designer creating intuitive and beautiful digital experiences. Expert in user research and interface design.',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
      location: 'Chicago, US',
      skills: ['UI Design', 'User Research', 'Prototyping'],
      hourlyRate: 95,
      category: 'UI/UX Design',
      rating: 4.9,
      reviewCount: 178,
      completedProjects: 124,
      responseTime: '1 hour',
      languages: ['English'],
    }
  }
];

export const jobsSeedData = [
  {
    title: 'Complete Brand Identity Design',
    description: 'Looking for a talented designer to create a complete brand identity for our new startup including logo, color palette, typography, and brand guidelines.',
    budget: 2500,
    duration: '2-3 weeks',
    category: 'Design',
    skills: ['Logo Design', 'Branding', 'Adobe Creative Suite'],
    experienceLevel: 'Intermediate',
    projectType: 'Fixed Price',
    attachments: [],
    proposals: 0,
    status: 'open',
    visibility: 'public',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/8decf4170a-1220338dc9ccd47cd233.png',
    client: {
      name: 'TechStart Inc.',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
      rating: 4.8,
      reviewCount: 23,
      location: 'New York, US',
      memberSince: new Date('2023-01-15'),
      verified: true,
    }
  },
  {
    title: 'E-commerce Website Development',
    description: 'Need a full-stack developer to build a modern e-commerce website with payment integration, inventory management, and responsive design.',
    budget: 5000,
    duration: '1-2 months',
    category: 'Tech',
    skills: ['React', 'Node.js', 'MongoDB', 'Payment Integration'],
    experienceLevel: 'Expert',
    projectType: 'Fixed Price',
    attachments: [],
    proposals: 5,
    status: 'open',
    visibility: 'public',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/90efecceec-ee1c74c722b3034a37ef.png',
    client: {
      name: 'Fashion Forward LLC',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
      rating: 4.7,
      reviewCount: 45,
      location: 'Los Angeles, US',
      memberSince: new Date('2022-06-20'),
      verified: true,
    }
  },
  {
    title: 'Blog Content Writing - Tech Topics',
    description: 'Seeking experienced content writer for ongoing blog posts about technology, AI, and software development. 2-3 articles per week.',
    budget: 150,
    duration: 'Ongoing',
    category: 'Writing',
    skills: ['Content Writing', 'SEO', 'Technical Writing'],
    experienceLevel: 'Intermediate',
    projectType: 'Hourly',
    hourlyRate: 50,
    attachments: [],
    proposals: 12,
    status: 'open',
    visibility: 'public',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/cffe96cd84-0fbdac65050f7a36822a.png',
    client: {
      name: 'Digital Insights Media',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg',
      rating: 4.9,
      reviewCount: 67,
      location: 'San Francisco, US',
      memberSince: new Date('2021-11-10'),
      verified: true,
    }
  },
  {
    title: 'Social Media Marketing Campaign',
    description: 'Looking for a digital marketing expert to manage and grow our social media presence across multiple platforms.',
    budget: 3000,
    duration: '3 months',
    category: 'Marketing',
    skills: ['Social Media Marketing', 'Content Creation', 'Analytics'],
    experienceLevel: 'Expert',
    projectType: 'Fixed Price',
    attachments: [],
    proposals: 8,
    status: 'open',
    visibility: 'public',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e0a6a91e79-f96ba8bed979dd12d83a.png',
    client: {
      name: 'Wellness Brands Co.',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg',
      rating: 4.6,
      reviewCount: 34,
      location: 'Austin, US',
      memberSince: new Date('2023-03-22'),
      verified: true,
    }
  },
  {
    title: 'Promotional Video Editing',
    description: 'Need a skilled video editor to create a 2-3 minute promotional video for our product launch. Raw footage will be provided.',
    budget: 800,
    duration: '1 week',
    category: 'Video Editing',
    skills: ['Video Editing', 'Color Grading', 'Motion Graphics'],
    experienceLevel: 'Intermediate',
    projectType: 'Fixed Price',
    attachments: [],
    proposals: 15,
    status: 'open',
    visibility: 'public',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/3c9621a5e6-4dc3e3ea3625a58786c3.png',
    client: {
      name: 'Innovation Labs',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
      rating: 4.8,
      reviewCount: 56,
      location: 'Seattle, US',
      memberSince: new Date('2022-09-14'),
      verified: true,
    }
  }
];

// Categories that match the frontend
export const categoriesSeedData = [
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