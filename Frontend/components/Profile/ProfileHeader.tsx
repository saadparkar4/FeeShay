import React, { useState, useEffect } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Model for user profile data
interface UserProfile {
	name: string; // User's full name
	title: string; // Professional title
	avatarUrl: string; // Profile image URL
	bio: string; // Short bio/description
}

// Dummy data for user profile
const dummyProfile: UserProfile = {
	name: "Alex Morgan",
	title: "Digital Marketing Specialist",
	avatarUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg",
	bio: "Experienced marketing professional with expertise in digital campaigns, SEO, and content strategy. Looking for talented freelancers to help grow my business.",
};

const ProfileHeader: React.FC = () => {
	// State for profile data
	const [profile, setProfile] = useState<UserProfile>(dummyProfile);

	// --- Uncomment below to fetch from a Mongoose/MongoDB backend ---
	/*
  useEffect(() => {
    fetch("http://localhost:5000/api/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Failed to fetch profile:", err));
  }, []);
  */

	return (
		<View style={styles.container}>
			<View style={styles.innerContainer}>
				<View>
					{/* Profile image */}
					<Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
					{/* Edit avatar button */}
					<Pressable
						style={styles.editAvatarBtn}
						// onPress={() => {/* handle avatar change */}}
					>
						<Ionicons name="camera" size={16} color="#333" />
					</Pressable>
				</View>
				{/* User name */}
				<Text style={styles.name}>{profile.name}</Text>
				{/* User title */}
				<Text style={styles.title}>{profile.title}</Text>
				{/* User bio */}
				<Text style={styles.bio}>{profile.bio}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		marginBottom: 24,
	},
	innerContainer: {
		display: "flex",
		alignItems: "center",
		marginBottom: 24,
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
	},
	editAvatarBtn: {
		position: "absolute",
		bottom: 0,
		right: 75,
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 4,
	},
	name: {
		fontWeight: "bold",
		fontSize: 20,
		marginTop: 12,
	},
	title: {
		color: "gray",
		marginBottom: 6,
	},
	bio: {
		textAlign: "center",
		color: "#555",
		paddingHorizontal: 16,
	},
});
//
export default ProfileHeader;
