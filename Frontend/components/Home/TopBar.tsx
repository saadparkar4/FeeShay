// ============================================================================
// TOP BAR COMPONENT
// ============================================================================
// Displays the app header with logo and notification bell
// This component is fixed at the top of the screen and shows:
// - App logo/brand name
// - Notification bell with badge count
// TODO: Connect notification count to backend API
// ============================================================================

import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/Colors";
import AuthContext from "@/context/AuthContext";
import ConfirmationModal from "../Common/ConfirmationModal";
import LogoImage from "./Logo";

export default function TopBar() {
	const { userRole, setUserRole } = useContext(AuthContext);
	const [showRoleModal, setShowRoleModal] = useState(false);

	const handleRoleSwitch = () => {
		const newRole = userRole === "freelancer" ? "client" : "freelancer";
		setUserRole(newRole);
		setShowRoleModal(false);
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
				<TouchableOpacity style={styles.bellBtn}>
					<Ionicons name="notifications-outline" size={26} color={COLORS.textPrimary} />
					{/* Notification count badge - TODO: Get from backend */}
					<View style={styles.badge}>
						<Text style={styles.badgeText}>3</Text>
					</View>
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
		width: 16,
		height: 16,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
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
