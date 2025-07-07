import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

import { User, FreelancerProfile, ClientProfile, Category, Job, Service, Proposal, Chat, Message, Review, Portfolio, AIIntegration, Notification } from "../src/models";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || process.env.DB_URL;
        if (!uri) {
            throw new Error("Database URI not found in environment variables");
        }
        await mongoose.connect(uri);
        console.log("✅ Connected to MongoDB");
    } catch (error: any) {
        console.error("❌ Database connection failed:", error.message);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        console.log("🌱 Starting database seeding...");

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            FreelancerProfile.deleteMany({}),
            ClientProfile.deleteMany({}),
            Category.deleteMany({}),
            Job.deleteMany({}),
            Service.deleteMany({}),
            Proposal.deleteMany({}),
            Chat.deleteMany({}),
            Message.deleteMany({}),
            Review.deleteMany({}),
            Portfolio.deleteMany({}),
            AIIntegration.deleteMany({}),
            Notification.deleteMany({}),
        ]);
        console.log("🗑️  Cleared existing data");

        // Create categories
        const categories = await Category.insertMany([
            { name: "Web Development", description: "Frontend and backend development services" },
            { name: "Graphic Design", description: "Logo design, branding, and visual content" },
            { name: "Content Writing", description: "Blog posts, articles, and copywriting" },
            { name: "Digital Marketing", description: "SEO, social media, and marketing services" },
            { name: "Mobile Development", description: "iOS and Android app development" },
            { name: "Data Analysis", description: "Data processing and analytics services" },
        ]);
        console.log("📂 Created categories");

        // Create users with hashed passwords
        const hashedPassword = await bcrypt.hash("password123", 10);

        const users = await User.insertMany([
            {
                email: "sarah.johnson@example.com",
                password_hash: hashedPassword,
                role: "freelancer",
                dark_mode: false,
                is_active: true,
            },
            {
                email: "michael.chen@example.com",
                password_hash: hashedPassword,
                role: "client",
                dark_mode: false,
                is_active: true,
            },
            {
                email: "emma.rodriguez@example.com",
                password_hash: hashedPassword,
                role: "freelancer",
                dark_mode: false,
                is_active: true,
            },
            {
                email: "david.kim@example.com",
                password_hash: hashedPassword,
                role: "client",
                dark_mode: false,
                is_active: true,
            },
            {
                email: "jessica.parker@example.com",
                password_hash: hashedPassword,
                role: "freelancer",
                dark_mode: false,
                is_active: true,
            },
        ]);
        console.log("👥 Created users");

        // Create freelancer profiles
        const freelancerProfiles = await FreelancerProfile.insertMany([
            {
                user: users[0]._id, // Sarah Johnson
                name: "Sarah Johnson",
                bio: "Experienced social media manager with 5+ years in digital marketing",
                location: "New York, NY",
                languages: ["English", "Spanish"],
                skills: ["Social Media Management", "Content Creation", "Digital Marketing"],
                profile_image_url: "https://example.com/sarah.jpg",
                member_since: new Date("2023-01-15"),
                onboarding_complete: true,
            },
            {
                user: users[2]._id, // Emma Rodriguez
                name: "Emma Rodriguez",
                bio: "Professional content writer specializing in tech and business content",
                location: "Los Angeles, CA",
                languages: ["English", "Spanish"],
                skills: ["Content Writing", "SEO", "Copywriting"],
                profile_image_url: "https://example.com/emma.jpg",
                member_since: new Date("2023-03-20"),
                onboarding_complete: true,
            },
            {
                user: users[4]._id, // Jessica Parker
                name: "Jessica Parker",
                bio: "Creative graphic designer with expertise in branding and logo design",
                location: "Chicago, IL",
                languages: ["English"],
                skills: ["Graphic Design", "Logo Design", "Branding"],
                profile_image_url: "https://example.com/jessica.jpg",
                member_since: new Date("2023-02-10"),
                onboarding_complete: true,
            },
        ]);
        console.log("👨‍💼 Created freelancer profiles");

        // Create client profiles
        const clientProfiles = await ClientProfile.insertMany([
            {
                user: users[1]._id, // Michael Chen
                name: "Michael Chen",
                bio: "Startup founder looking for talented freelancers",
                location: "San Francisco, CA",
                languages: ["English", "Mandarin"],
                profile_image_url: "https://example.com/michael.jpg",
                client_since: new Date("2023-01-10"),
                onboarding_complete: true,
            },
            {
                user: users[3]._id, // David Kim
                name: "David Kim",
                bio: "Marketing director seeking creative professionals",
                location: "Seattle, WA",
                languages: ["English", "Korean"],
                profile_image_url: "https://example.com/david.jpg",
                client_since: new Date("2023-02-05"),
                onboarding_complete: true,
            },
        ]);
        console.log("👨‍💻 Created client profiles");

        // Create jobs based on frontend dummy data
        const jobs = await Job.insertMany([
            {
                client: clientProfiles[0]._id, // Michael Chen
                title: "Social Media Campaign",
                description:
                    "Looking for a social media expert to manage our platforms and create engaging content for our startup. Need someone who can handle Instagram, Twitter, and LinkedIn with a focus on tech audience.",
                category: categories[3]._id, // Digital Marketing
                budget_min: 500,
                budget_max: 2000,
                is_internship: false,
                status: "open",
                created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                draft: false,
            },
            {
                client: clientProfiles[1]._id, // David Kim
                title: "Website Content Writer",
                description: "Hired a content writer to create engaging articles for our blog. Need high-quality, SEO-optimized content that drives traffic and converts visitors.",
                category: categories[2]._id, // Content Writing
                budget_min: 300,
                budget_max: 1500,
                is_internship: false,
                status: "completed",
                created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
                updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                draft: false,
            },
            {
                client: clientProfiles[0]._id, // Michael Chen
                title: "Logo Redesign Project",
                description: "Working with a designer to refresh our company logo. Need a modern, professional design that reflects our tech startup identity.",
                category: categories[1]._id, // Graphic Design
                budget_min: 200,
                budget_max: 800,
                is_internship: false,
                status: "in_progress",
                created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
                updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                draft: false,
            },
        ]);
        console.log("💼 Created jobs");

        // Create services based on frontend dummy data
        const services = await Service.insertMany([
            {
                freelancer: freelancerProfiles[2]._id, // Jessica Parker
                title: "Logo Design",
                description:
                    "Professional logo design for your business or brand. I create unique, memorable logos that represent your company values and appeal to your target audience.",
                category: categories[1]._id, // Graphic Design
                price: 150,
                delivery_time_days: 7,
                status: "active",
                created_at: new Date("2023-01-15"),
                updated_at: new Date("2023-01-15"),
            },
            {
                freelancer: freelancerProfiles[0]._id, // Sarah Johnson
                title: "SEO Optimization",
                description:
                    "Improve your website ranking with expert SEO services. I will analyze your site, implement best practices, and help you climb the search engine rankings.",
                category: categories[3]._id, // Digital Marketing
                price: 200,
                delivery_time_days: 14,
                status: "active",
                created_at: new Date("2023-02-01"),
                updated_at: new Date("2023-02-01"),
            },
            {
                freelancer: freelancerProfiles[1]._id, // Emma Rodriguez
                title: "Content Writing",
                description:
                    "High-quality content writing for blogs, websites, and more. I specialize in creating engaging, SEO-friendly content that drives traffic and converts readers.",
                category: categories[2]._id, // Content Writing
                price: 100,
                delivery_time_days: 5,
                status: "active",
                created_at: new Date("2023-01-20"),
                updated_at: new Date("2023-01-20"),
            },
        ]);
        console.log("🛠️  Created services");

        // Create proposals
        const proposals = await Proposal.insertMany([
            {
                job: jobs[0]._id, // Social Media Campaign
                freelancer: freelancerProfiles[0]._id, // Sarah Johnson
                cover_letter:
                    "I have 5+ years of experience managing social media campaigns for tech startups. I can help you create engaging content and grow your online presence.",
                proposed_price: 1500,
                status: "active",
                created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            },
            {
                job: jobs[1]._id, // Website Content Writer
                freelancer: freelancerProfiles[1]._id, // Emma Rodriguez
                cover_letter: "I specialize in creating SEO-optimized content that drives traffic. I can help you create engaging blog posts that convert visitors.",
                proposed_price: 800,
                status: "completed",
                created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            },
            {
                job: jobs[2]._id, // Logo Redesign Project
                freelancer: freelancerProfiles[2]._id, // Jessica Parker
                cover_letter: "I have extensive experience in logo design and branding. I can create a modern, professional logo that reflects your startup identity.",
                proposed_price: 500,
                status: "active",
                created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
                updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            },
        ]);
        console.log("📝 Created proposals");

        // Create chats and messages based on frontend dummy data
        const chats = await Chat.insertMany([
            {
                user1: users[0]._id, // Sarah Johnson
                user2: users[1]._id, // Michael Chen
                created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                last_message_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            },
            {
                user1: users[2]._id, // Emma Rodriguez
                user2: users[3]._id, // David Kim
                created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                last_message_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            },
            {
                user1: users[4]._id, // Jessica Parker
                user2: users[1]._id, // Michael Chen
                created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
                last_message_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            },
        ]);

        // Create messages
        const messages = await Message.insertMany([
            {
                chat: chats[0]._id,
                sender: users[0]._id, // Sarah Johnson
                content: "I can start working on your project tomorrow. I have some great ideas for your social media strategy.",
                sent_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                language: "English",
            },
            {
                chat: chats[1]._id,
                sender: users[3]._id, // David Kim
                content: "Thank you for your feedback on the design. The changes look great!",
                sent_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                language: "English",
            },
            {
                chat: chats[2]._id,
                sender: users[4]._id, // Jessica Parker
                content: "Received the first draft of your content. I'll review it and send you my feedback by tomorrow.",
                sent_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                language: "English",
            },
            {
                chat: chats[0]._id,
                sender: users[1]._id, // Michael Chen
                content: "Can we schedule a call to discuss the project details?",
                sent_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
                language: "English",
            },
            {
                chat: chats[2]._id,
                sender: users[1]._id, // Michael Chen
                content: "I'll send you the updated mockups by tomorrow.",
                sent_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                language: "English",
            },
        ]);
        console.log("💬 Created chats and messages");

        // Create reviews
        const reviews = await Review.insertMany([
            {
                reviewer: users[1]._id, // Michael Chen
                reviewee: users[0]._id, // Sarah Johnson
                job: jobs[0]._id, // Social Media Campaign
                rating: 5,
                comment: "Excellent work on our social media campaign. Sarah delivered exactly what we needed and more.",
                sentiment: "positive",
                created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            },
            {
                reviewer: users[3]._id, // David Kim
                reviewee: users[2]._id, // Emma Rodriguez
                job: jobs[1]._id, // Website Content Writer
                rating: 4,
                comment: "Great content writing skills. Emma delivered high-quality articles on time.",
                sentiment: "positive",
                created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            },
        ]);
        console.log("⭐ Created reviews");

        // Create portfolios
        const portfolios = await Portfolio.insertMany([
            {
                freelancer: freelancerProfiles[0]._id, // Sarah Johnson
                title: "Tech Startup Social Media Campaign",
                description: "Managed complete social media presence for a B2B tech startup, increasing engagement by 300%",
                image_url: "https://example.com/portfolio1.jpg",
                created_at: new Date("2023-01-20"),
            },
            {
                freelancer: freelancerProfiles[1]._id, // Emma Rodriguez
                title: "E-commerce Blog Content",
                description: "Created 50+ SEO-optimized blog posts for an e-commerce site, driving 40% increase in organic traffic",
                image_url: "https://example.com/portfolio2.jpg",
                created_at: new Date("2023-02-15"),
            },
            {
                freelancer: freelancerProfiles[2]._id, // Jessica Parker
                title: "Brand Identity Design",
                description: "Complete brand identity design including logo, color palette, and brand guidelines",
                image_url: "https://example.com/portfolio3.jpg",
                created_at: new Date("2023-01-25"),
            },
        ]);
        console.log("🎨 Created portfolios");

        // Create notifications
        const notifications = await Notification.insertMany([
            {
                user: users[0]._id, // Sarah Johnson
                type: "message",
                content: "New message from Michael Chen",
                is_read: false,
                created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
            },
            {
                user: users[1]._id, // Michael Chen
                type: "proposal",
                content: "New proposal received for Social Media Campaign",
                is_read: true,
                created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            },
            {
                user: users[2]._id, // Emma Rodriguez
                type: "review",
                content: "New review received from David Kim",
                is_read: false,
                created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            },
        ]);
        console.log("🔔 Created notifications");

        // Create AI integrations
        const aiIntegrations = await AIIntegration.insertMany([
            {
                user: users[0]._id, // Sarah Johnson
                type: "translation",
                provider: "Google Translate",
                api_key: "sample_key_1",
                last_used: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            },
            {
                user: users[1]._id, // Michael Chen
                type: "chatbot",
                provider: "OpenAI",
                api_key: "sample_key_2",
                last_used: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            },
        ]);
        console.log("🤖 Created AI integrations");

        console.log("✅ Database seeding completed successfully!");
        console.log("\n📊 Summary:");
        console.log(`- ${users.length} users created`);
        console.log(`- ${categories.length} categories created`);
        console.log(`- ${freelancerProfiles.length} freelancer profiles created`);
        console.log(`- ${clientProfiles.length} client profiles created`);
        console.log(`- ${jobs.length} jobs created`);
        console.log(`- ${services.length} services created`);
        console.log(`- ${proposals.length} proposals created`);
        console.log(`- ${chats.length} chats created`);
        console.log(`- ${messages.length} messages created`);
        console.log(`- ${reviews.length} reviews created`);
        console.log(`- ${portfolios.length} portfolios created`);
        console.log(`- ${notifications.length} notifications created`);
        console.log(`- ${aiIntegrations.length} AI integrations created`);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

const main = async () => {
    await connectDB();
    await seedData();
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
    process.exit(0);
};

main().catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
});
