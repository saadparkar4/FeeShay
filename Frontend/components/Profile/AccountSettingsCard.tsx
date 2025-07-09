import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOWS } from "../../constants/Colors";

interface Setting {
    id: string;
    title: string;
    icon: string;
}

interface AccountSettingsCardProps {
    onSelect: (id: string) => void;
}

const SETTINGS: Setting[] = [
    { id: "services", title: "My Services", icon: "briefcase" },
    { id: "jobs", title: "My Job Posts", icon: "document-text" },
    { id: "payment", title: "Payment Settings", icon: "card" },
    { id: "notifications", title: "Notifications Settings", icon: "notifications" },
    { id: "language", title: "Language & Currency", icon: "globe" },
];

export default function AccountSettingsCard({ onSelect }: AccountSettingsCardProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Account & Settings</Text>

            {SETTINGS.map((s) => (
                <TouchableOpacity key={s.id} style={styles.row} onPress={() => onSelect(s.id)}>
                    <View style={styles.iconWrap}>
                        <Ionicons name={s.icon as any} size={18} color={COLORS.accent} />
                    </View>
                    <Text style={styles.rowText}>{s.title}</Text>
                    <Ionicons name="chevron-forward" size={18} color={COLORS.placeholder} style={{ marginLeft: "auto" }} />
                </TouchableOpacity>
            ))}

            {/* Logout */}
            <TouchableOpacity style={[styles.row, styles.logoutRow]} onPress={() => onSelect("logout")}>
                <View style={styles.iconWrap}>
                    <Ionicons name="log-out" size={18} color={COLORS.error} />
                </View>
                <Text style={[styles.rowText, { color: COLORS.error }]}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.light,
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 32,
        ...SHADOWS.medium,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginBottom: 12,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    logoutRow: {
        borderBottomWidth: 0,
    },
    iconWrap: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.muted,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    rowText: {
        fontSize: 14,
        color: COLORS.textPrimary,
    },
});
