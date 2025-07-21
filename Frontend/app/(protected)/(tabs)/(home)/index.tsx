import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, SafeAreaView, Platform, ActivityIndicator, RefreshControl } from "react-native";
import Constants from "expo-constants";
import TopBar from "../../../../components/Home/TopBar";
import SearchBar from "../../../../components/Home/SearchBar";
import CategoryScroll from "../../../../components/Home/CategoryScroll";
import ToggleBar from "../../../../components/Home/ToggleBar";
import TalentCard from "../../../../components/Home/TalentCard";
import JobCard from "../../../../components/Home/JobCard";
import Fab from "../../../../components/Home/Fab";
import { COLORS } from "../../../../constants/Colors";
import AuthContext from "@/context/AuthContext";
import { jobsApi } from "@/api/jobs";

// ============================================================================
// DYNAMIC CATEGORY GENERATION
// ============================================================================
// Generate categories dynamically based on current tab data
const getDynamicCategories = (data: any[]) => {
    const uniqueCategories = [...new Set(data.map((item) => item.category))];
    return ["All Categories", ...uniqueCategories.sort()];
};

// ============================================================================
// MOCK DATA - TALENTS (FREELANCERS)
// ============================================================================
// Sample freelancer data with all necessary fields for display
// TODO: Replace with backend API call to fetch talents
const talents = [
    {
        id: "1",
        name: "Alex Johnson",
        title: "Logo & Brand Designer",
        location: "New York, US",
        rating: 4.8,
        reviewCount: 156,
        price: 75,
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
        category: "Graphic Designing",
        skills: ["Logo Design", "Branding", "Illustration"],
    },
    {
        id: "2",
        name: "Sophia Lee",
        title: "Full-Stack Developer",
        location: "San Francisco, US",
        rating: 4.9,
        reviewCount: 203,
        price: 120,
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
        category: "Web Development",
        skills: ["React", "Node.js", "MongoDB"],
    },
    {
        id: "3",
        name: "Marcus Chen",
        title: "Digital Marketing Expert",
        location: "Austin, US",
        rating: 4.6,
        reviewCount: 89,
        price: 55,
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg",
        category: "Digital Marketing",
        skills: ["SEO", "Social Media", "Analytics"],
    },
    {
        id: "4",
        name: "Isabella Martinez",
        title: "Video Editor & Motion Designer",
        location: "Los Angeles, US",
        rating: 4.7,
        reviewCount: 112,
        price: 85,
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg",
        category: "Video Editing",
        skills: ["Video Editing", "After Effects", "Animation"],
    },
    {
        id: "5",
        name: "Sarah Johnson",
        title: "UI/UX Designer",
        location: "Chicago, US",
        rating: 4.9,
        reviewCount: 178,
        price: 95,
        avatar: "https://www.shutterstock.com/image-vector/man-character-face-avatar-glasses-600nw-542759665.jpg",
        category: "UI/UX Design",
        skills: ["UI Design", "User Research", "Prototyping"],
    },
];

// ============================================================================
// MOCK DATA - JOBS (PROJECTS)
// ============================================================================
// Sample job posting data with diverse categories to showcase different colors
// TODO: Replace with backend API call to fetch jobs
const jobs = [
    {
        id: "1",
        title: "Complete Brand Identity Design",
        image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/8decf4170a-1220338dc9ccd47cd233.png",
        sellerAvatar: "https://www.shutterstock.com/image-vector/man-character-face-avatar-glasses-600nw-542759665.jpg",
        sellerName: "Emma W.",
        rating: 4.7,
        ratingCount: 98,
        category: "Design",
        price: 250,
    },
    {
        id: "2",
        title: "Website Development",
        image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/90efecceec-ee1c74c722b3034a37ef.png",
        sellerAvatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
        sellerName: "James H.",
        rating: 4.8,
        ratingCount: 156,
        category: "Tech",
        price: 180,
    },
    {
        id: "3",
        title: "Blog Content Writing",
        image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/cffe96cd84-0fbdac65050f7a36822a.png",
        sellerAvatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg",
        sellerName: "Sophia L.",
        rating: 4.7,
        ratingCount: 63,
        category: "Writing",
        price: 65,
    },
    {
        id: "4",
        title: "Social Media Marketing",
        image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/e398cd7767-77966952d90f712a2f7a.png",
        sellerAvatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg",
        sellerName: "Jessica M.",
        rating: 4.6,
        ratingCount: 42,
        category: "Marketing",
        price: 120,
    },
    {
        id: "5",
        title: "Professional Photography",
        image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/8decf4170a-1220338dc9ccd47cd233.png",
        sellerAvatar: "https://www.shutterstock.com/image-vector/man-character-face-avatar-glasses-600nw-542759665.jpg",
        sellerName: "Alex P.",
        rating: 4.9,
        ratingCount: 87,
        category: "Photography",
        price: 300,
    },
    {
        id: "6",
        title: "Music Production & Mixing",
        image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/90efecceec-ee1c74c722b3034a37ef.png",
        sellerAvatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
        sellerName: "Sam R.",
        rating: 4.8,
        ratingCount: 145,
        category: "Music",
        price: 200,
    },
    {
        id: "7",
        title: "2D Animation & Motion Graphics",
        image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/cffe96cd84-0fbdac65050f7a36822a.png",
        sellerAvatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg",
        sellerName: "Maya K.",
        rating: 4.7,
        ratingCount: 76,
        category: "Animation",
        price: 350,
    },
    {
        id: "8",
        title: "Business Consulting",
        image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/e398cd7767-77966952d90f712a2f7a.png",
        sellerAvatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
        sellerName: "Robert L.",
        rating: 4.9,
        ratingCount: 234,
        category: "Consulting",
        price: 150,
    },
];

