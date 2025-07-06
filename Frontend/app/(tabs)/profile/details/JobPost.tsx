import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { jobPosts, JobPost } from "../../../../dummyData";
import { Feather } from "@expo/vector-icons";

const statusColors: Record<string, string> = {
    Active: "#B6F5C3",
    Completed: "#E5E7EB",
    "In Progress": "#FFF3B0",
};

const statusTextColors: Record<string, string> = {
    Active: "#1BA94C",
    Completed: "#6B7280",
    "In Progress": "#B68900",
};

function StatusBadge({ status }: { status: string }) {
    return (
        <View style={[styles.statusBadge, { backgroundColor: statusColors[status] || "#E5E7EB" }]}>
            <Text style={[styles.statusText, { color: statusTextColors[status] || "#6B7280" }]}>{status}</Text>
        </View>
    );
}

function JobCard({ job }: { job: JobPost }) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.title}>{job.title}</Text>
                <StatusBadge status={job.status} />
            </View>
            <Text style={styles.description}>{job.description}</Text>
            <View style={styles.cardFooter}>
                <Text style={styles.dateLabel}>
                    {job.dateLabel} <Text style={styles.dateValue}>{job.dateValue}</Text>
                </Text>
                <View style={styles.actionsRow}>
                    {job.actions.map((action) => (
                        <TouchableOpacity key={action.label} style={styles.actionBtn}>
                            <Feather name={action.icon as any} size={18} color="#4B5563" style={{ marginRight: 6 }} />
                            <Text style={styles.actionText}>{action.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
}

export default function JobPostPage() {
    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>My Job Posts</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAll}>
                        View All <Feather name="chevron-right" size={16} color="#6366F1" />
                    </Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={jobPosts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <JobCard job={item} />}
                contentContainerStyle={{ paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#222",
    },
    viewAll: {
        color: "#6366F1",
        fontWeight: "600",
        fontSize: 15,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        borderWidth: 1,
        borderColor: "#F3F4F6",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    title: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#222",
        flex: 1,
    },
    statusBadge: {
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 2,
        alignSelf: "flex-start",
        marginLeft: 8,
    },
    statusText: {
        fontSize: 13,
        fontWeight: "600",
    },
    description: {
        color: "#4B5563",
        fontSize: 15,
        marginBottom: 12,
        marginTop: 2,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dateLabel: {
        color: "#6B7280",
        fontSize: 13,
    },
    dateValue: {
        fontWeight: "600",
        color: "#222",
    },
    actionsRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginLeft: 8,
    },
    actionText: {
        color: "#4B5563",
        fontWeight: "600",
        fontSize: 15,
    },
});
