import apiClient from './index';

// NOTE: These endpoints need to be implemented in the backend
// Currently using mock data as fallback

export interface Notification {
  _id: string;
  user: string;
  type: 'message' | 'proposal' | 'review' | 'system';
  content: string;
  is_read: boolean;
  created_at: string;
  data?: {
    proposalId?: string;
    jobId?: string;
    jobTitle?: string;
    clientName?: string;
    freelancerName?: string;
    status?: string;
    chatId?: string;
  };
}

export interface NotificationResponse {
  success: boolean;
  data?: Notification[] | { notifications: Notification[] };
  message?: string;
}

const notificationApi = {
  // Get all notifications for the current user
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    unread?: boolean;
  }): Promise<NotificationResponse> => {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<NotificationResponse> => {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<NotificationResponse> => {
    const response = await apiClient.put('/notifications/mark-all-read');
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<{ success: boolean; data: { count: number } }> => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId: string): Promise<NotificationResponse> => {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};

export default notificationApi;