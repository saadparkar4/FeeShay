import mongoose from "mongoose";
import dotenv from "dotenv";
import { User, Chat, Message } from "./src/models";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.DB_URL || "mongodb://localhost:27017/feeshay";

async function testConnection() {
    console.log("🔄 Testing database connection...");
    console.log("📍 Connection string:", MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));

    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Successfully connected to MongoDB!");

        // Test collections
        console.log("\n📊 Testing collections:");
        
        // Count documents in each collection
        const userCount = await User.countDocuments();
        const chatCount = await Chat.countDocuments();
        const messageCount = await Message.countDocuments();

        console.log(`  - Users: ${userCount}`);
        console.log(`  - Chats: ${chatCount}`);
        console.log(`  - Messages: ${messageCount}`);

        // List database info
        const dbInfo = mongoose.connection.db;
        if (dbInfo) {
            console.log(`\n📁 Database name: ${dbInfo.databaseName}`);
        }

        // Test a simple query
        console.log("\n🔍 Testing a simple query:");
        const recentChats = await Chat.find()
            .sort({ created_at: -1 })
            .limit(5)
            .populate('user1', 'email')
            .populate('user2', 'email');
        
        console.log(`  Found ${recentChats.length} recent chats`);

        console.log("\n✅ All tests passed! Database is properly connected and accessible.");

    } catch (error) {
        console.error("\n❌ Database connection test failed:");
        console.error(error);
    } finally {
        // Close the connection
        await mongoose.disconnect();
        console.log("\n👋 Disconnected from MongoDB");
        process.exit(0);
    }
}

testConnection();