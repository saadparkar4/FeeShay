const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import models
const { Category } = require("../src/models");

// Sample categories data
const sampleCategories = [
    {
        name: "Web Development",
        description: "Frontend and backend web development services",
        icon_url: "web-development-icon.png",
    },
    {
        name: "Mobile Development",
        description: "iOS and Android app development",
        icon_url: "mobile-development-icon.png",
    },
    {
        name: "Graphic Design",
        description: "Logo design, branding, and visual design",
        icon_url: "graphic-design-icon.png",
    },
    {
        name: "Content Writing",
        description: "Blog posts, articles, and copywriting",
        icon_url: "content-writing-icon.png",
    },
    {
        name: "Digital Marketing",
        description: "SEO, social media, and online marketing",
        icon_url: "digital-marketing-icon.png",
    },
    {
        name: "Data Analysis",
        description: "Data science, analytics, and visualization",
        icon_url: "data-analysis-icon.png",
    },
    {
        name: "Video Editing",
        description: "Video production and editing services",
        icon_url: "video-editing-icon.png",
    },
    {
        name: "Translation",
        description: "Language translation and localization",
        icon_url: "translation-icon.png",
    },
];

async function setupDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DB_URL);
        console.log("✅ Connected to MongoDB");

        // Clear existing categories
        await Category.deleteMany({});
        console.log("🗑️ Cleared existing categories");

        // Insert sample categories
        const categories = await Category.insertMany(sampleCategories);
        console.log(`✅ Inserted ${categories.length} categories`);

        console.log("\n📋 Sample categories created:");
        categories.forEach((category) => {
            console.log(`  - ${category.name}: ${category.description}`);
        });

        console.log("\n🎉 Database setup completed successfully!");
        console.log("🚀 You can now start the server with: npm start");
    } catch (error) {
        console.error("❌ Setup failed:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("👋 Disconnected from MongoDB");
    }
}

// Run setup if this file is executed directly
if (require.main === module) {
    setupDatabase();
}

module.exports = { setupDatabase };
