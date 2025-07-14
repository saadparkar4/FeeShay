import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';
import { getChatMessages, sendMessage, markMessagesAsRead, getMyChats } from '@/api/messages';
import socketService from '@/services/socketService';
import AuthContext from '@/context/AuthContext';

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    email: string;
  };
  sent_at: string;
  read_at?: string;
}

interface ChatInfo {
  otherUser: {
    id: string;
    email: string;
    profile?: {
      name: string;
    };
  };
}

export default function ChatScreen() {
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch chat info
  const fetchChatInfo = async () => {
    try {
      const response = await getMyChats();
      if (response.success && response.data) {
        const chat = response.data.chats.find((c: any) => c._id === chatId);
        if (chat) {
          setChatInfo({ otherUser: chat.otherUser });
          // Determine current user ID from chat data
          if (chat.user1._id !== chat.otherUser.id) {
            setCurrentUserId(chat.user1._id);
          } else {
            setCurrentUserId(chat.user2._id);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching chat info:', error);
    }
  };

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await getChatMessages(chatId as string);
      if (response.success && response.data) {
        setMessages(response.data.messages);
        // Mark messages as read
        markMessagesAsRead(chatId as string);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Initialize
  useEffect(() => {
    if (chatId) {
      fetchChatInfo();
      fetchMessages();
      socketService.joinChat(chatId as string);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatId]);

  // Socket event listeners
  useEffect(() => {
    const handleNewMessage = (data: any) => {
      if (data.chatId === chatId) {
        setMessages((prev) => [...prev, data.message]);
        // Mark as read if the chat is open
        if (data.message.sender._id !== currentUserId) {
          markMessagesAsRead(chatId as string);
        }
      }
    };

    const handleUserTyping = (data: any) => {
      if (data.chatId === chatId && data.userId !== currentUserId) {
        setIsTyping(true);
      }
    };

    const handleUserStoppedTyping = (data: any) => {
      if (data.chatId === chatId && data.userId !== currentUserId) {
        setIsTyping(false);
      }
    };

    socketService.on('new_message', handleNewMessage);
    socketService.on('user_typing', handleUserTyping);
    socketService.on('user_stopped_typing', handleUserStoppedTyping);

    return () => {
      socketService.off('new_message', handleNewMessage);
      socketService.off('user_typing', handleUserTyping);
      socketService.off('user_stopped_typing', handleUserStoppedTyping);
    };
  }, [chatId, currentUserId]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Handle typing indicator
  const handleInputChange = (text: string) => {
    setInputText(text);

    // Send typing indicator
    if (text.length > 0 && !isTyping) {
      socketService.startTyping(chatId as string);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    if (text.length > 0) {
      typingTimeoutRef.current = setTimeout(() => {
        socketService.stopTyping(chatId as string);
      }, 1000);
    } else {
      socketService.stopTyping(chatId as string);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (inputText.trim() && !sending) {
      setSending(true);
      const messageText = inputText.trim();
      setInputText('');

      // Stop typing indicator
      socketService.stopTyping(chatId as string);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      try {
        // Use Socket.io to send the message for real-time delivery
        socketService.sendMessage(chatId as string, messageText);
        
        // Also send via API for persistence (the socket handler will prevent duplicate)
        await sendMessage(chatId as string, messageText);
      } catch (error) {
        console.error('Error sending message:', error);
        Alert.alert('Error', 'Failed to send message');
        setInputText(messageText); // Restore message if failed
      } finally {
        setSending(false);
      }
    }
  };

  // Format timestamp
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
             date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const otherUserName = chatInfo?.otherUser?.profile?.name || chatInfo?.otherUser?.email || 'User';
  const isOnline = socketService.isUserOnline(chatInfo?.otherUser?.id || '');

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{otherUserName}</Text>
          <Text style={[styles.headerStatus, { color: isOnline ? COLORS.accent : COLORS.textSecondary }]}>
            {isTyping ? 'Typing...' : (isOnline ? 'Online' : 'Offline')}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Start a conversation</Text>
              <Text style={styles.emptySubtext}>Send a message to begin chatting</Text>
            </View>
          ) : (
            messages.map((message) => {
              const isUserMessage = message.sender._id === currentUserId;
              return (
                <View
                  key={message._id}
                  style={[
                    styles.messageWrapper,
                    isUserMessage ? styles.userMessageWrapper : styles.otherMessageWrapper,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      isUserMessage ? styles.userMessage : styles.otherMessage,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isUserMessage ? styles.userMessageText : styles.otherMessageText,
                      ]}
                    >
                      {message.content}
                    </Text>
                    <Text
                      style={[
                        styles.timestamp,
                        isUserMessage ? styles.userTimestamp : styles.otherTimestamp,
                      ]}
                    >
                      {formatTimestamp(message.sent_at)}
                      {isUserMessage && message.read_at && ' • Read'}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={handleInputChange}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            maxLength={500}
            editable={!sending}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive,
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() ? 'white' : COLORS.textSecondary}
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: COLORS.background,
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  headerStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  messageWrapper: {
    marginBottom: 12,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  otherMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  userMessage: {
    backgroundColor: COLORS.accent,
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: COLORS.textPrimary,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTimestamp: {
    color: COLORS.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: COLORS.background,
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sendButtonActive: {
    backgroundColor: COLORS.accent,
  },
  sendButtonInactive: {
    backgroundColor: '#F3F4F6',
  },
});