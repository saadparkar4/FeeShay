/**
 * Profile Screen Component
 *
 * Main user profile screen that displays:
 * - User information card with avatar and stats
 * - Profile details including bio and skills
 * - Portfolio showcase section
 * - Reviews and ratings section
 * - Settings and account management options
 *
 * This screen serves as the hub for user account management
 * and showcases their professional profile
 */

import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, SafeAreaView, Text, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { deleteToken } from "@/api/storage";
import AuthContext from "@/context/AuthContext";
import { COLORS } from "@/constants/Colors";
import ConfirmationModal from "@/components/Common/ConfirmationModal";
import { authApi } from "@/api/auth";
import { jobsApi } from "@/api/jobs";
// Profile component imports - each handles a specific section
import UserInfoCard from "@/components/Profile/UserInfoCard";
import ProfileDetails from "@/components/Profile/ProfileDetails";
import PortfolioSection from "@/components/Profile/PortfolioSection";
import ReviewsSection from "@/components/Profile/ReviewsSection";
import SettingsSection from "@/components/Profile/SettingsSection";
import ClientProfileDetails from "@/components/Profile/ClientProfileDetails";
import ClientJobsSection from "@/components/Profile/ClientJobsSection";
import EditProfileModal from "@/components/Profile/EditProfileModal";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen() {
    // Authentication context for managing login state
    const { setIsAuthenticated, isAuthenticated, userRole, setUserRole } = useContext(AuthContext);

    // Router for navigation between screens
    const router = useRouter();

    // State for role switching modal
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // ✅ Add refreshing state
    const [profileData, setProfileData] = useState<any>(null);
    const [clientJobs, setClientJobs] = useState<any[]>([]);
    const [clientStats, setClientStats] = useState({
        jobsPosted: 0,
        totalSpent: 0,
        activeJobs: 0,
    });

    // Handles user logout - clears token and updates auth state
    const handleLogout = () => {
        deleteToken(); // Remove stored authentication token
        setIsAuthenticated(false); // Update auth context to logged out state
    };

    // Navigation handler for settings menu items
    // Routes to specific screens based on the selected option
    const handleNavigate = (route: string) => {
        if (route === "services") {
            // Navigate to user's services list
            router.push("./details/Services");
        } else if (route === "jobs") {
            // Navigate to user's job posts
            router.push("./details/JobPost");
        } else {
            // Placeholder for other navigation options
            console.log(`Navigating to ${route}`);
        }
    };

    // Handler for switching between freelancer/client roles
    const handleSwitchRole = () => {
        setShowRoleModal(true);
    };

    // Handler for editing profile
    const handleEditProfile = () => {
        setShowEditModal(true);
    };

    // Confirm role switch
    const handleConfirmRoleSwitch = async () => {
        try {
            const newRole = userRole === "freelancer" ? "client" : "freelancer";

            // Call API to switch role on backend
            const response = await authApi.switchRole(newRole);

            if (response.success) {
                // Update local state with new role
                setUserRole(newRole);
                setShowRoleModal(false);
            }
        } catch (error: any) {
            console.error("Role switch error:", error);
            Alert.alert("Error", error.response?.data?.message || "Failed to switch role. Please try again.");
            setShowRoleModal(false);
        }
    };

    // Fetch profile data
    useEffect(() => {
        if (isAuthenticated) {
            fetchProfileData();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, userRole]);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchProfileData(); // Fetch all profile data
        } catch (error) {
            console.error("Error refreshing profile data:", error);
            Alert.alert("Error", "Failed to refresh data. Please try again.");
        } finally {
            setRefreshing(false);
        }
    };

    const fetchProfileData = async () => {
        try {
            // Only show loading spinner on initial load, not on refresh
            if (!refreshing) {
                setLoading(true);
            }

            // Fetch profile
            const profileResponse = await authApi.getProfile();
            setProfileData(profileResponse.data);

            // If client, fetch additional data
            if (userRole === "client") {
                try {
                    // Fetch client's jobs
                    const jobsResponse = await jobsApi.getMyJobs();
                    const jobs = jobsResponse.data?.jobs || jobsResponse.jobs || [];
                    const jobsArray = Array.isArray(jobs) ? jobs : [];
                    setClientJobs(jobsArray);

                    // Calculate stats
                    const stats = {
                        jobsPosted: jobsArray.length,
                        totalSpent: jobsArray.reduce((sum: number, job: any) => {
                            if (job.status === "completed" && job.actual_spend) {
                                return sum + Number(job.actual_spend);
                            }
                            return sum;
                        }, 0),
                        activeJobs: jobsArray.filter((job: any) => job.status === "open" || job.status === "in_progress").length,
                    };
                    setClientStats(stats);
                } catch (error) {
                    console.error("Failed to fetch client jobs:", error);
                    setClientJobs([]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch profile data:", error);
            // Only show error alert if not refreshing (to avoid interrupting pull-to-refresh)
            if (!refreshing) {
                Alert.alert("Error", "Failed to load profile data. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle sign in navigation for guests
    const handleSignIn = () => {
        router.push("/Register");
    };

    // If user is not authenticated, show sign in prompt
    if (!isAuthenticated) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: "white" }]}>
                <View style={styles.guestContainer}>
                    <Text style={styles.guestTitle}>Profile</Text>
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

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: "white" }]}>
                <View style={[styles.container, styles.loadingContainer]}>
                    <ActivityIndicator size="large" color={COLORS.accent} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: "white" }]}>
            <View style={styles.container}>
                {/* Main scrollable content */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[COLORS.accent]} // Android spinner colors
                            tintColor={COLORS.accent} // iOS spinner color
                            title="Pull to refresh" // iOS pull text
                            titleColor={COLORS.textSecondary} // iOS text color
                        />
                    }
                >
                    {/* User info card - Avatar, name, stats */}
                    <UserInfoCard onSwitchRole={handleSwitchRole} onEditProfile={handleEditProfile} profile={profileData?.profile} user={profileData?.user} />

                    {userRole === "freelancer" ? (
                        <>
                            {/* Freelancer-specific components */}
                            <ProfileDetails profile={profileData?.profile} />

                            <PortfolioSection onViewAll={() => console.log("View all portfolio")} onAddPortfolio={() => console.log("Add portfolio item")} />

                            <ReviewsSection onViewAll={() => console.log("View all reviews")} />
                        </>
                    ) : (
                        <>
                            {/* Client-specific components */}
                            <ClientProfileDetails profile={profileData?.profile} stats={clientStats} />

                            <ClientJobsSection jobs={clientJobs} />

                            <ReviewsSection onViewAll={() => console.log("View all reviews")} />
                        </>
                    )}

                    {/* Settings section - Account options and navigation */}
                    <SettingsSection onNavigate={handleNavigate} onLogout={handleLogout} userRole={userRole} />
                </ScrollView>

                {/* Role switching confirmation modal */}
                <ConfirmationModal
                    visible={showRoleModal}
                    onClose={() => setShowRoleModal(false)}
                    onConfirm={handleConfirmRoleSwitch}
                    title="Switch Role"
                    message={`Are you sure you want to switch to ${userRole === "freelancer" ? "Client" : "Freelancer"} mode?`}
                    icon="repeat"
                    iconColors={[COLORS.accentTertiary, COLORS.accentSecondary]}
                    confirmText={`Switch to ${userRole === "freelancer" ? "Client" : "Freelancer"}`}
                    cancelText="Cancel"
                />

                {/* Edit Profile Modal */}
                <EditProfileModal
                    visible={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    profile={profileData?.profile}
                    user={profileData?.user}
                    onUpdate={fetchProfileData}
                />
            </View>
        </SafeAreaView>
    );
}

// Styles for the profile screen
const styles = StyleSheet.create({
    // Main container - fills entire screen
    container: {
        flex: 1,
        backgroundColor: COLORS.background, // Uses app theme background color
    },
    loadingContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    // Guest container - centered content for non-authenticated users
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
        marginBottom: 16,
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
});
