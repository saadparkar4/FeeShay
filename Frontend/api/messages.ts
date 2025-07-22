import { getToken } from "./storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.6.37:3000/api/v1";

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

interface Chat {
    _id: string;
    user1: any;
    user2: any;
    created_at: Date;
    last_message_at?: Date;
    otherUser?: {
        id: string;
        email: string;
        role: string;
        profile: any;
    };
}

interface Message {
    _id: string;
    chat: string;
    sender: any;
    content: string;
    sent_at: Date;
    read_at?: Date;
    language?: string;
    translated_content?: string;
}

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

// Create a new chat
export const createChat = async (otherUserId: string): Promise<ApiResponse<Chat>> => {
    try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/messages/chats`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ otherUserId }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to create chat");
        }

        return data;
    } catch (error: any) {
        console.error("Create chat error:", error);
        return {
            success: false,
            error: error.message || "Failed to create chat",
        };
    }
};

// Get user's chats
export const getMyChats = async (page = 1, limit = 10): Promise<ApiResponse<{ chats: Chat[]; pagination: PaginationInfo }>> => {
    try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/messages/chats?page=${page}&limit=${limit}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch chats");
        }

        return data;
    } catch (error: any) {
        console.error("Get chats error:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch chats",
        };
    }
};

// Get messages in a chat
export const getChatMessages = async (chatId: string, page = 1, limit = 50): Promise<ApiResponse<{ messages: Message[]; pagination: PaginationInfo }>> => {
    try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/messages/chats/${chatId}/messages?page=${page}&limit=${limit}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch messages");
        }

        return data;
    } catch (error: any) {
        console.error("Get messages error:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch messages",
        };
    }
};

// Send a message
export const sendMessage = async (chatId: string, content: string, language?: string): Promise<ApiResponse<Message>> => {
    try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/messages/chats/${chatId}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ chat: chatId, content, language }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to send message");
        }

        return data;
    } catch (error: any) {
        console.error("Send message error:", error);
        return {
            success: false,
            error: error.message || "Failed to send message",
        };
    }
};

// Mark messages as read
export const markMessagesAsRead = async (chatId: string): Promise<ApiResponse> => {
    try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/messages/chats/${chatId}/read`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to mark messages as read");
        }

        return data;
    } catch (error: any) {
        console.error("Mark as read error:", error);
        return {
            success: false,
            error: error.message || "Failed to mark messages as read",
        };
    }
};

// Get unread message count
export const getUnreadCount = async (): Promise<ApiResponse<{ unreadCount: number }>> => {
    try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/messages/unread-count`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch unread count");
        }

        return data;
    } catch (error: any) {
        console.error("Get unread count error:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch unread count",
        };
    }
};

// Delete a message
export const deleteMessage = async (messageId: string): Promise<ApiResponse> => {
    try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/messages/messages/${messageId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to delete message");
        }

        return data;
    } catch (error: any) {
        console.error("Delete message error:", error);
        return {
            success: false,
            error: error.message || "Failed to delete message",
        };
    }
};
