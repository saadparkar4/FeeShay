import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const profileLayout = () => {
    return <Stack screenOptions={{ headerShown: true, headerTitle: "Profile" }} />;
};

export default profileLayout;

const styles = StyleSheet.create({});
