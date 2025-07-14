import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { COLORS } from "@/constants/Colors";
import socketService from "@/services/socketService";

interface Chat {
	_id: string;
	user1: any;
	user2: any;
	created_at: string;
	last_message_at?: string;
	otherUser?: {
		id: string;
		email: string;
		role: string;
		profile: {
			name: string;
			bio?: string;
			location?: string;
			profile_image_url?: string;
		};
	};
	lastMessage?: {
		content: string;
		sent_at: string;
		sender: string;
		read_at?: string;
	};
	unreadCount?: number;
}

interface MessageListItemProps {
	chat: Chat;
}

// Get initials from name
function getInitials(name: string): string {
	if (!name) return "?";
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

// Format time for display
function formatTime(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) {
		// Today - show time
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	} else if (diffDays === 1) {
		return "Yesterday";
	} else if (diffDays < 7) {
		// This week - show day name
		return date.toLocaleDateString([], { weekday: 'short' });
	} else {
		// Older - show date
		return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
	}
}

export function MessageListItem({ chat }: MessageListItemProps) {
	const otherUser = chat.otherUser;
	const userName = otherUser?.profile?.name || otherUser?.email || "Unknown User";
	const userAvatar = otherUser?.profile?.profile_image_url;
	const isOnline = socketService.isUserOnline(otherUser?.id || "");
	
	// Get last message info
	const lastMessage = chat.lastMessage?.content || "No messages yet";
	const messageTime = chat.lastMessage?.sent_at || chat.last_message_at || chat.created_at;
	const hasUnread = (chat.unreadCount || 0) > 0;

	return (
		<View style={styles.container}>
			<View style={styles.avatarContainer}>
				{userAvatar ? (
					<Image source={{ uri: userAvatar }} style={styles.avatar} />
				) : (
					<View style={[styles.avatar, styles.placeholderAvatar]}>
						<Text style={styles.initials}>{getInitials(userName)}</Text>
					</View>
				)}
				<View style={[styles.statusDot, { backgroundColor: isOnline ? "#00E676" : "#D3D3D3" }]} />
			</View>
			<View style={styles.textContainer}>
				<View style={styles.headerRow}>
					<Text style={styles.name} numberOfLines={1}>{userName}</Text>
					<Text style={styles.time}>{formatTime(messageTime)}</Text>
				</View>
				<View style={styles.messageRow}>
					<Text style={[styles.message, hasUnread && styles.unreadMessage]} numberOfLines={1}>
						{lastMessage}
					</Text>
					{hasUnread && (
						<View style={styles.unreadBadge}>
							<Text style={styles.unreadCount}>
								{chat.unreadCount! > 99 ? '99+' : chat.unreadCount}
							</Text>
						</View>
					)}
				</View>
			</View>
		</View>
	);
}

const AVATAR_SIZE = 56;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 16,
		paddingHorizontal: 20,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#F2F2F2",
	},
	avatarContainer: {
		marginRight: 16,
		position: "relative",
	},
	avatar: {
		width: AVATAR_SIZE,
		height: AVATAR_SIZE,
		borderRadius: AVATAR_SIZE / 2,
		justifyContent: "center",
		alignItems: "center",
	},
	placeholderAvatar: {
		backgroundColor: COLORS.accent,
	},
	initials: {
		color: COLORS.background,
		fontWeight: "bold",
		fontSize: 20,
	},
	statusDot: {
		position: "absolute",
		bottom: 4,
		right: 4,
		width: 14,
		height: 14,
		borderRadius: 7,
		borderWidth: 2,
		borderColor: "#fff",
	},
	textContainer: {
		flex: 1,
		justifyContent: "center",
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 4,
	},
	name: {
		fontWeight: "600",
		fontSize: 16,
		color: COLORS.textPrimary,
		flex: 1,
		marginRight: 8,
	},
	time: {
		fontSize: 13,
		color: COLORS.textSecondary,
	},
	messageRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	message: {
		fontSize: 14,
		color: COLORS.textSecondary,
		flex: 1,
		marginRight: 8,
	},
	unreadMessage: {
		color: COLORS.textPrimary,
		fontWeight: "500",
	},
	unreadBadge: {
		backgroundColor: COLORS.accent,
		borderRadius: 12,
		paddingHorizontal: 8,
		paddingVertical: 2,
		minWidth: 24,
		alignItems: "center",
	},
	unreadCount: {
		color: COLORS.background,
		fontSize: 12,
		fontWeight: "600",
	},
});