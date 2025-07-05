import React from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { MessageListItem } from "../../../components/MessageListItem";
import { messages } from "../../../dummyData";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Index() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Messages</Text>
                <TouchableOpacity style={styles.notificationIcon} activeOpacity={0.7}>
                    <Ionicons name="notifications-outline" size={28} color="#FF2D8B" />
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>1</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView>
                <TouchableOpacity>
                    <MessageListItem message={messages[0]} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <MessageListItem message={messages[1]} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <MessageListItem message={messages[2]} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <MessageListItem message={messages[3]} />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#F2F2F2",
        backgroundColor: "#fff",
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#222",
    },
    notificationIcon: {
        position: "relative",
        padding: 4,
    },
    badge: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#FF2D8B",
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 4,
    },
    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
});
