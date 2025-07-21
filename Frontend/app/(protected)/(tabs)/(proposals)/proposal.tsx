/**
 * Proposals Screen Component
 *
 * Main screen for viewing and managing proposals from freelancers
 * Features:
 * - Tab navigation (Active, Completed, Cancelled)
 * - Paginated proposal list
 * - Proposal cards with freelancer info
 * - Navigation to detailed proposal view
 *
 * This screen helps users manage incoming proposals for their job posts
 */

import React, { useState, useMemo, useContext, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/Colors";
import { ProposalCard, Proposal } from "@/components/Proposals/ProposalCard";
import { TabBar, TabType } from "@/components/Proposals/TabBar";
import { Pagination } from "@/components/Proposals/Pagination";
import TopBar from "@/components/Home/TopBar";
import AuthContext from "@/context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import proposalApi from "@/api/proposals";
import { jobsApi } from "@/api/jobs";

// Mock proposal data for clients - proposals received from freelancers
const mockReceivedProposals: Proposal[] = [
    {
        id: "1",
        freelancerName: "Michael Chen",
        freelancerAvatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
        projectTitle: "Website Redesign Project",
        rating: 4.7,
        price: 1200,
        duration: "14 days",
        description: "I can revamp your website with modern design principles and ensure it's fully responsive across all devices...",
        status: "active",
    },
    {
        id: "2",
        freelancerName: "Emma Rodriguez",
        freelancerAvatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
        projectTitle: "Logo Design for Startup",
        rating: 5.0,
        price: 350,
        duration: "5 days",
        description: "I specialize in creating modern, memorable logos that capture brand essence. Will deliver multiple concepts with unlimited revisions...",
        status: "active",
    },
    {
        id: "3",
        freelancerName: "Sarah Johnson",
        freelancerAvatar: "https://www.shutterstock.com/image-vector/man-character-face-avatar-glasses-600nw-542759665.jpg",
        projectTitle: "Social Media Content Creation",
        rating: 4.9,
        price: 800,
        duration: "10 days",
        description: "I can create a month's worth of engaging social media content tailored to your brand voice and target audience...",
        status: "active",
    },
    {
        id: "4",
        freelancerName: "David Wilson",
        freelancerAvatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg",
        projectTitle: "Mobile App Development",
        rating: 4.6,
        price: 3500,
        duration: "30 days",
        description: "I can build a high-performance cross-platform mobile app using React Native with all the features you've specified...",
        status: "active",
    },
    {
        id: "5",
        freelancerName: "Alex Thompson",
        freelancerAvatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
        projectTitle: "SEO Optimization",
        rating: 4.8,
        price: 500,
        duration: "7 days",
        description: "Complete SEO audit and optimization for your website to improve search rankings and organic traffic...",
        status: "completed",
    },
    {
        id: "6",
        freelancerName: "Lisa Chen",
        freelancerAvatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg",
        projectTitle: "Video Editing Project",
        rating: 4.5,
        price: 750,
        duration: "5 days",
        description: "Professional video editing with color grading, transitions, and motion graphics...",
        status: "cancelled",
    },
];

// Mock proposal data for freelancers - proposals sent to clients
const mockSentProposals: Proposal[] = [
    {
        id: "1",
        freelancerName: "John Smith", // Client name in this context
        freelancerAvatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg",
        projectTitle: "E-commerce Website Development",
        rating: 4.8,
        price: 2500,
        duration: "21 days",
        description: "My proposal for building your complete e-commerce platform with payment integration...",
        status: "active",
    },
    {
        id: "2",
        freelancerName: "Tech Corp", // Client name
        freelancerAvatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg",
        projectTitle: "Mobile App UI/UX Design",
        rating: 4.9,
        price: 1800,
        duration: "14 days",
        description: "Proposal for designing modern and intuitive UI/UX for your mobile application...",
        status: "active",
    },
    {
        id: "3",
        freelancerName: "StartupXYZ", // Client name
        freelancerAvatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-9.jpg",
        projectTitle: "Backend API Development",
        rating: 5.0,
        price: 3200,
        duration: "30 days",
        description: "Complete backend API development with Node.js and PostgreSQL...",
        status: "completed",
    },
];

export default function ProposalsScreen() {
    // Router for navigation to proposal details
    const router = useRouter();

    // Get user role and auth status from auth context
    const { userRole, isAuthenticated } = useContext(AuthContext);

    // State for currently selected tab (Pending/Accepted/Declined)
    const [selectedTab, setSelectedTab] = useState<TabType>("Pending");

    // State for current page in pagination
    const [currentPage, setCurrentPage] = useState(1);

    // State for proposals data
    const [proposals, setProposals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Number of proposals to show per page
    const itemsPerPage = 4;

    // Fetch proposals on mount and when user role changes
    useEffect(() => {
        if (isAuthenticated && userRole) {
            fetchProposals();
        }
    }, [userRole, isAuthenticated]);

    const fetchProposals = async () => {
        try {
            setLoading(true);
            let response;

            if (userRole === "client") {
                // Fetch all jobs for the client first
                const jobsResponse = await jobsApi.getMyJobs();
                if (jobsResponse.success && jobsResponse.data) {
                    const allProposals: any[] = [];

                    // For each job, fetch its proposals
                    for (const job of jobsResponse.data.jobs) {
                        try {
                            const proposalsResponse = await proposalApi.getJobProposals(job._id || job.id);
                            if (proposalsResponse.success && proposalsResponse.data && "proposals" in proposalsResponse.data) {
                                const jobProposals = proposalsResponse.data.proposals.map((p: any) => ({
                                    ...p,
                                    projectTitle: job.title,
                                    jobId: job._id || job.id,
                                }));
                                allProposals.push(...jobProposals);
                            }
                        } catch (err) {
                            console.error(`Failed to fetch proposals for job ${job._id}:`, err);
                        }
                    }
                    setProposals(allProposals);
                }
            } else {
                // Freelancer: fetch their submitted proposals
                response = await proposalApi.getMyProposals();
                if (response.success && response.data && "proposals" in response.data) {
                    setProposals(response.data.proposals);
                }
            }
        } catch (error) {
            console.log("Failed to fetch proposals - using mock data");
            // Fallback to mock data
            setProposals(userRole === "client" ? mockReceivedProposals : mockSentProposals);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchProposals();
    };

    // Transform API proposals to match the ProposalCard interface
    const transformedProposals = useMemo(() => {
        return proposals.map((p: any) => ({
            id: p._id || p.id,
            freelancerName: userRole === "client" ? p.freelancer?.name || "Freelancer" : p.job?.client?.name || "Client",
            freelancerAvatar:
                userRole === "client"
                    ? p.freelancer?.profile_image_url || "https://www.shutterstock.com/image-vector/man-character-face-avatar-glasses-600nw-542759665.jpg"
                    : p.job?.client?.profile_image_url || "https://www.shutterstock.com/image-vector/man-character-face-avatar-glasses-600nw-542759665.jpg",
            projectTitle: p.projectTitle || p.job?.title || "Project",
            rating: 4.5, // Default rating
            price: parseFloat(p.proposed_price?.$numberDecimal || p.proposed_price || 0),
            duration: p.job?.duration || "7 days",
            description: p.cover_letter || "No description provided",
            status: p.status || "active",
        }));
    }, [proposals, userRole]);

    // Filter proposals based on selected tab
    // Uses memoization to avoid unnecessary recalculations
    const filteredProposals = useMemo(() => {
        // Map tab names to proposal status values
        const statusMap = {
            Pending: "active", // Active proposals are pending response
            Accepted: "completed", // Completed means accepted
            Declined: "rejected", // Rejected means declined
        };
        // Return only proposals matching current tab status
        // Also include cancelled proposals in the Declined tab
        if (selectedTab === "Declined") {
            return transformedProposals.filter((p) => p.status === "rejected" || p.status === "cancelled");
        }
        return transformedProposals.filter((p) => p.status === statusMap[selectedTab]);
    }, [selectedTab, transformedProposals]); // Recalculate when tab or data changes

    // Pagination calculations
    const totalPages = Math.ceil(filteredProposals.length / itemsPerPage);

    // Get proposals for current page
    const paginatedProposals = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProposals.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProposals, currentPage]); // Recalculate when page or filters change

    // Effect to reset pagination when switching tabs
    // Prevents showing empty pages when tab has fewer items
    React.useEffect(() => {
        setCurrentPage(1);
    }, [selectedTab]);

    // Handler for viewing full proposal details
    // Navigates to detail screen with proposal data
    const handleViewDetails = (proposal: any) => {
        // Find the original proposal data
        const originalProposal = proposals.find((p) => (p._id || p.id) === proposal.id);

        // Navigate to dynamic route [id].tsx with proposal info
        router.push({
            pathname: "/(protected)/(tabs)/(proposals)/[id]",
            params: {
                id: proposal.id, // Pass proposal ID
                status: proposal.status, // Pass status for proper display
                jobId: originalProposal?.jobId || originalProposal?.job?._id || originalProposal?.job?.id,
            },
        });
    };

    // Handle sign in navigation for guests
    const handleSignIn = () => {
        router.push("/Register");
    };

    // If user is not authenticated, show sign in prompt
    if (!isAuthenticated) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.guestContainer}>
                    <Ionicons name="document-text-outline" size={64} color={COLORS.textSecondary} />
                    <Text style={styles.guestTitle}>Proposals</Text>
                    <Text style={styles.guestMessage}>Please sign in to use this feature</Text>
                    <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
                        <LinearGradient colors={[COLORS.accent, COLORS.accentSecondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
                            <Text style={styles.signInButtonText}>Sign In</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Top navigation bar component */}
                <TopBar />

                <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}>
                    {/* Page Header - Title and description */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Proposals</Text>
                        <Text style={styles.subtitle}>{userRole === "client" ? "Manage job proposals from freelancers" : "Track your submitted proposals"}</Text>
                    </View>

                    {/* Tab Bar - Switch between proposal states */}
                    <TabBar
                        selectedTab={selectedTab}
                        onTabChange={setSelectedTab} // Update selected tab
                    />

                    {/* Proposals List - Main content area */}
                    <View style={styles.proposalsList}>
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={COLORS.accent} />
                                <Text style={styles.loadingText}>Loading proposals...</Text>
                            </View>
                        ) : paginatedProposals.length > 0 ? (
                            // Map through proposals and render cards
                            paginatedProposals.map((proposal) => <ProposalCard key={proposal.id} proposal={proposal} onViewDetails={() => handleViewDetails(proposal)} />)
                        ) : (
                            // Empty state when no proposals match current filter
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>
                                    {userRole === "client"
                                        ? `No ${selectedTab === "Pending" ? "pending" : selectedTab === "Accepted" ? "accepted" : "declined"} proposals received`
                                        : `No ${selectedTab === "Pending" ? "pending" : selectedTab === "Accepted" ? "accepted" : "declined"} proposals sent`}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Pagination - Only show if multiple pages exist */}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage} // Handle page navigation
                        />
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

// Styles for the proposals screen
const styles = StyleSheet.create({
    // Safe area wrapper
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    // Main container
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    // Header section with title
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    // Main title text
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    // Subtitle description
    subtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    // Container for proposal cards
    proposalsList: {
        paddingHorizontal: 16,
        paddingBottom: 100, // Extra space for bottom tab navigation
    },
    // Empty state styling
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60, // Generous padding for visibility
    },
    // Empty state message
    emptyText: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    // Guest container styles
    guestContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    // Guest title
    guestTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginTop: 16,
        marginBottom: 8,
    },
    // Guest message
    guestMessage: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: "center",
        marginBottom: 32,
    },
    // Sign in button
    signInButton: {
        width: 200,
        height: 48,
        borderRadius: 12,
        overflow: "hidden",
    },
    // Gradient button style
    gradientButton: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    // Sign in button text
    signInButtonText: {
        color: COLORS.background,
        fontSize: 16,
        fontWeight: "600",
    },
    // Loading container
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
    },
    // Loading text
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: COLORS.textSecondary,
    },
});
