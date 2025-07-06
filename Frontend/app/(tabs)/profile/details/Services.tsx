import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { services, Service } from "../../../../dummyData";
import { Feather } from "@expo/vector-icons";

function ServiceCard({ service }: { service: Service }) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.title}>{service.title}</Text>
            </View>
            <Text style={styles.description}>{service.description}</Text>
            <View style={styles.cardFooter}>
                <Text style={styles.dateLabel}>
                    {service.dateLabel} <Text style={styles.dateValue}>{service.dateValue}</Text>
                </Text>
                <View style={styles.actionsRow}>
                    {service.actions.map((action) => (
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

export default function ServicesScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>My Services</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAll}>
                        View All <Feather name="chevron-right" size={16} color="#6366F1" />
                    </Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={services}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ServiceCard service={item} />}
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
