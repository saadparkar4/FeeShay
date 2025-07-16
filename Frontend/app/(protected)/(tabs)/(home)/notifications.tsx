/**
 * Notifications Screen Component
 * 
 * Displays all notifications for the user including:
 * - Proposal status updates (accepted/declined)
 * - New messages
 * - Job updates
 * - System notifications
 */

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';
import AuthContext from '@/context/AuthContext';
import notificationApi from '@/api/notifications';

interface Notification {
  id: string;
  type: 'proposal_accepted' | 'proposal_declined' | 'message' | 'job_update' | 'system' | 'proposal';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

// Mock notifications for freelancers
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'proposal_accepted',
    title: 'Proposal Accepted! 🎉',
    message: 'Your proposal for "E-commerce Website Development" has been accepted by John Smith',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    read: false,
    data: { proposalId: '1', jobTitle: 'E-commerce Website Development', clientName: 'John Smith' }
  },
  {
    id: '2',
    type: 'proposal_declined',
    title: 'Proposal Declined',
    message: 'Your proposal for "Logo Design Project" was declined by Tech Corp',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    data: { proposalId: '2', jobTitle: 'Logo Design Project', clientName: 'Tech Corp' }
  },
  {
    id: '3',
    type: 'message',
    title: 'New Message',
    message: 'You have a new message from Sarah Johnson',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true,
    data: { chatId: '1', senderName: 'Sarah Johnson' }
  },
  {
    id: '4',
    type: 'proposal_accepted',
    title: 'Proposal Accepted! 🎉',
    message: 'Your proposal for "Mobile App UI/UX Design" has been accepted by StartupXYZ',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    data: { proposalId: '3', jobTitle: 'Mobile App UI/UX Design', clientName: 'StartupXYZ' }
  },
];

// Mock notifications for clients
const mockClientNotifications: Notification[] = [
  {
    id: '1',
    type: 'message',
    title: 'New Proposal Received',
    message: 'You have a new proposal for "Website Redesign Project" from Michael Chen',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    read: false,
    data: { proposalId: '1', jobTitle: 'Website Redesign Project', freelancerName: 'Michael Chen' }
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message',
    message: 'You have a new message from Emma Rodriguez',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: true,
    data: { chatId: '2', senderName: 'Emma Rodriguez' }
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { userRole, isAuthenticated } = useContext(AuthContext);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [userRole]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // For now, just use mock data since the API endpoint doesn't exist
      // TODO: Uncomment when notification API is implemented in backend
      // const response = await notificationApi.getNotifications();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Use mock data based on user role
      const mockData = userRole === 'freelancer' ? mockNotifications : mockClientNotifications;
      setNotifications(mockData);
      
    } catch (error) {
      // Silently fallback to mock data
      const mockData = userRole === 'freelancer' ? mockNotifications : mockClientNotifications;
      setNotifications(mockData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const markAsRead = async (notificationId: string) => {
    // For now, just update local state since API doesn't exist
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = async () => {
    // For now, just update local state since API doesn't exist
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    markAsRead(notification.id);

    // Navigate based on notification type
    switch (notification.type) {
      case 'proposal_accepted':
      case 'proposal_declined':
        if (notification.data?.proposalId) {
          router.push({
            pathname: '/(protected)/(tabs)/(proposals)/[id]',
            params: { id: notification.data.proposalId }
          });
        }
        break;
      case 'message':
        if (notification.data?.chatId) {
          router.push({
            pathname: '/(protected)/(tabs)/(messages)/[id]',
            params: { id: notification.data.chatId }
          });
        }
        break;
      default:
        break;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'proposal_accepted':
        return { name: 'checkmark-circle', color: '#22C55E' };
      case 'proposal_declined':
        return { name: 'close-circle', color: '#EF4444' };
      case 'message':
        return { name: 'chatbubble', color: COLORS.accent };
      case 'job_update':
        return { name: 'briefcase', color: COLORS.accentSecondary };
      default:
        return { name: 'notifications', color: COLORS.textSecondary };
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.guestContainer}>
          <Ionicons name="notifications-outline" size={64} color={COLORS.textSecondary} />
          <Text style={styles.guestTitle}>Notifications</Text>
          <Text style={styles.guestMessage}>Please sign in to view notifications</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaTop}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.title}>Notifications</Text>
          </View>
          <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.accent} />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.accent}
              />
            }
          >
            {notifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="notifications-off-outline" size={64} color={COLORS.textSecondary} />
                <Text style={styles.emptyTitle}>No notifications</Text>
                <Text style={styles.emptyText}>You're all caught up!</Text>
              </View>
            ) : (
              <View style={styles.notificationsList}>
                {notifications.map((notification) => {
                  const icon = getNotificationIcon(notification.type);
                  return (
                    <TouchableOpacity
                      key={notification.id}
                      style={[
                        styles.notificationCard,
                        !notification.read && styles.unreadCard
                      ]}
                      onPress={() => handleNotificationPress(notification)}
                    >
                      <View style={[styles.iconContainer, { backgroundColor: icon.color + '20' }]}>
                        <Ionicons name={icon.name as any} size={24} color={icon.color} />
                      </View>
                      
                      <View style={styles.contentContainer}>
                        <View style={styles.headerRow}>
                          <Text style={[styles.notificationTitle, !notification.read && styles.unreadText]}>
                            {notification.title}
                          </Text>
                          {!notification.read && <View style={styles.unreadDot} />}
                        </View>
                        
                        <Text style={styles.notificationMessage} numberOfLines={2}>
                          {notification.message}
                        </Text>
                        
                        <Text style={styles.timestamp}>
                          {formatTimestamp(notification.timestamp)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: COLORS.background,
  },
  safeAreaTop: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  unreadCard: {
    backgroundColor: COLORS.accent + '08',
    borderColor: COLORS.accent + '20',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  unreadText: {
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  guestMessage: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});