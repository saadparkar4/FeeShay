import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, Text } from "react-native";

const massagesLayout = () => {
	return (

		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Messages" />
			{/* <Stack.Screen name="details" /> */}
		</Stack>
	)
};

export default massagesLayout;

const styles = StyleSheet.create({});
