import { io, Socket } from 'socket.io-client';
import { getToken } from '@/api/storage';

class SocketService {
    private socket: Socket | null = null;
    private listeners: Map<string, Function[]> = new Map();

    async connect() {
        if (this.socket?.connected) return;

        const token = await getToken();
        if (!token) {
            console.log('No token available for socket connection');
            return;
        }

        const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
        const socketUrl = baseUrl.replace(/\/api\/v\d+$/, '').replace(/\/api$/, '');
        
        this.socket = io(socketUrl, {
            auth: {
                token
            },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('Socket connected');
            this.emit('connected');
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            this.emit('disconnected');
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
            this.emit('error', error);
        });

        // Message events
        this.socket.on('new_message', (data) => {
            this.emit('new_message', data);
        });

        this.socket.on('messages_read', (data) => {
            this.emit('messages_read', data);
        });

        this.socket.on('user_typing', (data) => {
            this.emit('user_typing', data);
        });

        this.socket.on('user_stopped_typing', (data) => {
            this.emit('user_stopped_typing', data);
        });

        // Notification events
        this.socket.on('new_notification', (data) => {
            this.emit('new_notification', data);
        });

        this.socket.on('unread_count_update', (data) => {
            this.emit('unread_count_update', data);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.listeners.clear();
    }

    // Join a chat room
    joinChat(chatId: string) {
        if (this.socket?.connected) {
            this.socket.emit('join_chat', chatId);
        }
    }

    // Send a message
    sendMessage(chatId: string, content: string, language?: string) {
        if (this.socket?.connected) {
            this.socket.emit('send_message', { chatId, content, language });
        }
    }

    // Mark messages as read
    markAsRead(chatId: string) {
        if (this.socket?.connected) {
            this.socket.emit('mark_as_read', chatId);
        }
    }

    // Typing indicators
    startTyping(chatId: string) {
        if (this.socket?.connected) {
            this.socket.emit('typing_start', { chatId });
        }
    }

    stopTyping(chatId: string) {
        if (this.socket?.connected) {
            this.socket.emit('typing_stop', { chatId });
        }
    }

    // Event listener management
    on(event: string, callback: Function) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
    }

    off(event: string, callback: Function) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    private emit(event: string, data?: any) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => callback(data));
        }
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    // Check if a user is online
    isUserOnline(userId: string): boolean {
        // This would typically be tracked by the server
        // For now, return false as we don't have online status tracking
        return false;
    }
}

export default new SocketService();