// ============================================================================
// MAIN HOME SCREEN COMPONENT
// ============================================================================
export default function HomeScreen() {
    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================
    const { userRole, isAuthenticated } = useContext(AuthContext);

    // UI state variables for managing user interactions and data filtering
    const [selectedCategory, setSelectedCategory] = useState("All Categories"); // Currently selected category filter
    const [tab, setTab] = useState<"talents" | "jobs">(userRole === "client" ? "talents" : "jobs"); // Set initial tab based on role
    const [search, setSearch] = useState(""); // Search query text
    const [realJobs, setRealJobs] = useState<any[]>([]); // Real jobs from API
    const [loading, setLoading] = useState(false); // Loading state
    const [refreshing, setRefreshing] = useState(false); // Refresh state

    // Fetch jobs from API when component mounts or when tab changes to jobs
    useEffect(() => {
        if (userRole === "freelancer" || tab === "jobs") {
            fetchJobs();
        }
    }, [userRole, tab]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await jobsApi.getJobs({ status: "open" });
            if (response.success && response.data) {
                // Transform API data to match the expected format
                const transformedJobs = response.data.jobs.map((job: any) => ({
                    id: job._id || job.id,
                    title: job.title,
                    image: job.image || "https://storage.googleapis.com/uxpilot-auth.appspot.com/8decf4170a-1220338dc9ccd47cd233.png",
                    sellerAvatar: job.client?.profile_image_url || "https://www.shutterstock.com/image-vector/man-character-face-avatar-glasses-600nw-542759665.jpg",
                    sellerName: job.client?.name || "Client",
                    rating: job.client?.rating || 4.5,
                    ratingCount: job.client?.reviewCount || 0,
                    category: job.category?.name || job.category || "Other",
                    price: parseFloat(job.budget_max?.$numberDecimal || job.budget_max || job.budget?.$numberDecimal || job.budget || job.price || 100),
                }));
                setRealJobs(transformedJobs);
            }
        } catch (error: any) {
            console.log("Failed to fetch jobs - using mock data");
            // Fallback to mock data if API fails
            setRealJobs(jobs);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchJobs();
    };

    // ============================================================================
    // DYNAMIC CATEGORY GENERATION
    // ============================================================================
    // Generate categories with item counts based on user role
    // This shows users how many items are in each category
    const getCategoriesWithCounts = () => {
        const currentData = userRole === "client" ? talents : realJobs.length > 0 ? realJobs : jobs;
        const dynamicCategories = getDynamicCategories(currentData);
        const categoryCounts = currentData.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return dynamicCategories.map((cat: string) => ({
            name: cat,
            count: cat === "All Categories" ? currentData.length : categoryCounts[cat] || 0,
        }));
    };

    const categoriesWithCounts = getCategoriesWithCounts();

    // ============================================================================
    // DATA FILTERING LOGIC
    // ============================================================================
    // Filter talents based on search query and selected category
    // Search matches: name, title, location
    // Category filter: exact category match or "All Categories"
    const filteredTalents = talents.filter((talent) => {
        const matchesSearch =
            search === "" ||
            talent.name.toLowerCase().includes(search.toLowerCase()) ||
            talent.title.toLowerCase().includes(search.toLowerCase()) ||
            talent.location.toLowerCase().includes(search.toLowerCase());

        const matchesCategory = selectedCategory === "All Categories" || talent.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Filter jobs based on search query and selected category
    // Search matches: title, description
    // Category filter: exact category match or "All Categories"
    const jobsToFilter = realJobs.length > 0 ? realJobs : jobs;
    const filteredJobs = jobsToFilter.filter((job) => {
        const matchesSearch = search === "" || job.title.toLowerCase().includes(search.toLowerCase());

        const matchesCategory = selectedCategory === "All Categories" || job.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // ============================================================================
    // TAB SWITCHING LOGIC
    // ============================================================================
    // Handle tab switching with smart category reset
    // If current category has no items in new tab, reset to "All Categories"
    const handleTabChange = (newTab: "talents" | "jobs") => {
        setTab(newTab);
        const currentData = newTab === "talents" ? talents : realJobs.length > 0 ? realJobs : jobs;
        const availableCategories = getDynamicCategories(currentData);
        const hasItemsInCategory = availableCategories.includes(selectedCategory);

        if (!hasItemsInCategory) {
            setSelectedCategory("All Categories");
        }
    };

    // ============================================================================
    // TODO: BACKEND INTEGRATION POINTS
    // ============================================================================
    // These are the main points where backend API calls will be needed:
    // 1. Fetch categories from backend
    // 2. Fetch talents with pagination and filtering
    // 3. Fetch jobs with pagination and filtering
    // 4. Get notification count for TopBar badge
    // 5. Handle search with backend search API
    // 6. Handle category filtering on backend

    // ============================================================================
    // RENDER UI
    // ============================================================================
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Top navigation bar with logo and notifications */}
                <TopBar />

                {/* Main scrollable content area */}
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={userRole === "freelancer" ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} /> : undefined}
                >
                    {/* Role-based header */}
                    <View style={styles.roleHeader}>
                        <Text style={styles.roleHeaderTitle}>{userRole === "client" ? "Looking to Hire" : "Looking for Jobs"}</Text>
                        <Text style={styles.roleHeaderSubtitle}>
                            {userRole === "client" ? "Find the perfect talent for your project" : "Discover opportunities that match your skills"}
                        </Text>
                    </View>

                    {/* Search bar for filtering content */}
                    <SearchBar value={search} onChange={setSearch} />

                    {/* Horizontal category filter with item counts */}
                    <CategoryScroll
                        categories={categoriesWithCounts.map((cat) => cat.name)}
                        selected={selectedCategory}
                        onSelect={setSelectedCategory}
                        displayNames={categoriesWithCounts.map((cat) => `${cat.name} (${cat.count})`)}
                    />

                    {/* No tab switcher - clients only see talents, freelancers only see jobs */}

                    {/* Content Section: Display based on user role */}
                    <View style={styles.cardsSection}>
                        {userRole === "client" ? (
                            // Client sees talents (Looking to Hire)
                            filteredTalents.map((talent, index) => {
                                // Alternate border colors like in the design
                                const borderColors = [COLORS.accent, COLORS.accentTertiary, COLORS.accentSecondary, COLORS.accent];
                                const borderColor = borderColors[index % borderColors.length];
                                return <TalentCard key={talent.id} talent={talent} borderColor={borderColor} />;
                            })
                        ) : loading ? (
                            // Loading state for jobs
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={COLORS.accent} />
                                <Text style={styles.loadingText}>Loading jobs...</Text>
                            </View>
                        ) : (
                            // Freelancer sees jobs (Looking for Jobs)
                            filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
                        )}

                        {/* No results message when filters return empty */}
                        {userRole === "client" && filteredTalents.length === 0 && (
                            <View style={styles.noResultsContainer}>
                                <Text style={styles.noResultsText}>No talents found matching your criteria</Text>
                            </View>
                        )}
                        {userRole === "freelancer" && filteredJobs.length === 0 && (
                            <View style={styles.noResultsContainer}>
                                <Text style={styles.noResultsText}>No jobs found matching your criteria</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>

                {/* Floating action button for creating new content - only for authenticated users */}
                {isAuthenticated && <Fab />}
            </View>
        </SafeAreaView>
    );
}

// ============================================================================
// STYLES FOR HOME SCREEN
// ============================================================================
const styles = StyleSheet.create({
    // Safe area wrapper for proper device compatibility
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    // Main container for the entire screen
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    // Cards section container
    cardsSection: {
        paddingHorizontal: 16,
        gap: 5,
    },

    // No results container
    noResultsContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        paddingHorizontal: 20,
    },

    // No results text styling
    noResultsText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: "center",
        fontWeight: "500",
    },

    // Loading state styles
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: COLORS.textSecondary,
    },

    // Role-based header styles
    roleHeader: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    roleHeaderTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    roleHeaderSubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
});
