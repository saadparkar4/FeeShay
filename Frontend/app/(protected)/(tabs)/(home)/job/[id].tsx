/**
 * Job Details Screen Component
 *
 * Displays comprehensive information about a specific job posting
 * Features:
 * - Job summary with title, category, and budget
 * - Client information with ratings and location
 * - Detailed job description and requirements
 * - Attachments preview
 * - Required skills display
 * - Delivery timeline
 * - Budget type (fixed price vs hourly)
 * - Action buttons (Send Proposal, Save for Later)
 */

import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, SafeAreaView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/Colors";
import { jobsApi } from "@/api/jobs";

// Type definition for job details data
interface JobDetailsData {
    id: string;
    title: string;
    category: string;
    budget: string;
    client: {
        name: string;
        avatar: string;
        rating: number;
        reviewCount: number;
        location: string;
    };
    description: string;
    deliverables: string[];
    attachments: {
        type: "pdf" | "image" | "doc";
        name: string;
        size: string;
    }[];
    skills: string[];
    deliveryTime: string;
    // budgetType: "fixed" | "hourly";
    postedTime: string;
}

// Mock function to get job details - Replace with API call in production
const getJobDetails = (id: string): JobDetailsData => ({
    id,
    title: "Complete Brand Identity Design",
    category: "Design",
    budget: "250 KD",
    client: {
        name: "Emma W.",
        avatar: "https://www.shutterstock.com/image-vector/man-character-face-avatar-glasses-600nw-542759665.jpg",
        rating: 4.7,
        reviewCount: 98,
        location: "New York, US",
    },
    description: `I'm looking for a talented designer to create a complete brand identity for my new tech startup. This project includes logo design, color palette, typography selection, and brand guidelines.

The brand should feel modern, trustworthy, and innovative. We're targeting young professionals in the tech industry, so the design should appeal to that demographic.`,
    deliverables: [
        "Primary logo design (3 variations)",
        "Color palette and typography guide",
        "Business card and letterhead design",
        "Brand guidelines document",
        "Social media templates",
    ],
    attachments: [
        { type: "pdf", name: "Brief.pdf", size: "245 KB" },
        { type: "image", name: "Reference.jpg", size: "1.2 MB" },
    ],
    skills: ["Logo Design", "Branding", "Adobe Illustrator", "Typography", "Brand Guidelines", "Photoshop"],
    deliveryTime: "5 Days",
    // budgetType: "fixed",
    postedTime: "2 hours ago",
});

