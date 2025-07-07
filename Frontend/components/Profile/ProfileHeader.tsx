import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { COLORS } from "../../constants/Colors";
import { useProfile } from "../../src/hooks/useQueries";

interface ProfileHeaderProps {
    onEditPress: () => void;
}

export default function ProfileHeader({ onEditPress }: ProfileHeaderProps) {
    const { data: profileData, isLoading, error, refetch } = useProfile();

    const handleRefresh = async () => {
        try {
            await refetch();
        } catch (error) {
            Alert.alert("Error", "Failed to refresh profile data");
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Failed to load profile</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const profile = (profileData as any)?.data;

    if (!profile) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No profile data available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Image source={profile.profile_image_url ? { uri: profile.profile_image_url } : require("../../assets/images/icon.png")} style={styles.avatar} />
                    <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{profile.name || "No Name"}</Text>
                    <Text style={styles.role}>{profile.role === "freelancer" ? "Freelancer" : "Client"}</Text>
                    <Text style={styles.email}>{profile.email}</Text>
                    {profile.location && <Text style={styles.location}>📍 {profile.location}</Text>}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 20,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loadingContainer: {
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.gray,
    },
    errorContainer: {
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: COLORS.error,
        textAlign: "center",
        marginBottom: 10,
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: COLORS.background,
        fontSize: 14,
        fontWeight: "600",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatarContainer: {
        position: "relative",
        marginRight: 15,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: COLORS.primary,
    },
    editButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    editButtonText: {
        color: COLORS.background,
        fontSize: 10,
        fontWeight: "600",
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.dark,
        marginBottom: 4,
    },
    role: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: "600",
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: COLORS.gray,
        marginBottom: 4,
    },
    location: {
        fontSize: 14,
        color: COLORS.gray,
    },
});
