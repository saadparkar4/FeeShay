import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const proposalsLayout = () => {
    // return <Stack screenOptions={{ headerShown: false }} />;
    return (
        <Stack>
            <Stack.Screen name="proposal" options={{ headerShown: false }} />
            <Stack.Screen name="proposal/[id]" options={{ headerShown: false }} />
        </Stack>
    );
};

export default proposalsLayout;
//
const styles = StyleSheet.create({});