export default function JobDetailsScreen() {
    // Get job ID from route parameters
    const { id } = useLocalSearchParams();
    const router = useRouter();

    // State for job data
    const [jobData, setJobData] = useState<JobDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const response = await jobsApi.getJobById(id as string);
            if (response.success && response.data) {
                const job = response.data.data || response.data;
                // Transform API data to match our interface
                const transformedJob: JobDetailsData = {
                    id: job.id || job._id,
                    title: job.title,
                    category: job.category?.name || job.category || "Other",
                    budget: `${parseFloat(job.budget_min?.$numberDecimal || job.budget_min || job.budget?.$numberDecimal || job.budget || 0)}-${parseFloat(
                        job.budget_max?.$numberDecimal || job.budget_max || job.budget?.$numberDecimal || job.budget || 0
                    )} KD`,
                    client: {
                        name: job.client?.name || "Client",
                        avatar: job.client?.profile_image_url || "https://www.shutterstock.com/image-vector/man-character-face-avatar-glasses-600nw-542759665.jpg",
                        rating: job.client?.rating || 4.5,
                        reviewCount: job.client?.reviewCount || 0,
                        location: job.client?.location || "Unknown",
                    },
                    description: job.description,
                    deliverables: job.deliverables || [],
                    attachments:
                        job.attachments?.map((att: any) => ({
                            type: att.type || "doc",
                            name: att.name || "Attachment",
                            size: att.size || "Unknown",
                        })) || [],
                    skills: job.skills || [],
                    deliveryTime: job.duration || "5 Days",
                    // budgetType: job.projectType === 'Hourly' ? 'hourly' : 'fixed',
                    postedTime: getTimeAgo(job.created_at || new Date().toISOString()),
                };
                setJobData(transformedJob);
            }
        } catch (err) {
            console.error("Failed to fetch job details:", err);
            setError("Failed to load job details");
            // Use mock data as fallback
            setJobData(getJobDetails(id as string));
        } finally {
            setLoading(false);
        }
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (hours < 1) return "Just now";
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
        return `${Math.floor(days / 7)} week${days >= 14 ? "s" : ""} ago`;
    };

    // Get icon for attachment type
    const getAttachmentIcon = (type: string) => {
        switch (type) {
            case "pdf":
                return { name: "document-text", color: "#DC2626" };
            case "image":
                return { name: "image", color: "#2563EB" };
            case "doc":
                return { name: "document", color: "#059669" };
            default:
                return { name: "document", color: "#6B7280" };
        }
    };

    // Get skill color based on index for visual variety
    const getSkillColor = (index: number) => {
        const colors = [
            { bg: COLORS.accent + "20", text: COLORS.accent },
            { bg: COLORS.accentSecondary + "20", text: COLORS.accentSecondary },
            { bg: COLORS.accentTertiary + "20", text: COLORS.accentTertiary },
        ];
        return colors[index % colors.length];
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Job Details</Text>
                    </View>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.accent} />
                    <Text style={styles.loadingText}>Loading job details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !jobData) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Job Details</Text>
                    </View>
                </View>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={64} color={COLORS.error} />
                    <Text style={styles.errorText}>{error || "Job not found"}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Job Details</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                {/* Job Summary Section */}
                <LinearGradient colors={[COLORS.accent + "10", COLORS.accentSecondary + "10", COLORS.accentTertiary + "10"]} style={styles.summaryCard}>
                    <View style={styles.summaryContent}>
                        <Text style={styles.jobTitle}>{jobData.title}</Text>
                        <View style={styles.summaryRow}>
                            <View style={[styles.categoryBadge, { backgroundColor: COLORS.accent }]}>
                                <Text style={styles.categoryText}>{jobData.category}</Text>
                            </View>
                            <LinearGradient colors={[COLORS.accentSecondary, COLORS.accentTertiary]} style={styles.budgetBadge}>
                                <Text style={styles.budgetText}>{jobData.budget}</Text>
                            </LinearGradient>
                        </View>
                    </View>
                </LinearGradient>
                {/* Client Information */}
                <View style={[styles.card, styles.clientCard]}>
                    <Text style={styles.sectionTitle}>Client Information</Text>
                    <View style={styles.clientInfo}>
                        <Image source={{ uri: jobData.client.avatar }} style={styles.clientAvatar} />
                        <View style={styles.clientDetails}>
                            <Text style={styles.clientName}>{jobData.client.name}</Text>
                            <View style={styles.ratingRow}>
                                <Ionicons name="star" size={14} color="#FACC15" />
                                <Text style={styles.ratingText}>{jobData.client.rating}</Text>
                                <Text style={styles.reviewCount}>({jobData.client.reviewCount})</Text>
                            </View>
                            <View style={styles.locationRow}>
                                <Ionicons name="location" size={14} color={COLORS.textSecondary} />
                                <Text style={styles.locationText}>{jobData.client.location}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.messageButton}>
                            <Ionicons name="chatbubble" size={16} color={COLORS.accentTertiary} />
                            <Text style={styles.messageButtonText}>Message</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Job Description */}
                <View style={[styles.card, styles.descriptionCard]}>
                    <Text style={styles.sectionTitle}>Job Description</Text>

                    {/* <Text style={styles.deliverablesTitle}>Deliverables include:</Text> */}
                    <Text style={styles.descriptionText}>{jobData.description}</Text>
                    {jobData.deliverables.map((item, index) => (
                        <View key={index} style={styles.deliverableItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.deliverableText}>{item}</Text>
                        </View>
                    ))}
                </View>
                {/* Attachments
                <View style={[styles.card, styles.attachmentsCard]}>
                    <Text style={styles.sectionTitle}>Attachments</Text>
                    <View style={styles.attachmentsGrid}>
                        {jobData.attachments.map((attachment, index) => {
                            const icon = getAttachmentIcon(attachment.type);
                            return (
                                <TouchableOpacity key={index} style={styles.attachmentItem}>
                                    <View style={[styles.attachmentIcon, { backgroundColor: icon.color + "20" }]}>
                                        <Ionicons name={icon.name as any} size={18} color={icon.color} />
                                    </View>
                                    <View style={styles.attachmentInfo}>
                                        <Text style={styles.attachmentName}>{attachment.name}</Text>
                                        <Text style={styles.attachmentSize}>{attachment.size}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View> */}
                {/* Required Skills */}
                <View style={[styles.card, styles.skillsCard]}>
                    <Text style={styles.sectionTitle}>Required Skills</Text>
                    <View style={styles.skillsContainer}>
                        {jobData.skills.map((skill, index) => {
                            const colors = getSkillColor(index);
                            return (
                                <View key={index} style={[styles.skillBadge, { backgroundColor: colors.bg }]}>
                                    <Text style={[styles.skillText, { color: colors.text }]}>{skill}</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
                {/* Delivery Information */}
                <View style={[styles.card, styles.deliveryCard]}>
                    <Text style={styles.sectionTitle}>Delivery</Text>
                    <View style={styles.deliveryInfo}>
                        <View style={styles.deliveryIcon}>
                            <Ionicons name="time" size={20} color={COLORS.accentSecondary} />
                        </View>
                        <View>
                            <Text style={styles.deliveryLabel}>Estimated Completion Time</Text>
                            <Text style={styles.deliveryTime}>{jobData.deliveryTime}</Text>
                        </View>
                    </View>
                </View>
                {/* Budget & Type */}
                <View style={[styles.card, styles.budgetTypeCard]}>
                    <Text style={styles.sectionTitle}>Budget & Type</Text>
                    <View style={styles.budgetTypeGrid}>
                        {/* Budget Card */}
                        <LinearGradient colors={[COLORS.accent + "10", COLORS.accentSecondary + "10"]} style={styles.budgetCard}>
                            <View style={styles.budgetIcon}>
                                <Text style={styles.dollarSign}>$</Text>
                            </View>
                            <View>
                                <Text style={styles.budgetLabel}>Budget</Text>
                                <Text style={styles.budgetAmount}>{jobData.budget}</Text>
                            </View>
                        </LinearGradient>

                        {/* Type Card
                        <LinearGradient colors={[COLORS.accentTertiary + "10", COLORS.accentSecondary + "10"]} style={styles.typeCard}>
                            <View style={styles.typeIcon}>
                                <Ionicons name="pricetag" size={18} color={COLORS.accentTertiary} />
                            </View>
                            <View>
                                <Text style={styles.typeLabel}>Type</Text>
                                <Text style={styles.typeValue}>{jobData.budgetType === "fixed" ? "Fixed Price" : "Hourly Rate"}</Text>
                            </View>
                        </LinearGradient> */}
                    </View>
                </View>
                {/* Spacer for bottom buttons */}
                <View style={styles.actionButtons}>
                    {/* Send Proposal Button */}
                    <TouchableOpacity style={styles.sendProposalButton} onPress={() => router.push(`/(protected)/(tabs)/(home)/job/send-proposal?jobId=${id}`)}>
                        <LinearGradient colors={[COLORS.accent, COLORS.accentSecondary]} style={styles.sendProposalGradient}>
                            <Ionicons name="send" size={20} color="white" />
                            <Text style={styles.sendProposalText}>Send Proposal</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Save for Later Button */}
                    <TouchableOpacity style={styles.saveButton}>
                        <Ionicons name="bookmark-outline" size={20} color={COLORS.textSecondary} />
                        <Text style={styles.saveButtonText}>Save for Later</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Comprehensive styles for all components
const styles = StyleSheet.create({
    // Main container
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    // Header styles
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: COLORS.background,
        shadowColor: COLORS.accentSecondary + "20",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 5,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        padding: 8,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.textPrimary,
    },
    moreButton: {
        padding: 8,
    },

    // Content area
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
    },

    // Job summary card
    summaryCard: {
        borderRadius: 16,
        padding: 24,
        marginBottom: 16,
        shadowColor: COLORS.accentSecondary + "20",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 5,
    },
    summaryContent: {
        gap: 16,
    },
    jobTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.textPrimary,
    },
    summaryRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    categoryBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    categoryText: {
        color: "white",
        fontSize: 14,
        fontWeight: "600",
    },
    budgetBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    budgetText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },

    // Common card styles
    card: {
        backgroundColor: COLORS.background,
        borderRadius: 16,
        padding: 24,
        marginBottom: 16,
        shadowColor: COLORS.accentSecondary + "20",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginBottom: 16,
    },

    // Client card specific
    clientCard: {
        borderWidth: 1,
        borderColor: COLORS.accent + "20",
    },
    clientInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    clientAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 3,
        borderColor: COLORS.accent + "30",
    },
    clientDetails: {
        flex: 1,
        marginLeft: 16,
    },
    clientName: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.textPrimary,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 4,
    },
    reviewCount: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginLeft: 4,
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    locationText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginLeft: 8,
    },
    messageButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.accentTertiary + "20",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 8,
    },
    messageButtonText: {
        color: COLORS.accentTertiary,
        fontSize: 14,
        fontWeight: "600",
    },

    // Description card
    descriptionCard: {
        borderWidth: 1,
        borderColor: COLORS.accentSecondary + "20",
    },
    descriptionText: {
        fontSize: 15,
        color: COLORS.textSecondary,
        lineHeight: 24,
        marginBottom: 16,
    },
    deliverablesTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    deliverableItem: {
        flexDirection: "row",
        marginBottom: 4,
    },
    bullet: {
        fontSize: 15,
        color: COLORS.textSecondary,
        marginRight: 8,
    },
    deliverableText: {
        flex: 1,
        fontSize: 15,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },

    // Attachments card
    attachmentsCard: {
        borderWidth: 1,
        borderColor: COLORS.accentTertiary + "20",
    },
    attachmentsGrid: {
        flexDirection: "row",
        gap: 16,
    },
    attachmentItem: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.background,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.accentSecondary + "20",
    },
    attachmentIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    attachmentInfo: {
        marginLeft: 12,
        flex: 1,
    },
    attachmentName: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textPrimary,
    },
    attachmentSize: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },

    // Skills card
    skillsCard: {
        borderWidth: 1,
        borderColor: COLORS.accent + "20",
    },
    skillsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    skillBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    skillText: {
        fontSize: 14,
        fontWeight: "600",
    },

    // Delivery card
    deliveryCard: {
        borderWidth: 1,
        borderColor: COLORS.accentSecondary + "20",
    },
    deliveryInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    deliveryIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: COLORS.accentSecondary + "20",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    deliveryLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.textPrimary,
    },
    deliveryTime: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.accentSecondary,
        marginTop: 4,
    },

    // Budget & Type card
    budgetTypeCard: {
        borderWidth: 1,
        borderColor: COLORS.accentTertiary + "20",
    },
    budgetTypeGrid: {
        flexDirection: "row",
        gap: 16,
    },
    budgetCard: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        gap: 12,
    },
    budgetIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: COLORS.accent,
        justifyContent: "center",
        alignItems: "center",
    },
    dollarSign: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    budgetLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    budgetAmount: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.accent,
    },
    typeCard: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        gap: 12,
    },
    typeIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: COLORS.accentTertiary,
        justifyContent: "center",
        alignItems: "center",
    },
    typeLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    typeValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.accentTertiary,
    },

    // Action buttons
    actionButtons: {
        backgroundColor: COLORS.background,
        padding: 20,
        gap: 12,
    },
    sendProposalButton: {
        width: "100%",
    },
    sendProposalGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
    sendProposalText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    saveButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.background,
        paddingVertical: 12,
        borderRadius: 16,
        gap: 8,
    },
    saveButtonText: {
        color: COLORS.textSecondary,
        fontSize: 16,
        fontWeight: "600",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.error,
        textAlign: "center",
    },
});
