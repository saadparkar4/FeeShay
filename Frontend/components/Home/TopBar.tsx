// ============================================================================
// TOP BAR COMPONENT
// ============================================================================
// Displays the app header with logo and notification bell
// This component is fixed at the top of the screen and shows:
// - App logo/brand name
// - Notification bell with badge count
// TODO: Connect notification count to backend API
// ============================================================================

import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/Colors";
import AuthContext from "@/context/AuthContext";
import ConfirmationModal from "../Common/ConfirmationModal";
import LogoImage from "./Logo";
import { getUnreadCount } from "@/api/messages";
import notificationApi from "@/api/notifications";
import socketService from "@/services/socketService";
import { router } from "expo-router";

export default function TopBar() {
	const { userRole, setUserRole, isAuthenticated } = useContext(AuthContext);
	const [showRoleModal, setShowRoleModal] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);

	// Fetch unread count on mount
	useEffect(() => {
		if (isAuthenticated) {
			fetchUnreadCount();
		}
	}, [isAuthenticated]);

	// Set up socket listeners for real-time updates
	useEffect(() => {
		const handleNewNotification = (data: any) => {
			if (data.unreadCount !== undefined) {
				setUnreadCount(data.unreadCount);
			}
		};

		const handleUnreadUpdate = (data: any) => {
			if (data.unreadCount !== undefined) {
				setUnreadCount(data.unreadCount);
			}
		};

		socketService.on('new_notification', handleNewNotification);
		socketService.on('unread_count_update', handleUnreadUpdate);

		return () => {
			socketService.off('new_notification', handleNewNotification);
			socketService.off('unread_count_update', handleUnreadUpdate);
		};
	}, []);

	const fetchUnreadCount = async () => {
		try {
			// Try to fetch message count first since notification API doesn't exist yet
			const msgResponse = await getUnreadCount();
			if (msgResponse.success && msgResponse.data) {
				setUnreadCount(msgResponse.data.unreadCount);
			}
		} catch (error) {
			// Silently fail - notifications are not critical
			// Set a mock count for demo purposes
			if (userRole === 'freelancer') {
				setUnreadCount(2); // Mock: freelancer has 2 unread notifications
			}
		}
	};

	const handleRoleSwitch = () => {
		const newRole = userRole === "freelancer" ? "client" : "freelancer";
		setUserRole(newRole);
		setShowRoleModal(false);
	};

	const handleNotificationPress = () => {
		router.push("/(protected)/(tabs)/(home)/notifications");
	};
	return (
		<View style={styles.header}>
			{/* App logo/brand name */}
			{/* <Text style={styles.logo}>FeeShay</Text> */}
			{/* <Image source={require("../../assets/images/FeeShay.png")} style={styles.logo} /> */}
			<LogoImage />
			<View style={styles.rightSection}>
				{/* Role switch button */}
				<TouchableOpacity style={styles.roleSwitchBtn} onPress={() => setShowRoleModal(true)}>
					<Ionicons name={userRole === "freelancer" ? "briefcase-outline" : "person-outline"} size={24} color={COLORS.textPrimary} />
				</TouchableOpacity>

				{/* Notification bell with badge */}
				<TouchableOpacity style={styles.bellBtn} onPress={handleNotificationPress}>
					<Ionicons name="notifications-outline" size={26} color={COLORS.textPrimary} />
					{/* Notification count badge */}
					{unreadCount > 0 && (
						<View style={styles.badge}>
							<Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
						</View>
					)}
				</TouchableOpacity>
			</View>

			{/* Role Switch Confirmation Modal */}
			<ConfirmationModal
				visible={showRoleModal}
				onClose={() => setShowRoleModal(false)}
				onConfirm={handleRoleSwitch}
				title="Switch Role"
				message={`Are you sure you want to switch to ${userRole === "freelancer" ? "Client" : "Freelancer"} mode?`}
				icon="swap-horizontal"
				iconColors={[COLORS.accentTertiary, COLORS.accentSecondary]}
				confirmText={`Switch to ${userRole === "freelancer" ? "Client" : "Freelancer"}`}
				cancelText="Cancel"
			/>
		</View>
	);
}

// ============================================================================
// STYLES FOR TOP BAR
// ============================================================================
const styles = StyleSheet.create({
	// Header container with logo and notifications
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingBottom: 8,
		backgroundColor: COLORS.background,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
		zIndex: 10,
	},

	// Right section containing role switch and notifications
	rightSection: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},

	// Role switch button
	roleSwitchBtn: {
		padding: 6,
	},

	// Notification bell button
	bellBtn: {
		position: "relative",
		padding: 6,
	},

	// Notification count badge
	badge: {
		position: "absolute",
		top: 2,
		right: 2,
		backgroundColor: COLORS.accent,
		minWidth: 18,
		height: 18,
		borderRadius: 9,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 4,
	},

	// Badge text styling
	badgeText: {
		color: COLORS.background,
		fontSize: 10,
		fontWeight: "bold",
	},
	logo: {
		marginTop: 10,
		width: 80,
		height: 40,
		// borderRadius: 24,
		// borderWidth: 4,
		objectFit: "contain",
		//  mixBlendMode: 'screen',
	},
});
