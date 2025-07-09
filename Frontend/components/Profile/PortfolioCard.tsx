import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOWS } from "../../constants/Colors";

export interface PortfolioItem {
    id: string;
    image_url?: string;
    title?: string;
}

interface PortfolioCardProps {
    items: PortfolioItem[];
    onAdd?: () => void;
    onViewAll?: () => void;
    onItemPress?: (id: string) => void;
}

export default function PortfolioCard({ items, onAdd, onViewAll, onItemPress }: PortfolioCardProps) {
    // Ensure 6 tiles (3x2) for consistent grid; pad with null placeholders
    const tiles: (PortfolioItem | null)[] = [...items.slice(0, 5), null];

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>My Portfolio</Text>
                <TouchableOpacity onPress={onViewAll}>
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                {tiles.map((item, idx) => {
                    if (item) {
                        return (
                            <TouchableOpacity key={item.id} style={styles.tile} onPress={() => onItemPress?.(item.id)}>
                                {item.image_url ? <Image source={{ uri: item.image_url }} style={styles.image} /> : null}
                                {item.title?.startsWith("+") && (
                                    <View style={styles.overlay}>
                                        <Text style={styles.overlayText}>{item.title}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    }
                    // Add tile
                    return (
                        <TouchableOpacity key={`add-${idx}`} style={[styles.tile, styles.addTile]} onPress={onAdd}>
                            <Ionicons name="add" size={30} color={COLORS.accent} />
                        </TouchableOpacity>
                    );
                })}
            </View>
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
        ...SHADOWS.medium,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.textPrimary,
    },
    viewAll: {
        color: COLORS.accentTertiary,
        fontWeight: "600",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    tile: {
        width: "32%",
        aspectRatio: 1,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: COLORS.muted,
        marginBottom: 8,
    },
    addTile: {
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    overlayText: {
        color: COLORS.light,
        fontWeight: "bold",
        fontSize: 18,
    },
});
