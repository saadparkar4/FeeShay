import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { COLORS } from "../../constants/Colors";
import { useJobs } from "../../src/hooks/useQueries";

interface JobPostCardProps {
    onJobPress: (jobId: string) => void;
}

export default function JobPostCard({ onJobPress }: JobPostCardProps) {
    const { data: jobsData, isLoading, error, refetch } = useJobs();

    const handleRefresh = async () => {
        try {
            await refetch();
        } catch (error) {
            Alert.alert("Error", "Failed to refresh jobs data");
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading your jobs...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Failed to load your jobs</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const jobs = (jobsData as any)?.data?.data || [];

    if (jobs.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>No Jobs Posted</Text>
                    <Text style={styles.emptyText}>You haven&apos;t posted any jobs yet.</Text>
                    <TouchableOpacity style={styles.createJobButton}>
                        <Text style={styles.createJobButtonText}>Create Your First Job</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Jobs</Text>
                <TouchableOpacity style={styles.seeAllButton}>
                    <Text style={styles.seeAllButtonText}>See All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.jobsList}>
                {jobs.slice(0, 3).map((job: any) => (
                    <TouchableOpacity key={job._id} style={styles.jobCard} onPress={() => onJobPress(job._id)}>
                        <View style={styles.jobHeader}>
                            <Text style={styles.jobTitle} numberOfLines={1}>
                                {job.title}
                            </Text>
                            <View
                                style={[styles.statusBadge, job.status === "active" ? styles.activeBadge : job.status === "completed" ? styles.completedBadge : styles.draftBadge]}
                            >
                                <Text style={styles.statusText}>{job.status === "active" ? "Active" : job.status === "completed" ? "Completed" : "Draft"}</Text>
                            </View>
                        </View>

                        <Text style={styles.jobDescription} numberOfLines={2}>
                            {job.description}
                        </Text>

                        <View style={styles.jobFooter}>
                            <Text style={styles.budget}>
                                Budget: ${job.budget_min} - ${job.budget_max}
                            </Text>
                            <Text style={styles.category}>{job.category}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {jobs.length > 3 && (
                <TouchableOpacity style={styles.viewMoreButton}>
                    <Text style={styles.viewMoreButtonText}>View {jobs.length - 3} more jobs</Text>
                </TouchableOpacity>
            )}
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
    emptyContainer: {
        alignItems: "center",
        padding: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.dark,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.gray,
        textAlign: "center",
        marginBottom: 15,
    },
    createJobButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    createJobButtonText: {
        color: COLORS.background,
        fontSize: 14,
        fontWeight: "600",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.dark,
    },
    seeAllButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    seeAllButtonText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: "600",
    },
    jobsList: {
        gap: 12,
    },
    jobCard: {
        backgroundColor: COLORS.muted,
        borderRadius: 8,
        padding: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    jobHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.dark,
        flex: 1,
        marginRight: 10,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    activeBadge: {
        backgroundColor: COLORS.success,
    },
    completedBadge: {
        backgroundColor: COLORS.gray,
    },
    draftBadge: {
        backgroundColor: COLORS.warning,
    },
    statusText: {
        fontSize: 10,
        fontWeight: "600",
        color: COLORS.background,
    },
    jobDescription: {
        fontSize: 14,
        color: COLORS.gray,
        marginBottom: 10,
        lineHeight: 20,
    },
    jobFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    budget: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: "600",
    },
    category: {
        fontSize: 12,
        color: COLORS.gray,
        backgroundColor: COLORS.background,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    viewMoreButton: {
        alignItems: "center",
        marginTop: 15,
        paddingVertical: 10,
    },
    viewMoreButtonText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: "600",
    },
});
