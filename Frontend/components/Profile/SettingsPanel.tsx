import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { COLORS } from "../../constants/Colors";
import { useLogout } from "../../src/hooks/useQueries";

interface SettingsPanelProps {
    onSettingPress: (setting: string) => void;
}

export default function SettingsPanel({ onSettingPress }: SettingsPanelProps) {
    const logoutMutation = useLogout();

    const handleLogout = async () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    try {
                        await logoutMutation.mutateAsync();
                    } catch (error) {
                        Alert.alert("Error", "Failed to logout");
                    }
                },
            },
        ]);
    };

    const settings = [
        {
            id: "account",
            title: "Account Settings",
            subtitle: "Manage your account information",
            icon: "👤",
        },
        {
            id: "notifications",
            title: "Notifications",
            subtitle: "Configure notification preferences",
            icon: "🔔",
        },
        {
            id: "privacy",
            title: "Privacy & Security",
            subtitle: "Manage your privacy settings",
            icon: "🔒",
        },
        {
            id: "payment",
            title: "Payment Methods",
            subtitle: "Manage your payment options",
            icon: "💳",
        },
        {
            id: "help",
            title: "Help & Support",
            subtitle: "Get help and contact support",
            icon: "❓",
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            <View style={styles.settingsList}>
                {settings.map((setting) => (
                    <TouchableOpacity key={setting.id} style={styles.settingItem} onPress={() => onSettingPress(setting.id)}>
                        <View style={styles.settingIcon}>
                            <Text style={styles.iconText}>{setting.icon}</Text>
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={styles.settingTitle}>{setting.title}</Text>
                            <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
                        </View>
                        <Text style={styles.chevron}>›</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.logoutSection}>
                <TouchableOpacity style={[styles.logoutButton, logoutMutation.isPending && styles.logoutButtonDisabled]} onPress={handleLogout} disabled={logoutMutation.isPending}>
                    {logoutMutation.isPending ? (
                        <ActivityIndicator size="small" color={COLORS.background} />
                    ) : (
                        <>
                            <Text style={styles.logoutIcon}>🚪</Text>
                            <Text style={styles.logoutText}>Logout</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
        borderRadius: 10,
        padding: 20,
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
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.dark,
        marginBottom: 15,
    },
    settingsList: {
        gap: 12,
    },
    settingItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: COLORS.muted,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    iconText: {
        fontSize: 18,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.dark,
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 14,
        color: COLORS.gray,
    },
    chevron: {
        fontSize: 18,
        color: COLORS.gray,
        fontWeight: "bold",
    },
    logoutSection: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.error,
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    logoutButtonDisabled: {
        opacity: 0.6,
    },
    logoutIcon: {
        fontSize: 16,
    },
    logoutText: {
        color: COLORS.background,
        fontSize: 16,
        fontWeight: "600",
    },
});
