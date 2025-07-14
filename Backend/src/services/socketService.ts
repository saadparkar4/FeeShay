import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import { Message, Chat, Notification, User } from "../models";

interface SocketUser {
    userId: string;
    socketId: string;
}

class SocketService {
    private io: Server | null = null;
    private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

    initialize(server: HTTPServer) {
        this.io = new Server(server, {
            cors: {
                origin: true, // Allow all origins for development
                credentials: true,
            },
        });

        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        if (!this.io) return;

        // Middleware for authentication
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token;
                if (!token) {
                    return next(new Error("Authentication error"));
                }

                const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
                socket.data.userId = decoded.id;
                next();
            } catch (err) {
                next(new Error("Authentication error"));
            }
        });

        this.io.on("connection", (socket) => {
            const userId = socket.data.userId;
            console.log(`User ${userId} connected with socket ${socket.id}`);

            // Store user's socket ID
            this.connectedUsers.set(userId, socket.id);

            // Join user to their own room for private notifications
            socket.join(`user:${userId}`);

            // Handle joining chat rooms
            socket.on("join_chat", async (chatId: string) => {
                try {
                    // Verify user has access to this chat
                    const chat = await Chat.findOne({
                        _id: chatId,
                        $or: [{ user1: userId }, { user2: userId }],
                    });

                    if (chat) {
                        socket.join(`chat:${chatId}`);
                        console.log(`User ${userId} joined chat ${chatId}`);
                    }
                } catch (error) {
                    console.error("Error joining chat:", error);
                }
            });

            // Handle sending messages
            socket.on("send_message", async (data: { chatId: string; content: string; language?: string }) => {
                try {
                    const { chatId, content, language } = data;

                    // Verify chat access
                    const chat = await Chat.findOne({
                        _id: chatId,
                        $or: [{ user1: userId }, { user2: userId }],
                    });

                    if (!chat) {
                        socket.emit("error", { message: "Chat not found or access denied" });
                        return;
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

                    // Emit to all users in the chat room
                    this.io?.to(`chat:${chatId}`).emit("new_message", {
                        message: message.toObject(),
                        chatId,
                    });

                    // Send notification to the other user if they're not in the chat room
                    const otherUserId = chat.user1.toString() === userId ? chat.user2.toString() : chat.user1.toString();
                    
                    // Create notification for the other user
                    const notification = await Notification.create({
                        user: otherUserId,
                        type: "message",
                        content: `New message from ${(message.sender as any).email}`,
                        is_read: false,
                        created_at: new Date(),
                    });

                    // Send real-time notification to the other user
                    this.io?.to(`user:${otherUserId}`).emit("new_notification", {
                        notification: notification.toObject(),
                        unreadCount: await this.getUnreadMessageCount(otherUserId),
                    });

                } catch (error) {
                    console.error("Error sending message:", error);
                    socket.emit("error", { message: "Failed to send message" });
                }
            });

            // Handle marking messages as read
            socket.on("mark_as_read", async (chatId: string) => {
                try {
                    // Verify chat access
                    const chat = await Chat.findOne({
                        _id: chatId,
                        $or: [{ user1: userId }, { user2: userId }],
                    });

                    if (!chat) return;

                    // Mark messages as read
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

                    // Notify the sender that their messages were read
                    const otherUserId = chat.user1.toString() === userId ? chat.user2.toString() : chat.user1.toString();
                    this.io?.to(`user:${otherUserId}`).emit("messages_read", { chatId });

                    // Update unread count for current user
                    const unreadCount = await this.getUnreadMessageCount(userId);
                    socket.emit("unread_count_update", { unreadCount });

                } catch (error) {
                    console.error("Error marking messages as read:", error);
                }
            });

            // Handle typing indicators
            socket.on("typing_start", ({ chatId }: { chatId: string }) => {
                socket.to(`chat:${chatId}`).emit("user_typing", { userId, chatId });
            });

            socket.on("typing_stop", ({ chatId }: { chatId: string }) => {
                socket.to(`chat:${chatId}`).emit("user_stopped_typing", { userId, chatId });
            });

            // Handle disconnect
            socket.on("disconnect", () => {
                console.log(`User ${userId} disconnected`);
                this.connectedUsers.delete(userId);
            });
        });
    }

    // Helper method to get unread message count
    private async getUnreadMessageCount(userId: string): Promise<number> {
        const userChats = await Chat.find({
            $or: [{ user1: userId }, { user2: userId }],
        }).distinct("_id");

        return await Message.countDocuments({
            chat: { $in: userChats },
            sender: { $ne: userId },
            read_at: null,
        });
    }

    // Method to emit events from outside socket handlers
    public emitToUser(userId: string, event: string, data: any) {
        const socketId = this.connectedUsers.get(userId);
        if (socketId && this.io) {
            this.io.to(socketId).emit(event, data);
        }
    }

    // Method to emit to a chat room
    public emitToChat(chatId: string, event: string, data: any) {
        if (this.io) {
            this.io.to(`chat:${chatId}`).emit(event, data);
        }
    }

    // Check if user is online
    public isUserOnline(userId: string): boolean {
        return this.connectedUsers.has(userId);
    }
}

export default new SocketService();