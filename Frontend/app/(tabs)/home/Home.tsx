import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../../src/contexts/AuthContext";
import { useJobs, useServices, useCategories } from "../../../src/hooks/useQueries";
import { COLORS } from "../../../constants/Colors";
import TopBar from "../../../components/Home/TopBar";
import SearchBar from "../../../components/Home/SearchBar";
import CategoryScroll from "../../../components/Home/CategoryScroll";
import ToggleBar from "../../../components/Home/ToggleBar";
import TalentCard from "../../../components/Home/TalentCard";
import JobCard from "../../../components/Home/JobCard";
import Fab from "../../../components/Home/Fab";

// Gradient colors
const GRADIENT = ["#FF2D8B", "#7C3AED"] as const;
const GRADIENT2 = ["#7C3AED", "#FF2D8B"] as const;

// Types
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

function convertDecimalToNumber(value: any): number {
    if (typeof value === "number") return value;
    if (typeof value === "string") return parseFloat(value);
    if (value && typeof value === "object" && value.$numberDecimal) {
        return parseFloat(value.$numberDecimal);
    }
    return 0;
}

function normalizeJobData(job: any): Job {
    return {
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
    };
}

function normalizeServiceData(service: any): Service {
    return {
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
    };
}

export default function HomeScreen() {
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [tab, setTab] = useState<"talents" | "jobs">("talents");
    const [search, setSearch] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    const jobsQuery = useJobs({ search, category: selectedCategory !== "All" ? selectedCategory : undefined });
    const servicesQuery = useServices({ search, category: selectedCategory !== "All" ? selectedCategory : undefined });
    const categoriesQuery = useCategories();

    const isLoading = jobsQuery.isLoading || servicesQuery.isLoading || categoriesQuery.isLoading;
    const isError = jobsQuery.isError || servicesQuery.isError || categoriesQuery.isError;

    // Memoized category list with counts
    const categoriesWithCounts = useMemo(() => {
        let currentData: any[] = [];
        if (tab === "talents") {
            const sData: any = servicesQuery.data;
            if (Array.isArray(sData?.data?.data?.services)) {
                currentData = sData.data.data.services;
            } else if (Array.isArray(sData?.data?.services)) {
                currentData = sData.data.services;
            }
        } else {
            const jData: any = jobsQuery.data;
            if (Array.isArray(jData?.data?.data?.jobs)) {
                currentData = jData.data.data.jobs;
            } else if (Array.isArray(jData?.data?.jobs)) {
                currentData = jData.data.jobs;
            }
        }
        let categories: any[] = [];
        const cData: any = categoriesQuery.data;
        if (Array.isArray(cData?.data?.data)) {
            categories = cData.data.data;
        } else if (Array.isArray(cData?.data)) {
            categories = cData.data;
        }
        const categoriesWithCounts = [
            { name: "All", count: currentData.length },
            ...categories.map((cat: any) => ({
                name: cat.name,
                count: currentData.filter((item: any) => item.category === cat.name).length,
            })),
        ];
        return categoriesWithCounts;
    }, [tab, servicesQuery.data, jobsQuery.data, categoriesQuery.data]);

    const handleTabChange = (newTab: "talents" | "jobs") => {
        setTab(newTab);
        setSelectedCategory("All");
        setSearch("");
    };

    const handleCategorySelect = (category: string) => setSelectedCategory(category);
    const handleSearch = (query: string) => setSearch(query);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            if (tab === "talents") {
                await servicesQuery.refetch();
            } else {
                await jobsQuery.refetch();
            }
            await categoriesQuery.refetch();
        } catch {}
        setRefreshing(false);
    };

    // Featured and all talents/jobs
    const renderFeatured = () => {
        if (tab === "talents") {
            const sData: any = servicesQuery.data;
            const talents: Service[] = Array.isArray(sData?.data?.data?.services)
                ? sData.data.data.services.map(normalizeServiceData)
                : Array.isArray(sData?.data?.services)
                ? sData.data.services.map(normalizeServiceData)
                : [];
            return (
                <View style={styles.featuredRow}>
                    {talents.slice(0, 2).map((talent, idx) => (
                        <LinearGradient key={talent._id} colors={idx === 0 ? GRADIENT : GRADIENT2} style={styles.featuredCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                            <Image source={{ uri: talent.freelancer.profile_image_url || "" }} style={styles.featuredAvatar} />
                            <Text style={styles.featuredName}>{talent.freelancer.name}</Text>
                            <Text style={styles.featuredTitle}>{talent.title}</Text>
                            <View style={styles.featuredRatingRow}>
                                <Ionicons name="star" size={15} color={COLORS.warning} />
                                <Text style={styles.featuredRatingText}>
                                    {talent.freelancer.rating?.toFixed(1) || "4.9"} <Text style={styles.featuredRatingCount}>(124)</Text>
                                </Text>
                            </View>
                            <View style={styles.featuredFooterRow}>
                                <Text style={styles.featuredPrice}>Starting at ${talent.price}</Text>
                                <TouchableOpacity style={styles.featuredProfileBtn}>
                                    <Text style={styles.featuredProfileBtnText}>View Profile</Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    ))}
                </View>
            );
        }
        // Jobs featured (if needed)
        return null;
    };

    const renderAllTalents = () => {
        const sData: any = servicesQuery.data;
        const talents: Service[] = Array.isArray(sData?.data?.data?.services)
            ? sData.data.data.services.map(normalizeServiceData)
            : Array.isArray(sData?.data?.services)
            ? sData.data.services.map(normalizeServiceData)
            : [];
        return talents.map((talent) => (
            <View key={talent._id} style={styles.talentCardWrap}>
                <View style={styles.talentCardRow}>
                    <Image source={{ uri: talent.freelancer.profile_image_url || "" }} style={styles.talentAvatar} />
                    <View style={styles.talentInfoCol}>
                        <View style={styles.talentHeaderRow}>
                            <Text style={styles.talentName}>{talent.freelancer.name}</Text>
                            <View style={styles.talentRatingRow}>
                                <Ionicons name="star" size={15} color={COLORS.warning} />
                                <Text style={styles.talentRatingText}>
                                    {talent.freelancer.rating?.toFixed(1) || "4.8"} <Text style={styles.talentRatingCount}>(156)</Text>
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.talentTitle}>{talent.title}</Text>
                        <View style={styles.talentTagsRow}>
                            {/* Example tags, replace with real data if available */}
                            <Tag text="Logo Design" color="#FF2D8B" />
                            <Tag text="Branding" color="#7C3AED" />
                            <Tag text="Illustration" color="#6366F1" />
                        </View>
                        <View style={styles.talentFooterRow}>
                            <Text style={styles.talentPrice}>Starting at ${talent.price}</Text>
                            <GradientButton text="Hire Now" />
                            <TouchableOpacity style={styles.talentProfileBtn}>
                                <Text style={styles.talentProfileBtnText}>View Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        ));
    };

    // Main render
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
                {/* Top Bar */}
                <TopBar />
                {/* Search Bar */}
                <View style={styles.searchWrap}>
                    <SearchBar value={search} onChange={handleSearch} />
                </View>
                {/* Category Scroll */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScrollWrap} contentContainerStyle={styles.categoryScrollContent}>
                    {categoriesWithCounts.map((cat, idx) => (
                        <TouchableOpacity
                            key={cat.name}
                            style={[styles.categoryPill, selectedCategory === cat.name ? styles.categoryPillActive : styles.categoryPillInactive]}
                            onPress={() => handleCategorySelect(cat.name)}
                        >
                            <Text style={[styles.categoryPillText, selectedCategory === cat.name ? styles.categoryPillTextActive : styles.categoryPillTextInactive]}>
                                {cat.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                {/* Tab Switcher */}
                <View style={styles.tabSwitcherWrap}>
                    <View style={styles.tabSwitcherBg}>
                        <TouchableOpacity style={[styles.tabBtn, tab === "talents" && styles.tabBtnActive]} onPress={() => handleTabChange("talents")}>
                            <Text style={[styles.tabBtnText, tab === "talents" && styles.tabBtnTextActive]}>Talents</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.tabBtn, tab === "jobs" && styles.tabBtnActive]} onPress={() => handleTabChange("jobs")}>
                            <Text style={[styles.tabBtnText, tab === "jobs" && styles.tabBtnTextActive]}>Jobs</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Featured Talents */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeader}>Featured Talents</Text>
                    <TouchableOpacity>
                        <Text style={styles.sectionSeeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                {renderFeatured()}
                {/* All Talents */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeader}>All Talents</Text>
                    <TouchableOpacity>
                        <Text style={styles.sectionSeeAll}>View More</Text>
                    </TouchableOpacity>
                </View>
                {isLoading ? (
                    <ActivityIndicator style={styles.loading} size="large" color={COLORS.primary} />
                ) : isError ? (
                    <Text style={styles.errorText}>Failed to load data. Please try again.</Text>
                ) : (
                    renderAllTalents()
                )}
            </ScrollView>
            {/* Floating Action Button */}
            <TouchableOpacity style={styles.fabWrap}>
                <LinearGradient colors={GRADIENT} style={styles.fabBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <Text style={styles.fabText}>Post Job</Text>
                </LinearGradient>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

// Tag component
function Tag({ text, color }: { text: string; color: string }) {
    return (
        <View style={[styles.tag, { backgroundColor: color + "22" }]}>
            {" "}
            {/* 22 = 13% opacity */}
            <Text style={[styles.tagText, { color }]}>{text}</Text>
        </View>
    );
}

// GradientButton component
function GradientButton({ text }: { text: string }) {
    return (
        <LinearGradient colors={GRADIENT} style={styles.gradientBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.gradientBtnText}>{text}</Text>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#fff" },
    scroll: { flex: 1 },
    searchWrap: { paddingHorizontal: 16, marginTop: 8, marginBottom: 8 },
    categoryScrollWrap: { paddingLeft: 8, marginBottom: 8 },
    categoryScrollContent: { alignItems: "center", paddingRight: 16 },
    categoryPill: { borderRadius: 24, paddingHorizontal: 18, paddingVertical: 8, marginRight: 8, borderWidth: 1 },
    categoryPillActive: { backgroundColor: "#FF2D8B", borderColor: "#FF2D8B" },
    categoryPillInactive: { backgroundColor: "#fff", borderColor: "#E5E7EB" },
    categoryPillText: { fontWeight: "600", fontSize: 15 },
    categoryPillTextActive: { color: "#fff" },
    categoryPillTextInactive: { color: "#6B7280" },
    tabSwitcherWrap: { paddingHorizontal: 16, marginBottom: 12 },
    tabSwitcherBg: { flexDirection: "row", backgroundColor: "#F3F4F6", borderRadius: 16, padding: 4 },
    tabBtn: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 12 },
    tabBtnActive: { backgroundColor: "#FFE4F3", shadowColor: "#FF2D8B", shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
    tabBtnText: { fontWeight: "700", fontSize: 16, color: "#A1A1AA" },
    tabBtnTextActive: { color: "#FF2D8B" },
    sectionHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginTop: 18, marginBottom: 6 },
    sectionHeader: { fontWeight: "bold", fontSize: 18, color: "#222" },
    sectionSeeAll: { color: "#3B82F6", fontWeight: "600", fontSize: 14 },
    featuredRow: { flexDirection: "row", gap: 16, paddingHorizontal: 16, marginBottom: 18 },
    featuredCard: {
        flex: 1,
        borderRadius: 18,
        padding: 18,
        alignItems: "flex-start",
        marginRight: 8,
        minWidth: 180,
        maxWidth: 220,
        shadowColor: "#FF2D8B",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    featuredAvatar: { width: 48, height: 48, borderRadius: 24, marginBottom: 10, borderWidth: 2, borderColor: "#fff" },
    featuredName: { color: "#fff", fontWeight: "bold", fontSize: 17, marginBottom: 2 },
    featuredTitle: { color: "#fff", fontSize: 14, marginBottom: 8 },
    featuredRatingRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    featuredRatingText: { color: "#fff", fontWeight: "600", fontSize: 13, marginLeft: 3 },
    featuredRatingCount: { color: "#FDE68A", fontWeight: "400", fontSize: 12 },
    featuredFooterRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
    featuredPrice: { color: "#fff", fontWeight: "bold", fontSize: 15, marginRight: 12 },
    featuredProfileBtn: { backgroundColor: "#fff", borderRadius: 80, paddingHorizontal: 16, paddingVertical: 6 },
    featuredProfileBtnText: { color: "#FF2D8B", fontWeight: "700", fontSize: 14 },
    talentCardWrap: {
        backgroundColor: "#fff",
        borderRadius: 18,
        marginHorizontal: 16,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        padding: 14,
    },
    talentCardRow: { flexDirection: "row", alignItems: "flex-start" },
    talentAvatar: { width: 56, height: 56, borderRadius: 28, marginRight: 14, backgroundColor: "#F3F4F6" },
    talentInfoCol: { flex: 1 },
    talentHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 2 },
    talentName: { fontWeight: "bold", fontSize: 16, color: "#222" },
    talentRatingRow: { flexDirection: "row", alignItems: "center" },
    talentRatingText: { color: "#FFB300", fontWeight: "600", fontSize: 13, marginLeft: 3 },
    talentRatingCount: { color: "#A1A1AA", fontWeight: "400", fontSize: 12 },
    talentTitle: { color: "#6B7280", fontSize: 13, marginBottom: 6 },
    talentTagsRow: { flexDirection: "row", gap: 6, marginBottom: 8 },
    tag: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6 },
    tagText: { fontWeight: "600", fontSize: 12 },
    talentFooterRow: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 8 },
    talentPrice: { color: "#FF2D8B", fontWeight: "bold", fontSize: 14, marginRight: 8 },
    gradientBtn: { borderRadius: 80, paddingHorizontal: 18, paddingVertical: 7 },
    gradientBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
    talentProfileBtn: { backgroundColor: "#F3F4F6", borderRadius: 80, paddingHorizontal: 16, paddingVertical: 7 },
    talentProfileBtnText: { color: "#222", fontWeight: "700", fontSize: 14 },
    loading: { marginTop: 40 },
    errorText: { color: COLORS.error, textAlign: "center", marginTop: 40 },
    fabWrap: {
        position: "absolute",
        right: 24,
        bottom: 32,
        shadowColor: "#FF2D8B",
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        borderRadius: 32,
    },
    fabBtn: { borderRadius: 32, paddingHorizontal: 22, paddingVertical: 14, alignItems: "center", justifyContent: "center" },
    fabText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
