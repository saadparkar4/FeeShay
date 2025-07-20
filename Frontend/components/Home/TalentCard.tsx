// ============================================================================
// TALENT CARD COMPONENT
// ============================================================================
// Displays individual freelancer/talent information in a card format
// Features:
// - Profile avatar image
// - Name, title, and location information
// - Star rating display
// - Hourly rate information
// - View profile button
// - Responsive layout with proper spacing
// TODO: Add navigation to talent profile page
// TODO: Add loading states for avatar images
// TODO: Add error handling for broken image URLs
// ============================================================================

import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/Colors";
import { useRouter } from "expo-router";
import ConfirmationModal from "../Common/ConfirmationModal";
import AuthContext from "@/context/AuthContext";

// Talent data interface
interface Talent {
    id: string; // Unique identifier
    name: string; // Full name of the talent
    title: string; // Professional title/role
    location?: string; // City and country (optional)
    rating: number; // Star rating (0-5)
    reviewCount: number; // Number of reviews
    price: number; // Starting rate in USD
    avatar: string; // Profile image URL
    category: string; // Professional category
    skills: string[]; // Array of skills
}

// Props interface for TalentCard component
interface TalentCardProps {
    talent: Talent; // Talent data object
    borderColor?: string; // Optional border color
}

export default function TalentCard({ talent, borderColor }: TalentCardProps) {
    const router = useRouter();
    const [showHireModal, setShowHireModal] = useState(false);
    const { isAuthenticated } = useContext(AuthContext);

    // Determine skill tag colors based on index
    const getSkillColor = (index: number) => {
        const colors = [
            { bg: `${COLORS.accent}20`, text: COLORS.accent },
            { bg: `${COLORS.accentSecondary}20`, text: COLORS.accentSecondary },
            { bg: `${COLORS.accentTertiary}20`, text: COLORS.accentTertiary },
        ];
        return colors[index % colors.length];
    };

    const handleHireClick = () => {
        if (!isAuthenticated) {
            // Redirect to signup if not authenticated
            router.push("/Register");
        } else {
            setShowHireModal(true);
        }
    };

    const handleViewProfileClick = () => {
        if (!isAuthenticated) {
            // Redirect to signup if not authenticated
            router.push("/Register");
        } else {
            // Navigate to profile page
            // TODO: Implement profile navigation
        }
    };

    return (
        <>
            <View style={[styles.talentCard, borderColor && { borderColor: `${borderColor}20` }]}>
                <View style={styles.mainContent}>
                    {/* Profile avatar image */}
                    {talent.avatar && talent.avatar.trim() !== "" ? (
                        <Image source={{ uri: talent.avatar }} style={[styles.avatar, borderColor && { borderColor: `${borderColor}30` }]} />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder, borderColor && { borderColor: `${borderColor}30` }]}>
                            {/* <Text style={styles.avatarText}>{talent.name.charAt(0).toUpperCase()}</Text> */}
                            <Text style={styles.avatarText}>{talent.name ? talent.name.charAt(0).toUpperCase() : "?"}</Text>
                        </View>
                    )}

                    {/* Content area */}
                    <View style={styles.content}>
                        {/* Header section */}
                        <View style={styles.headerSection}>
                            {/* Left side: Name and title */}
                            <View style={styles.leftHeader}>
                                <Text style={styles.talentName}>{talent.name}</Text>
                                <Text style={styles.talentTitle}>{talent.title}</Text>
                            </View>

                            {/* Right side: Rating and price */}
                            <View style={styles.rightHeader}>
                                <View style={styles.ratingContainer}>
                                    <Ionicons name="star" size={14} color={COLORS.warning} />
                                    <Text style={styles.ratingText}>{talent.rating}</Text>
                                    <Text style={styles.reviewCount}>({talent.reviewCount})</Text>
                                </View>
                                <Text style={styles.price}>Starting at {talent.price} KD</Text>
                            </View>
                        </View>

                        {/* Skills tags */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.skillsContainer}>
                                {talent.skills.slice(0, 3).map((skill, index) => {
                                    const colors = getSkillColor(index);
                                    return (
                                        <View key={index} style={[styles.skillTag, { backgroundColor: colors.bg }]}>
                                            <Text style={[styles.skillText, { color: colors.text }]}>{skill}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </ScrollView>

                        {/* Action buttons */}
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={styles.hireButton} activeOpacity={0.8} onPress={handleHireClick}>
                                <LinearGradient colors={[COLORS.accent, COLORS.accentSecondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
                                    <Text style={styles.hireButtonText}>Hire Now</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.profileButton} activeOpacity={0.8} onPress={handleViewProfileClick}>
                                <Text style={styles.profileButtonText}>View Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            {/* Hire Confirmation Modal */}
            <ConfirmationModal
                visible={showHireModal}
                onClose={() => setShowHireModal(false)}
                onConfirm={() => {}}
                title={`Ready to hire ${talent.name}?`}
                message={`You're about to start a project with one of our top ${talent.category} professionals. ${talent.name} has a ${talent.rating} star rating with ${talent.reviewCount} successful projects.`}
                icon="briefcase"
                confirmText="Continue to Hire"
                cancelText="Maybe Later"
                preview={{
                    avatar: talent.avatar,
                    title: talent.name,
                    subtitle: talent.title,
                    rating: {
                        value: talent.rating,
                        count: talent.reviewCount,
                    },
                }}
            />
        </>
    );
}

// ============================================================================
// STYLES FOR TALENT CARD
// ============================================================================
const styles = StyleSheet.create({
    // Talent card container
    talentCard: {
        backgroundColor: COLORS.background,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        borderWidth: 1,
        borderColor: `${COLORS.accent}10`,
    },

    // Main content wrapper
    mainContent: {
        flexDirection: "row",
        alignItems: "flex-start",
    },

    // Profile avatar image
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginRight: 16,
        backgroundColor: COLORS.muted,
        borderWidth: 2,
        borderColor: `${COLORS.accent}20`,
    },

    // Avatar placeholder when no image
    avatarPlaceholder: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.accent,
    },

    // Avatar text for initials
    avatarText: {
        // color: COLORS.white,
        color: COLORS.background,
        fontSize: 24,
        fontWeight: "bold",
    },

    // Content area
    content: {
        flex: 1,
    },

    // Header section with name/title and rating/price
    headerSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },

    // Left header with name and title
    leftHeader: {
        flex: 1,
    },

    // Right header with rating and price
    rightHeader: {
        alignItems: "flex-end",
    },

    // Talent name styling
    talentName: {
        fontWeight: "bold",
        fontSize: 16,
        color: COLORS.textPrimary,
        marginBottom: 4,
    },

    // Talent title/profession
    talentTitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },

    // Rating container
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },

    // Rating text styling
    ratingText: {
        fontSize: 14,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginLeft: 4,
    },

    // Review count
    reviewCount: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginLeft: 2,
    },

    // Price text
    price: {
        fontSize: 14,
        fontWeight: "bold",
        color: COLORS.accent,
    },

    // Skills container
    skillsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 16,
    },

    // Individual skill tag
    skillTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },

    // Skill text
    skillText: {
        fontSize: 12,
        fontWeight: "500",
    },

    // Buttons container
    buttonsContainer: {
        flexDirection: "row",
        gap: 8,
    },

    // Hire button wrapper
    hireButton: {
        flex: 1,
        height: 40,
        borderRadius: 12,
        overflow: "hidden",
    },

    // Gradient button style
    gradientButton: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    // Hire button text
    hireButtonText: {
        color: COLORS.background,
        fontWeight: "600",
        fontSize: 14,
    },

    // Profile button
    profileButton: {
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 20,
        height: 40,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },

    // Profile button text
    profileButtonText: {
        color: COLORS.textPrimary,
        fontWeight: "600",
        fontSize: 14,
    },
});
