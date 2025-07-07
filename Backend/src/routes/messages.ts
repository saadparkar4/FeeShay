import { Router } from "express";
import { createChat, getMyChats, getChatMessages, sendMessage, markMessagesAsRead, getUnreadCount, deleteMessage } from "../controllers/messageController";
import { validateMessageCreation, validateMongoId, validatePagination } from "../middlewares/validation";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

// Protected routes
router.post("/chats", authenticateToken, createChat);
router.get("/chats", authenticateToken, validatePagination, getMyChats);
router.get("/chats/:chatId/messages", authenticateToken, validateMongoId, validatePagination, getChatMessages);
router.post("/chats/:chatId/messages", authenticateToken, validateMongoId, validateMessageCreation, sendMessage);
router.put("/chats/:chatId/read", authenticateToken, validateMongoId, markMessagesAsRead);
router.get("/unread-count", authenticateToken, getUnreadCount);
router.delete("/messages/:messageId", authenticateToken, validateMongoId, deleteMessage);

export default router;
