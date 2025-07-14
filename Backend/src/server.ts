import app from "./app";
import dotenv from "dotenv";
import { createServer } from "http";
import socketService from "./services/socketService";
import { connectDatabase } from "./config/database";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.io
socketService.initialize(httpServer);

// Connect to database
connectDatabase();

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} with Socket.io support`);
});
