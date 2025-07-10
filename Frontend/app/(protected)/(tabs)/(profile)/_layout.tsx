import { Stack } from "expo-router";
import React from "react";
// import { StyleSheet } from "react-native";

const profileLayout = () => {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="profileScreen" />
			<Stack.Screen name="details" />
		</Stack>
	);
};

export default profileLayout;

