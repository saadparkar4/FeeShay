import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { MessageListItem } from "../../../components/Messages/MessageListItem";
import { messages } from "../../../models/dummyData";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Index() {
    const [allMessages, setAllMessages] = useState(messages);

    const addNewChat = () => {
        const newMessage = {
            id: (allMessages.length + 1).toString(),
            user: {
                name: "New Contact",
                avatar: undefined,
                isOnline: true,
            },
            message: "Start a new conversation...",
            time: "Now",
            isUnread: false,
        };
        setAllMessages([newMessage, ...allMessages]);
    };

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
                {allMessages.map((message) => (
                    <TouchableOpacity
                        key={message.id}
                        onPress={() => {
                            router.push({ pathname: "./messages/[id]", params: { id: message.id } });
                        }}
                    >
                        <MessageListItem message={message} />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity style={styles.addButton} onPress={addNewChat} activeOpacity={0.8}>
                <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
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
    addButton: {
        position: "absolute",
        bottom: 30,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#FF2D8B",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});
