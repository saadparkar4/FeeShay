import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileHeader from "../components/ProfileHeader";
import PersonalDetails from "../components/PersonalDetails";
import JobPostCard from "../components/JobPostCard";
import RatingsAndReviews from "../components/RatingsAndReviews";
import SettingsPanel from "../components/SettingsPanel";

const ProfileScreen = () => {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={{ padding: 16 }}>
				{" "}
				<ProfileHeader /> <PersonalDetails /> <JobPostCard /> <RatingsAndReviews /> <SettingsPanel />{" "}
			</ScrollView>{" "}
		</SafeAreaView>
	);
};

export default ProfileScreen;
