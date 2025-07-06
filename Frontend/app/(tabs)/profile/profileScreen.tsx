import React from "react";
import { Button, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileHeader from "../../../components/Profile/ProfileHeader";
import PersonalDetails from "../../../components/Profile/PersonalDetails";
import JobPostCard from "../../../components/Profile/JobPostCard";
import RatingsAndReviews from "../../../components/Profile/RatingsAndReviews";
import SettingsPanel from "../../../components/Profile/SettingsPanel";
import { router } from "expo-router";
//
const ProfileScreen = () => {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={{ padding: 16 }}>
				{" "}
				<ProfileHeader /> <PersonalDetails /> <JobPostCard /> <RatingsAndReviews /> <SettingsPanel />{" "}
				<Button title="Job Post" onPress={() => router.push("./details/JobPost ")} />
				<Button title="Services" onPress={() => router.push("./details/Services")} />
			</ScrollView>{" "}
		</SafeAreaView>
	);
};

export default ProfileScreen;
