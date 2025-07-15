import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, Text } from "react-native";

const massagesLayout = () => {
	return (

		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="messagesScreen" />
			<Stack.Screen name="[id]" />
			<Stack.Screen name="newChat" />
			{/* <Stack.Screen name="details" /> */}
		</Stack>
	)
};

export default massagesLayout;

const styles = StyleSheet.create({});
