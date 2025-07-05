import { router } from "expo-router";
import React from "react";
import { View, Text, Button } from "react-native";

export default function ProfileTab() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Profile Tab</Text>
            <Button title="Job Post" onPress={() => router.push("./details/JobPost ")} />
            <Button title="Services" onPress={() => router.push("./details/Services")} />
        </View>
    );
}
