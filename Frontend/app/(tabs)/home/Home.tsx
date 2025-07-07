import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, SafeAreaView, Platform, RefreshControl, Alert } from "react-native";
import Constants from "expo-constants";
import TopBar from "../../../components/Home/TopBar";
import SearchBar from "../../../components/Home/SearchBar";
import CategoryScroll from "../../../components/Home/CategoryScroll";
import ToggleBar from "../../../components/Home/ToggleBar";
import TalentCard from "../../../components/Home/TalentCard";
import JobCard from "../../../components/Home/JobCard";
import Fab from "../../../components/Home/Fab";
import { COLORS } from "../../../constants/Colors";
import { useAuth } from "../../../src/contexts/AuthContext";
import { useJobs, useServices, useCategories } from "../../../src/hooks/useQueries";

// ============================================================================
// INTERFACES
// ============================================================================
interface Job {
    _id: string;
    title: string;
    description: string;
    category: string;
    budget_min: number;
    budget_max: number;
    status: string;
    created_at: string;
    client: {
        name: string;
        profile_image_url?: string;
    };
}

interface Service {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    delivery_time_days: number;
    status: string;
    created_at: string;
    freelancer: {
        name: string;
        profile_image_url?: string;
        rating?: number;
        location?: string;
    };
}

interface Category {
    _id: string;
    name: string;
    description?: string;
}

// ============================================================================
// MAIN HOME SCREEN COMPONENT
// ============================================================================
export default function HomeScreen() {
    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [tab, setTab] = useState<"talents" | "jobs">("talents");
    const [search, setSearch] = useState("");

    // ============================================================================
    // REACT QUERY HOOKS
    // ============================================================================
    // Jobs query
    const jobsQuery = useJobs({
        search,
        category: selectedCategory !== "All Categories" ? selectedCategory : undefined,
    });

    // Services query (for talents/freelancers)
    const servicesQuery = useServices({
        search,
        category: selectedCategory !== "All Categories" ? selectedCategory : undefined,
    });

    // Categories query
    const categoriesQuery = useCategories();

    // ============================================================================
    // DYNAMIC CATEGORY GENERATION WITH COUNTS
    // ============================================================================
    const getCategoriesWithCounts = () => {
        const currentData = (tab === "talents" ? (servicesQuery.data as any)?.data?.data : (jobsQuery.data as any)?.data?.data) || [];
        const categories = (categoriesQuery.data as any)?.data || [];

        console.log("Categories state:", categories);
        console.log("Current data:", currentData);

        // Start with "All Categories" option
        const categoriesWithCounts = [
            {
                name: "All Categories",
                count: currentData.length,
            },
        ];

        // Add categories from database with counts from current data
        // Ensure categories is an array before calling forEach
        if (categories && Array.isArray(categories)) {
            categories.forEach((category: any) => {
                const count = currentData.filter((item: any) => item.category === category.name).length;
                categoriesWithCounts.push({
                    name: category.name,
                    count,
                });
            });
        } else {
            console.log("Categories is not an array:", categories);
        }

        console.log("Categories with counts:", categoriesWithCounts);
        return categoriesWithCounts;
    };

    // ============================================================================
    // EFFECTS
    // ============================================================================
    // Set initial tab based on user role
    useEffect(() => {
        if (user) {
            // Clients see jobs by default, freelancers see talents
            setTab(user.role === "client" ? "jobs" : "talents");
        }
    }, [user]);

    // ============================================================================
    // EVENT HANDLERS
    // ============================================================================
    const handleTabChange = (newTab: "talents" | "jobs") => {
        setTab(newTab);
        setSelectedCategory("All Categories");
        setSearch("");
    };

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
    };

    const handleSearch = (query: string) => {
        setSearch(query);
    };

    const handleRefresh = async () => {
        try {
            if (tab === "talents") {
                await servicesQuery.refetch();
            } else {
                await jobsQuery.refetch();
            }
            // Also refresh categories
            await categoriesQuery.refetch();
        } catch (error) {
            Alert.alert("Error", "Failed to refresh data");
        }
    };

    // ============================================================================
    // RENDER HELPERS
    // ============================================================================
    const renderContent = () => {
        const currentQuery = tab === "talents" ? servicesQuery : jobsQuery;
        const isLoading = currentQuery.isLoading;
        const error = currentQuery.error;
        const data = (currentQuery.data as any)?.data?.data || [];

        if (isLoading && data.length === 0) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            );
        }

        if (error && data.length === 0) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Error: {error.message}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (data.length === 0) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.emptyText}>No {tab === "talents" ? "talents" : "jobs"} found</Text>
                </View>
            );
        }

        return (
            <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={currentQuery.isRefetching} onRefresh={handleRefresh} />}>
                <View style={styles.contentContainer}>
                    {tab === "talents"
                        ? // Render talent cards
                          (data as Service[]).map((service) => (
                              <TalentCard
                                  key={service._id}
                                  talent={{
                                      id: service._id,
                                      name: service.freelancer.name,
                                      title: service.title,
                                      location: service.freelancer.location || "Location not specified",
                                      rating: service.freelancer.rating || 0,
                                      price: service.price,
                                      avatar: service.freelancer.profile_image_url || "",
                                      category: service.category,
                                  }}
                              />
                          ))
                        : // Render job cards
                          (data as Job[]).map((job) => (
                              <JobCard
                                  key={job._id}
                                  job={{
                                      id: job._id,
                                      title: job.title,
                                      image: job.client.profile_image_url || "",
                                      sellerAvatar: job.client.profile_image_url || "",
                                      sellerName: job.client.name,
                                      rating: 4.5, // TODO: Add rating to job model
                                      ratingCount: 0, // TODO: Add rating count to job model
                                      category: job.category,
                                      price: job.budget_max,
                                  }}
                              />
                          ))}

                    {currentQuery.isRefetching && data.length > 0 && (
                        <View style={styles.loadingMoreContainer}>
                            <Text style={styles.loadingMoreText}>Refreshing...</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        );
    };

    // ============================================================================
    // MAIN RENDER
    // ============================================================================
    const categoriesWithCounts = getCategoriesWithCounts();
    return (
        <SafeAreaView style={styles.container}>
            <TopBar />

            <SearchBar value={search} onChange={handleSearch} />

            {!categoriesQuery.isLoading && categoriesWithCounts.length > 0 && (
                <CategoryScroll
                    categories={categoriesWithCounts.map((cat) => cat.name)}
                    selected={selectedCategory}
                    onSelect={handleCategorySelect}
                    displayNames={categoriesWithCounts.map((cat) => `${cat.name} (${cat.count})`)}
                />
            )}

            <ToggleBar tab={tab} setTab={handleTabChange} />

            {renderContent()}

            <Fab />
        </SafeAreaView>
    );
}

// ============================================================================
// STYLES
// ============================================================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingBottom: 100, // Space for FAB
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    loadingText: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    errorText: {
        fontSize: 16,
        color: COLORS.error,
        textAlign: "center",
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: COLORS.background,
        fontSize: 14,
        fontWeight: "600",
    },
    loadingMoreContainer: {
        paddingVertical: 20,
        alignItems: "center",
    },
    loadingMoreText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
});
