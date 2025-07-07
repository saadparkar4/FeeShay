import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import { errorHandler, notFound } from "./middlewares/errorHandler";
import { connectDatabase } from "./config/database";

// Load environment variables
dotenv.config();

const app = express();

// Connect to database
connectDatabase();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // Logging
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        credentials: true,
    })
);

// Static files for uploads
app.use("/uploads", express.static("uploads"));

// Routes
app.use(routes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;
