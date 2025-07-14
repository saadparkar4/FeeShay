import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { MessageListItem } from "../../../../components/Messages/MessageListItem";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AuthContext from "@/context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/Colors";
import { getMyChats, getUnreadCount } from "@/api/messages";
import socketService from "@/services/socketService";

export default function Index() {
	const [chats, setChats] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);
	const { isAuthenticated } = useContext(AuthContext);

	console.log("Messages Screen - isAuthenticated:", isAuthenticated);

	// Fetch chats
	const fetchChats = async () => {
		try {
			const response = await getMyChats();
			if (response.success && response.data) {
				setChats(response.data.chats);
			}
		} catch (error) {
			console.error("Error fetching chats:", error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	// Fetch unread count
	const fetchUnreadCount = async () => {
		try {
			const response = await getUnreadCount();
			if (response.success && response.data) {
				setUnreadCount(response.data.unreadCount);
			}
		} catch (error) {
			console.error("Error fetching unread count:", error);
		}
	};

	// Load data on mount
	useEffect(() => {
		if (isAuthenticated) {
			fetchChats();
			fetchUnreadCount();
		}
	}, [isAuthenticated]);

	// Set up socket listeners
	useEffect(() => {
		const handleNewMessage = (data: any) => {
			// Refresh chats when new message arrives
			fetchChats();
		};

		const handleUnreadUpdate = (data: any) => {
			setUnreadCount(data.unreadCount);
		};

		socketService.on('new_message', handleNewMessage);
		socketService.on('unread_count_update', handleUnreadUpdate);

		return () => {
			socketService.off('new_message', handleNewMessage);
			socketService.off('unread_count_update', handleUnreadUpdate);
		};
	}, []);

	// Pull to refresh
	const onRefresh = () => {
		setRefreshing(true);
		fetchChats();
		fetchUnreadCount();
	};

	// Handle sign in navigation for guests
	const handleSignIn = () => {
		router.push('/Register');
	};

	// If user is not authenticated, show sign in prompt
	if (!isAuthenticated) {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.guestContainer}>
					<Ionicons name="chatbubbles-outline" size={64} color={COLORS.textSecondary} />
					<Text style={styles.guestTitle}>Messages</Text>
					<Text style={styles.guestMessage}>Please sign in to use this feature</Text>
					<TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
						<LinearGradient
							colors={[COLORS.accent, COLORS.accentSecondary]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={styles.gradientButton}
						>
							<Text style={styles.signInButtonText}>Sign In</Text>
						</LinearGradient>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Messages</Text>
				<TouchableOpacity style={styles.notificationIcon} activeOpacity={0.7}>
					<Ionicons name="notifications-outline" size={28} color={COLORS.accent} />
					{unreadCount > 0 && (
						<View style={styles.badge}>
							<Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
						</View>
					)}
				</TouchableOpacity>
			</View>

			{loading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={COLORS.accent} />
				</View>
			) : (
				<ScrollView 
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
				>
					{chats.length === 0 ? (
						<View style={styles.emptyContainer}>
							<Ionicons name="chatbubbles-outline" size={48} color={COLORS.textSecondary} />
							<Text style={styles.emptyText}>No conversations yet</Text>
							<Text style={styles.emptySubtext}>Start a conversation to connect with others</Text>
						</View>
					) : (
						chats.map((chat) => (
							<TouchableOpacity
								key={chat._id}
								onPress={() => {
									router.push({ pathname: "/(protected)/(tabs)/(messages)/[id]", params: { id: chat._id } });
								}}>
								<MessageListItem chat={chat} />
							</TouchableOpacity>
						))
					)}
				</ScrollView>
			)}
		</SafeAreaView>
		
		{/* Floating Action Button */}
		<TouchableOpacity 
			style={styles.addButton} 
			activeOpacity={0.8}
			onPress={() => {
				console.log('Add button pressed');
				router.push("/(protected)/(tabs)/(messages)/newChat");
			}}
		>
			<Ionicons name="add" size={30} color="#FFFFFF" />
		</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	safeArea: {
		flex: 1,
		backgroundColor: "#fff",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#F2F2F2",
		backgroundColor: "#fff",
	},
	headerTitle: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#222",
	},
	notificationIcon: {
		position: "relative",
		padding: 4,
	},
	badge: {
		position: "absolute",
		top: 0,
		right: 0,
		backgroundColor: COLORS.accent,
		borderRadius: 10,
		minWidth: 18,
		height: 18,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 4,
	},
	badgeText: {
		color: "#fff",
		fontSize: 12,
		fontWeight: "bold",
	},
	addButton: {
		position: "absolute",
		bottom: 80, // Adjusted position
		right: 16,
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: COLORS.accent || '#F72585', // Fallback color
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	// Guest container styles
	guestContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	// Guest title
	guestTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: COLORS.textPrimary,
		marginTop: 16,
		marginBottom: 8,
	},
	// Guest message
	guestMessage: {
		fontSize: 16,
		color: COLORS.textSecondary,
		textAlign: 'center',
		marginBottom: 32,
	},
	// Sign in button
	signInButton: {
		width: 200,
		height: 48,
		borderRadius: 12,
		overflow: 'hidden',
	},
	// Gradient button style
	gradientButton: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	// Sign in button text
	signInButtonText: {
		color: COLORS.background,
		fontSize: 16,
		fontWeight: '600',
	},
	// Loading container
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	// Empty state container
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 100,
	},
	// Empty state text
	emptyText: {
		fontSize: 18,
		fontWeight: '600',
		color: COLORS.textPrimary,
		marginTop: 16,
	},
	// Empty state subtext
	emptySubtext: {
		fontSize: 14,
		color: COLORS.textSecondary,
		marginTop: 8,
		textAlign: 'center',
		paddingHorizontal: 40,
	},
});
