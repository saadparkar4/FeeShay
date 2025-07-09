import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOWS } from "../../constants/Colors";
import { Profile } from "../../src/contexts/AuthContext";

interface BioCardProps {
    profile: Profile | null;
}

interface TagPillProps {
    text: string;
    bg: string;
    color: string;
}

function TagPill({ text, bg, color }: TagPillProps) {
    return (
        <View style={[styles.tagPill, { backgroundColor: bg }]}>
            <Text style={[styles.tagPillText, { color }]}>{text}</Text>
        </View>
    );
}

/**
 * BioCard displays bio, skills, location, memberSince, languages
 */
export default function BioCard({ profile }: BioCardProps) {
    if (!profile) return null;

    const skills = profile.skills?.slice(0, 4) || ["UI/UX Design", "Branding", "Illustration", "Logo Design"];
    const colors = [
        { bg: "#F8D7F9", color: COLORS.accent },
        { bg: "#E0E7FF", color: COLORS.accentSecondary },
        { bg: "#E0F2FE", color: COLORS.accentTertiary },
        { bg: "#FDE68A", color: "#F59E42" },
    ];

    return (
        <View style={styles.container}>
            {/* Bio text */}
            {profile.bio && <Text style={styles.bioText}>{profile.bio} 🌻</Text>}

            {/* Skill tags */}
            <View style={styles.tagsRow}>
                {skills.map((skill, idx) => (
                    <TagPill key={skill} text={skill} bg={colors[idx % colors.length].bg} color={colors[idx % colors.length].color} />
                ))}
            </View>

            {/* Meta rows */}
            {profile.location && (
                <View style={styles.metaRow}>
                    <Ionicons name="location-sharp" size={16} color={COLORS.accent} style={styles.metaIcon} />
                    <Text style={styles.metaText}>{profile.location}</Text>
                </View>
            )}
            {profile.member_since && (
                <View style={styles.metaRow}>
                    <Ionicons name="calendar" size={16} color={COLORS.accentSecondary} style={styles.metaIcon} />
                    <Text style={styles.metaText}>Member since {new Date(profile.member_since).toLocaleString("en-US", { month: "long", year: "numeric" })}</Text>
                </View>
            )}
            {profile.languages && profile.languages.length > 0 && (
                <View style={styles.metaRow}>
                    <Ionicons name="language" size={16} color={COLORS.accentTertiary} style={styles.metaIcon} />
                    <Text style={styles.metaText}>{profile.languages.join(", ")}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.light,
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 16,
        marginTop: 16,
        ...SHADOWS.medium,
    },
    bioText: {
        fontSize: 15,
        color: COLORS.textPrimary,
        marginBottom: 12,
        lineHeight: 21,
    },
    tagsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 12,
    },
    tagPill: {
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    tagPillText: {
        fontSize: 13,
        fontWeight: "600",
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    metaIcon: {
        marginRight: 6,
    },
    metaText: {
        fontSize: 14,
        color: COLORS.textPrimary,
    },
});
