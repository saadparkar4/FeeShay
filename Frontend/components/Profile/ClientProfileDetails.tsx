import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";

interface ClientProfileDetailsProps {
    profile?: any;
    stats?: {
        jobsPosted: number;
        totalSpent: number;
        activeJobs: number;
    };
}

const ClientProfileDetails: React.FC<ClientProfileDetailsProps> = ({ profile, stats }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "KWD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date: string | Date) => {
        if (!date) return "Recently";
        const d = new Date(date);
        return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Client Details</Text>

            {/* Bio/Description */}
            {profile?.bio && (
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>{profile.bio}</Text>
                </View>
            )}

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
                <View style={[styles.statCard, { backgroundColor: COLORS.accent + "15" }]}>
                    <View style={[styles.statIconContainer, { backgroundColor: COLORS.accent + "25" }]}>
                        <Ionicons name="briefcase-outline" size={24} color={COLORS.accent} />
                    </View>
                    <Text style={styles.statValue}>{stats?.jobsPosted || 0}</Text>
                    <Text style={styles.statLabel}>Jobs Posted</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: COLORS.accentSecondary + "15" }]}>
                    <View style={[styles.statIconContainer, { backgroundColor: COLORS.accentSecondary + "25" }]}>
                        <Ionicons name="cash-outline" size={24} color={COLORS.accentSecondary} />
                    </View>
                    <Text style={styles.statValue}>{formatCurrency(stats?.totalSpent || 0)}</Text>
                    <Text style={styles.statLabel}>Total Spent</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: COLORS.accentTertiary + "15" }]}>
                    <View style={[styles.statIconContainer, { backgroundColor: COLORS.accentTertiary + "25" }]}>
                        <Ionicons name="rocket-outline" size={24} color={COLORS.accentTertiary} />
                    </View>
                    <Text style={styles.statValue}>{stats?.activeJobs || 0}</Text>
                    <Text style={styles.statLabel}>Active Jobs</Text>
                </View>
            </View>

            {/* Client Info */}
            <View style={styles.infoContainer}>
                {profile?.location && (
                    <View style={styles.infoItem}>
                        <View style={[styles.iconContainer, { backgroundColor: COLORS.accent + "20" }]}>
                            <Ionicons name="location-outline" size={16} color={COLORS.accent} />
                        </View>
                        <Text style={styles.infoText}>{profile.location}</Text>
                    </View>
                )}

                <View style={styles.infoItem}>
                    <View style={[styles.iconContainer, { backgroundColor: COLORS.accentSecondary + "20" }]}>
                        <Ionicons name="calendar-outline" size={16} color={COLORS.accentSecondary} />
                    </View>
                    <Text style={styles.infoText}>Client since {formatDate(profile?.client_since)}</Text>
                </View>

                {profile?.languages && profile.languages.length > 0 && (
                    <View style={styles.infoItem}>
                        <View style={[styles.iconContainer, { backgroundColor: COLORS.accentTertiary + "20" }]}>
                            <Ionicons name="globe-outline" size={16} color={COLORS.accentTertiary} />
                        </View>
                        <Text style={styles.infoText}>{profile.languages.join(", ")}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
        borderRadius: 24,
        padding: 20,
        marginHorizontal: 20,
        marginTop: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginBottom: 16,
    },
    descriptionContainer: {
        marginBottom: 20,
    },
    description: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        alignItems: "center",
        padding: 16,
        borderRadius: 16,
        marginHorizontal: 4,
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: COLORS.textSecondary,
        textAlign: "center",
    },
    infoContainer: {
        gap: 12,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    infoText: {
        fontSize: 14,
        color: COLORS.textPrimary,
        flex: 1,
    },
});

export default ClientProfileDetails;
