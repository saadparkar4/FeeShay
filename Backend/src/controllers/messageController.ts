import { Request, Response } from "express";
import { Chat, Message, User, FreelancerProfile, ClientProfile, Notification } from "../models";
import { createError, asyncHandler } from "../middlewares/errorHandler";
import socketService from "../services/socketService";

interface AuthRequest extends Request {
    user?: any;
}

export const createChat = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user._id;
    const { otherUserId } = req.body;

    // Check if other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
        throw createError("User not found", 404);
    }

    // Check if chat already exists
    const existingChat = await Chat.findOne({
        $or: [
            { user1: userId, user2: otherUserId },
            { user1: otherUserId, user2: userId },
        ],
    });

    if (existingChat) {
        res.json({
            success: true,
            data: existingChat,
        });
        return;
    }

    // Create new chat
    const chat = await Chat.create({
        user1: userId,
        user2: otherUserId,
        created_at: new Date(),
    });

    res.status(201).json({
        success: true,
        message: "Chat created successfully",
        data: chat,
    });
});

export const getMyChats = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const chats = await Chat.find({
        $or: [{ user1: userId }, { user2: userId }],
    })
        .populate("user1", "email")
        .populate("user2", "email")
        .sort({ last_message_at: -1, created_at: -1 })
        .skip(skip)
        .limit(Number(limit));

    // Get user profiles for each chat
    const chatsWithProfiles = await Promise.all(
        chats.map(async (chat) => {
            const otherUserId = chat.user1.toString() === userId.toString() ? chat.user2 : chat.user1;

            let profile;
            const otherUser = await User.findById(otherUserId);
            if (otherUser?.role === "freelancer") {
                profile = await FreelancerProfile.findOne({ user: otherUserId });
            } else {
                profile = await ClientProfile.findOne({ user: otherUserId });
            }

            // Get last message
            const lastMessage = await Message.findOne({ chat: chat._id }).sort({ sent_at: -1 }).limit(1);

            // Get unread count
            const unreadCount = await Message.countDocuments({
                chat: chat._id,
                sender: { $ne: userId },
                read_at: null,
            });

            return {
                ...chat.toObject(),
                otherUser: {
                    id: otherUserId,
                    email: otherUser?.email,
                    role: otherUser?.role,
                    profile,
                },
                lastMessage,
                unreadCount,
            };
        })
    );

    const total = await Chat.countDocuments({
        $or: [{ user1: userId }, { user2: userId }],
    });

    res.json({
        success: true,
        data: {
            chats: chatsWithProfiles,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        },
    });
});

export const getChatMessages = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user._id;
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Verify chat access
    const chat = await Chat.findOne({
        _id: chatId,
        $or: [{ user1: userId }, { user2: userId }],
    });

    if (!chat) {
        throw createError("Chat not found or access denied", 404);
    }

    const messages = await Message.find({ chat: chatId }).populate("sender", "email").sort({ sent_at: -1 }).skip(skip).limit(Number(limit));

    const total = await Message.countDocuments({ chat: chatId });

    res.json({
        success: true,
        data: {
            messages: messages.reverse(),
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        },
    });
});

export const sendMessage = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user._id;
    const { chatId } = req.params;
    const { content, language } = req.body;

    // Verify chat access
    const chat = await Chat.findOne({
        _id: chatId,
        $or: [{ user1: userId }, { user2: userId }],
    });

    if (!chat) {
        throw createError("Chat not found or access denied", 404);
    }

    // Create message
    const message = await Message.create({
        chat: chatId,
        sender: userId,
        content,
        language,
        sent_at: new Date(),
    });

    // Update chat last message time
    chat.last_message_at = new Date();
    await chat.save();

    // Populate sender info
    await message.populate("sender", "email");

    // Emit real-time update via Socket.io
    socketService.emitToChat(chatId, "new_message", {
        message: message.toObject(),
        chatId,
    });

    // Send notification to the other user
    const otherUserId = chat.user1.toString() === userId.toString() ? chat.user2.toString() : chat.user1.toString();

    // Create notification
    const notification = await Notification.create({
        user: otherUserId,
        type: "message",
        content: `New message from ${(message.sender as any).email}`,
        is_read: false,
        created_at: new Date(),
    });

    // Get unread count for the other user
    const unreadCount = await Message.countDocuments({
        chat: { $in: await Chat.find({ $or: [{ user1: otherUserId }, { user2: otherUserId }] }).distinct("_id") },
        sender: { $ne: otherUserId },
        read_at: null,
    });

    // Send real-time notification
    socketService.emitToUser(otherUserId, "new_notification", {
        notification: notification.toObject(),
        unreadCount,
    });

    res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: message,
    });
});

export const markMessagesAsRead = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user._id;
    const { chatId } = req.params;

    // Verify chat access
    const chat = await Chat.findOne({
        _id: chatId,
        $or: [{ user1: userId }, { user2: userId }],
    });

    if (!chat) {
        throw createError("Chat not found or access denied", 404);
    }

    // Mark unread messages as read
    await Message.updateMany(
        {
            chat: chatId,
            sender: { $ne: userId },
            read_at: null,
        },
        {
            read_at: new Date(),
        }
    );

    res.json({
        success: true,
        message: "Messages marked as read",
    });
});

export const getUnreadCount = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user._id;

    const unreadCount = await Message.countDocuments({
        chat: { $in: await Chat.find({ $or: [{ user1: userId }, { user2: userId }] }).distinct("_id") },
        sender: { $ne: userId },
        read_at: null,
    });

    res.json({
        success: true,
        data: { unreadCount },
    });
});

export const deleteMessage = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user._id;
    const { messageId } = req.params;

    // Find message and verify ownership
    const message = await Message.findOne({ _id: messageId, sender: userId });
    if (!message) {
        throw createError("Message not found or access denied", 404);
    }

    await Message.findByIdAndDelete(messageId);

    res.json({
        success: true,
        message: "Message deleted successfully",
    });
});
