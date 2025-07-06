import React, { useState, useEffect } from "react";
import { View, Text, Switch, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Model for a single setting item
type SettingItem = {
	id: string; // Unique identifier for the setting
	icon: keyof typeof Ionicons.glyphMap; // Icon name from Ionicons
	iconColor: string; // Icon color
	label: string; // Display label
	type: "switch" | "text" | "action"; // Type of setting
	value?: boolean | string; // Value for switch/text
	action?: () => void; // Action for action type
	textValue?: string; // For text type
	actionLabel?: string; // For action type (e.g., Logout)
};

// Dummy data for settings
const dummySettings: SettingItem[] = [
	{
		id: "notifications",
		icon: "notifications",
		iconColor: "deeppink",
		label: "Notifications",
		type: "switch",
		value: true,
	},
	{
		id: "language",
		icon: "language",
		iconColor: "purple",
		label: "Language",
		type: "text",
		textValue: "English",
	},
	{
		id: "logout",
		icon: "log-out-outline",
		iconColor: "crimson",
		label: "Logout",
		type: "action",
		actionLabel: "Logout.",
		// action: () => {/* handle logout */},
	},
];

// Reusable component for a single setting row
const SettingRow: React.FC<{ item: SettingItem }> = ({ item }) => {
	switch (item.type) {
		case "switch":
			return (
				<View style={styles.settingRow}>
					<Ionicons name={item.icon} size={20} color={item.iconColor} />
					<Text style={styles.settingLabel}>{item.label}</Text>
					<Switch style={{ marginLeft: "auto" }} value={!!item.value} />
				</View>
			);
		case "text":
			return (
				<View style={styles.settingRow}>
					<Ionicons name={item.icon} size={20} color={item.iconColor} />
					<Text style={styles.settingLabel}>{item.label}</Text>
					<Text style={{ marginLeft: "auto" }}>{item.textValue}</Text>
				</View>
			);
		case "action":
			return (
				<Pressable style={styles.settingRow} onPress={item.action}>
					<Ionicons name={item.icon} size={20} color={item.iconColor} />
					<Text style={[styles.settingLabel, { color: item.iconColor, fontWeight: "bold" }]}>{item.actionLabel || item.label}</Text>
				</Pressable>
			);
		default:
			return null;
	}
};

const SettingsPanel: React.FC = () => {
	// State for settings data
	const [settings, setSettings] = useState<SettingItem[]>(dummySettings);

	// --- Uncomment below to fetch from a Mongoose/MongoDB backend ---
	/*
  useEffect(() => {
    // Example fetch from backend API endpoint
    fetch("http://localhost:5000/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error("Failed to fetch settings:", err));
  }, []);
  */

	return (
		<View style={{ marginBottom: 32 }}>
			<Text style={styles.header}>Settings</Text>
			{/* Render each setting dynamically */}
			{settings.map((item) => (
				<SettingRow key={item.id} item={item} />
			))}
		</View>
	);
};

// Styles for the settings panel and rows
const styles = StyleSheet.create({
	header: {
		fontWeight: "bold",
		fontSize: 16,
		marginBottom: 12,
	},
	settingRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	settingLabel: {
		marginLeft: 12,
		fontSize: 14,
	},
});

export default SettingsPanel;
