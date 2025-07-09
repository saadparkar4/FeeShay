import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOWS } from "../../constants/Colors";
import { Profile } from "../../src/contexts/AuthContext";

interface HeaderCardProps {
    profile: Profile | null;
    onEdit?: () => void;
    onSwitchRole?: () => void;
}

export default function HeaderCard({ profile, onEdit, onSwitchRole }: HeaderCardProps) {
    if (!profile) return null;

    const role = (profile as any).role || "freelancer";
    const roleText = role === "freelancer" ? "Freelancer" : "Client";

    return (
        <View style={styles.container}>
            {/* Avatar & edit */}
            <View style={styles.avatarWrap}>
                <Image source={{ uri: profile.profile_image_url || "https://randomuser.me/api/portraits/lego/2.jpg" }} style={styles.avatar} />
                <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
                    <Ionicons name="camera" size={14} color={COLORS.light} />
                </TouchableOpacity>
            </View>

            {/* Name */}
            <Text style={styles.name}>{profile.name}</Text>

            {/* Role pill */}
            <LinearGradient colors={[COLORS.accent, COLORS.accentSecondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.rolePill}>
                <Text style={styles.rolePillText}>✨ {roleText}</Text>
            </LinearGradient>

            {/* Switch role button */}
            <TouchableOpacity style={styles.switchBtn} onPress={onSwitchRole}>
                <Text style={styles.switchBtnText}>{role === "freelancer" ? "Switch to Client" : "Switch to Freelancer"}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.light,
        borderRadius: 16,
        padding: 24,
        marginHorizontal: 16,
        marginTop: 16,
        alignItems: "center",
        ...SHADOWS.medium,
    },
    avatarWrap: {
        position: "relative",
        marginBottom: 12,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 4,
        borderColor: COLORS.accent,
    },
    editBtn: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.accent,
        borderRadius: 12,
        padding: 6,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    rolePill: {
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    rolePillText: {
        color: COLORS.light,
        fontSize: 14,
        fontWeight: "600",
    },
    switchBtn: {
        backgroundColor: COLORS.accentTertiary,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 18,
    },
    switchBtnText: {
        color: COLORS.light,
        fontWeight: "600",
    },
});
