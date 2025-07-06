import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Model for personal details
interface PersonalDetailsModel {
	location: string; // User's location
	languages: string[]; // List of languages
	memberSince: string; // Membership date
}
//
// Dummy data for personal details
const dummyDetails: PersonalDetailsModel = {
	location: "New York, United States",
	languages: ["English (Native)", "Spanish (Fluent)", "French (Basic)"],
	memberSince: "March 2022",
};

const PersonalDetails: React.FC = () => {
	// State for personal details
	const [details, setDetails] = useState<PersonalDetailsModel>(dummyDetails);

	// --- Uncomment below to fetch from a Mongoose/MongoDB backend ---
	/*
	useEffect(() => {
		fetch("http://localhost:5000/api/personal-details")
			.then((res) => res.json())
			.then((data) => setDetails(data))
			.catch((err) => console.error("Failed to fetch personal details:", err));
	}, []);
	*/

	return (
		<View style={styles.container}>
			{/* Personal Details header */}
			<Text style={styles.header}>Personal Details</Text>
			{/* Location row */}
			<View style={styles.locationRow}>
				<Ionicons name="location" size={16} color="purple" />
				<Text style={styles.locationText}>{details.location}</Text>
			</View>
			{/* Languages row */}
			<Text style={styles.languagesHeader}>Languages</Text>
			<View style={styles.languagesRow}>
				{details.languages.map((lang, idx) => (
					<Text key={idx} style={styles.languageBadge}>
						{lang}
					</Text>
				))}
			</View>
			{/* Member since row */}
			<View style={styles.memberRow}>
				<Ionicons name="calendar" size={16} color="purple" />
				<Text style={styles.memberText}>Member since {details.memberSince}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 24,
	},
	header: {
		fontWeight: "bold",
		fontSize: 16,
		marginBottom: 8,
	},
	locationRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 4,
	},
	locationText: {
		marginLeft: 6,
	},
	languagesHeader: {
		marginTop: 8,
		marginBottom: 4,
		fontWeight: "600",
	},
	languagesRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	languageBadge: {
		backgroundColor: "#f2f2f2",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		fontSize: 12,
		marginRight: 6,
	},
	memberRow: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 10,
	},
	memberText: {
		marginLeft: 6,
	},
});

export default PersonalDetails;
