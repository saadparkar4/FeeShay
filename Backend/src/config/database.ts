import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.DB_URL || "mongodb://localhost:27017/feeshay";

export const connectDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB successfully");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};

export const disconnectDatabase = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        console.log("✅ Disconnected from MongoDB");
    } catch (error) {
        console.error("❌ MongoDB disconnection error:", error);
    }
};

// Handle connection events
mongoose.connection.on("error", (error) => {
    console.error("❌ MongoDB connection error:", error);
});

mongoose.connection.on("disconnected", () => {
    console.log("⚠️ MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
    console.log("✅ MongoDB reconnected");
});
