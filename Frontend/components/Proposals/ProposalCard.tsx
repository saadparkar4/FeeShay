/**
 * ProposalCard Component
 *
 * Displays a proposal from a freelancer in a card format
 * Used in the proposals list screen to show multiple proposals
 *
 * Features:
 * - Freelancer avatar and basic info
 * - Project details and pricing
 * - Star rating display
 * - View details button to see full proposal
 */

import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";

// Interface defining the structure of a proposal
export interface Proposal {
    id: string; // Unique identifier
    freelancerName: string; // Name of the freelancer
    freelancerAvatar: string; // URL to freelancer's profile picture
    projectTitle: string; // Title of the project they're proposing for
    rating: number; // Freelancer's average rating (0-5)
    price: number; // Proposed price in currency units
    duration: string; // Estimated completion time (e.g., "14 days")
    description: string; // Brief proposal description
    status?: "active" | "completed" | "cancelled"; // Proposal status
}

// Props interface for the ProposalCard component
interface ProposalCardProps {
    proposal: Proposal; // The proposal data to display
    onViewDetails?: () => void; // Callback when view details is pressed
}

/**
 * ProposalCard Functional Component
 *
 * @param proposal - The proposal data to display
 * @param onViewDetails - Callback function when user wants to see full details
 */
export function ProposalCard({ proposal, onViewDetails }: ProposalCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                {/* Freelancer Avatar - Circular profile image */}
                <Image source={{ uri: proposal.freelancerAvatar }} style={styles.avatar} />

                <View style={styles.contentContainer}>
                    {/* Header Section - Name and rating */}
                    <View style={styles.header}>
                        <Text style={styles.freelancerName}>{proposal.freelancerName}</Text>
                        {/* Rating badge with star icon */}
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={14} color="#FFB800" />
                            <Text style={styles.rating}>{proposal.rating.toFixed(1)}</Text>
                        </View>
                    </View>

                    {/* Project Title - The job/project this proposal is for */}
                    <Text style={styles.projectTitle}>{proposal.projectTitle}</Text>

                    {/* Price and Duration Row - Key proposal metrics */}
                    <View style={styles.detailsRow}>
                        {/* Price display with dollar sign */}
                        <View style={styles.detailItem}>
                            {/* <Text style={styles.dollarSign}>$ </Text> */}
                            <MaterialCommunityIcons name="cash-multiple" size={14} color={COLORS.accentSecondary} />
                            <Text style={styles.detailValue}>{proposal.price} KD</Text>
                        </View>
                        {/* Duration display with clock icon
                        <View style={styles.detailItem}>
                            <Ionicons name="time-outline" size={14} color={COLORS.accentSecondary} />
                            <Text style={styles.detailValue}>{proposal.duration}</Text>
                        </View> */}
                    </View>

                    {/* Proposal Description - Limited to 2 lines for preview */}
                    <Text style={styles.description} numberOfLines={2}>
                        {proposal.description}
                    </Text>

                    {/* Call-to-Action Button - Opens detailed proposal view */}
                    <TouchableOpacity style={styles.viewDetailsButton} onPress={onViewDetails}>
                        <Text style={styles.viewDetailsButtonText}>View Details</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

// Styles for the ProposalCard component
const styles = StyleSheet.create({
    // Main card container with shadow and border
    card: {
        backgroundColor: COLORS.background,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#F3F4F6", // Light gray border
        // Shadow properties for iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        // Shadow for Android
        elevation: 2,
    },
    cardContent: {
        flexDirection: "row",
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    contentContainer: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    freelancerName: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.textPrimary,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    rating: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.textPrimary,
        marginLeft: 4,
    },
    projectTitle: {
        fontSize: 14,
        fontWeight: "500",
        color: "#374151",
        marginBottom: 8,
    },
    // Container for price and duration details
    detailsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 24, // Space between price and duration
        marginBottom: 8,
    },
    // Individual detail item (price or duration)
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    dollarSign: {
        fontSize: 12,
        color: COLORS.accentSecondary,
        marginRight: 2,
    },
    detailValue: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginLeft: 4,
    },
    description: {
        fontSize: 12,
        color: "#6B7280",
        lineHeight: 18,
        marginBottom: 12,
    },
    // View Details button styling - Primary CTA
    viewDetailsButton: {
        backgroundColor: COLORS.accent, // Primary accent color
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 24, // Rounded button
        alignItems: "center",
        justifyContent: "center",
    },
    viewDetailsButtonText: {
        color: COLORS.background,
        fontSize: 14,
        fontWeight: "600",
    },
});
