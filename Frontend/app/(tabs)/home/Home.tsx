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
// HELPER FUNCTIONS
// ============================================================================
const convertDecimalToNumber = (value: any): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string") return parseFloat(value);
    if (value && typeof value === "object" && value.$numberDecimal) {
        return parseFloat(value.$numberDecimal);
    }
    return 0;
};

const normalizeJobData = (job: any): Job => ({
    _id: job._id,
    title: job.title,
    description: job.description,
    category: job.category?.name || job.category,
    budget_min: convertDecimalToNumber(job.budget_min),
    budget_max: convertDecimalToNumber(job.budget_max),
    status: job.status,
    created_at: job.created_at,
    client: {
        name: job.client?.name || "",
        profile_image_url: job.client?.profile_image_url || "",
    },
});

const normalizeServiceData = (service: any): Service => ({
    _id: service._id,
    title: service.title,
    description: service.description,
    category: service.category?.name || service.category,
    price: convertDecimalToNumber(service.price),
    delivery_time_days: service.delivery_time_days,
    status: service.status,
    created_at: service.created_at,
    freelancer: {
        name: service.freelancer?.name || "",
        profile_image_url: service.freelancer?.profile_image_url || "",
        rating: service.freelancer?.rating || 0,
        location: service.freelancer?.location || "",
    },
});

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

    // Debug authentication and query status
    console.log("Auth status:", {
        user: !!user,
        userRole: user?.role,
        isAuthenticated: !!user,
    });

    console.log("Query status:", {
        jobsQuery: {
            isLoading: jobsQuery.isLoading,
            isError: jobsQuery.isError,
            error: jobsQuery.error,
            data: !!jobsQuery.data,
        },
        servicesQuery: {
            isLoading: servicesQuery.isLoading,
            isError: servicesQuery.isError,
            error: servicesQuery.error,
            data: !!servicesQuery.data,
        },
        categoriesQuery: {
            isLoading: categoriesQuery.isLoading,
            isError: categoriesQuery.isError,
            error: categoriesQuery.error,
            data: !!categoriesQuery.data,
        },
    });

    // ============================================================================
    // DYNAMIC CATEGORY GENERATION WITH COUNTS
    // ============================================================================
    const getCategoriesWithCounts = () => {
        let currentData: any[] = [];
        if (tab === "talents") {
            const sData: any = (servicesQuery as any).data;
            if (Array.isArray(sData?.data?.data?.services)) {
                currentData = sData.data.data.services;
            } else if (Array.isArray(sData?.data?.services)) {
                currentData = sData.data.services;
            }
        } else {
            const jData: any = (jobsQuery as any).data;
            if (Array.isArray(jData?.data?.data?.jobs)) {
                currentData = jData.data.data.jobs;
            } else if (Array.isArray(jData?.data?.jobs)) {
                currentData = jData.data.jobs;
            }
        }
        let categories: any[] = [];
        const cData: any = (categoriesQuery as any).data;
        if (Array.isArray(cData?.data?.data)) {
            categories = cData.data.data;
        } else if (Array.isArray(cData?.data)) {
            categories = cData.data;
        }

        console.log("Categories data:", {
            hasData: !!cData,
            hasDataData: !!cData?.data,
            hasDataDataData: !!cData?.data?.data,
            categoriesLength: categories.length,
            categories: categories,
        });

        // Start with "All Categories" option
        const categoriesWithCounts = [
            {
                name: "All Categories",
                count: currentData.length,
            },
        ];

        // Add categories from database with counts from current data
        if (categories && Array.isArray(categories)) {
            categories.forEach((category: any) => {
                const count = currentData.filter((item: any) => item.category === category.name).length;
                categoriesWithCounts.push({
                    name: category.name,
                    count,
                });
            });
        }
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

        // Defensive extraction: try to get an array from the response
        let data: any[] = [];
        const cData: any = (currentQuery as any).data;
        console.log(`${tab} query data structure:`, {
            hasData: !!cData,
            hasDataData: !!cData?.data,
            hasDataDataJobs: !!cData?.data?.jobs,
            hasDataDataServices: !!cData?.data?.services,
            dataKeys: cData ? Object.keys(cData) : [],
            dataDataKeys: cData?.data ? Object.keys(cData.data) : [],
        });
        console.log(`${tab} full query data:`, JSON.stringify(cData, null, 2));

        if (tab === "talents") {
            if (Array.isArray(cData?.data?.data?.services)) {
                data = cData.data.data.services;
                console.log("Services data extracted:", data.length, "items");
            } else if (Array.isArray(cData?.data?.services)) {
                data = cData.data.services;
                console.log("Services fallback data extracted:", data.length, "items");
            }
        } else {
            if (Array.isArray(cData?.data?.data?.jobs)) {
                data = cData.data.data.jobs;
                console.log("Jobs data extracted:", data.length, "items");
            } else if (Array.isArray(cData?.data?.jobs)) {
                data = cData.data.jobs;
                console.log("Jobs fallback data extracted:", data.length, "items");
            }
        }
        console.log("Final data array length:", data.length);
        console.log("First item in data array:", data[0]);

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
                        ? data.map((service: any) => {
                              const normalizedService = normalizeServiceData(service);
                              return (
                                  <TalentCard
                                      key={normalizedService._id}
                                      talent={{
                                          id: normalizedService._id,
                                          name: normalizedService.freelancer.name,
                                          title: normalizedService.title,
                                          location: normalizedService.freelancer.location || "Location not specified",
                                          rating: normalizedService.freelancer.rating || 0,
                                          price: normalizedService.price,
                                          avatar: normalizedService.freelancer.profile_image_url || "",
                                          category: normalizedService.category,
                                      }}
                                  />
                              );
                          })
                        : data.map((job: any) => {
                              const normalizedJob = normalizeJobData(job);
                              return (
                                  <JobCard
                                      key={normalizedJob._id}
                                      job={{
                                          id: normalizedJob._id,
                                          title: normalizedJob.title,
                                          image: normalizedJob.client.profile_image_url || "",
                                          sellerAvatar: normalizedJob.client.profile_image_url || "",
                                          sellerName: normalizedJob.client.name,
                                          rating: 4.5, // TODO: Add rating to job model
                                          ratingCount: 0, // TODO: Add rating count to job model
                                          category: normalizedJob.category,
                                          price: normalizedJob.budget_max,
                                      }}
                                  />
                              );
                          })}

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
        // flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingBottom: 100, // Space for FAB
    },
    centerContainer: {
        // flex: 1,
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
