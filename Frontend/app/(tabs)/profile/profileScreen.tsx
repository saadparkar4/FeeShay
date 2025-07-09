import React from "react";
import { Button, ScrollView, View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileHeader from "../../../components/Profile/ProfileHeader";
import PersonalDetails from "../../../components/Profile/PersonalDetails";
import JobPostCard from "../../../components/Profile/JobPostCard";
import RatingsAndReviews from "../../../components/Profile/RatingsAndReviews";
import SettingsPanel from "../../../components/Profile/SettingsPanel";
import { useAuth } from "../../../src/contexts/AuthContext";
import { router } from "expo-router";

const DUMMY_USER = {
    name: "Alex Morgan",
    title: "Digital Marketing Specialist",
    bio: "Experienced marketing professional with expertise in digital campaigns, SEO, and content strategy. Looking for talented freelancers to help grow my business.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    location: "New York, United States",
    languages: [
        { name: "English", level: "Native" },
        { name: "Spanish", level: "Fluent" },
        { name: "French", level: "Basic" },
    ],
    clientSince: "March 2022",
};

const DUMMY_JOBS = [
    {
        id: "1",
        title: "Social Media Campaign",
        status: "Active",
        description: "Looking for a social media expert to manage our platforms...",
        posted: "3 days ago",
        actions: ["Edit", "Delete"],
    },
    {
        id: "2",
        title: "Website Content Writer",
        status: "Completed",
        description: "Hired a content writer to create engaging articles for our blog...",
        posted: "2 weeks ago",
        actions: ["View"],
    },
    {
        id: "3",
        title: "Logo Redesign Project",
        status: "In Progress",
        description: "Working with a designer to refresh our company logo...",
        posted: "1 week ago",
        actions: ["Chat"],
    },
];

const DUMMY_REVIEWS = [
    {
        id: "r1",
        reviewer: { name: "Sarah Johnson", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
        rating: 5,
        comment: "Great client to work with! Clear instructions and prompt payment. Would definitely work with again.",
        date: "2 weeks ago",
    },
    {
        id: "r2",
        reviewer: { name: "Michael Chen", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
        rating: 4,
        comment: "Alex was very professional and provided detailed feedback throughout the project. Communication was excellent.",
        date: "1 month ago",
    },
];

const ProfileScreen = () => {
    const { user, isAuthenticated, logout } = useAuth();

    // Handler functions for component callbacks
    const handleEditPress = () => {};
    const handleClose = () => {};
    const handleJobPress = (jobId: string) => {};
    const handleReviewPress = (reviewId: string) => {};
    const handleSettingPress = (setting: string) => {};

    // Dummy data fallback
    const profileData = isAuthenticated && user ? DUMMY_USER : DUMMY_USER;
    const jobs = isAuthenticated ? undefined : DUMMY_JOBS;
    // const reviews = isAuthenticated ? undefined : DUMMY_REVIEWS;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <ScrollView contentContainerStyle={{ padding: 0 }}>
                <View style={{ padding: 0 }}>
                    {isAuthenticated ? (
                        <>
                            <ProfileHeader onEditPress={handleEditPress} />
                            <PersonalDetails onClose={handleClose} />
                        </>
                    ) : (
                        <>
                            {/* Dummy Profile Header */}
                            <View
                                style={{
                                    backgroundColor: "#fff",
                                    padding: 20,
                                    borderRadius: 10,
                                    marginHorizontal: 20,
                                    marginTop: 20,
                                    alignItems: "center",
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 3.84,
                                    elevation: 5,
                                }}
                            >
                                <View style={{ alignItems: "center" }}>
                                    <View style={{ position: "relative", marginBottom: 12 }}>
                                        <Image source={{ uri: profileData.avatar }} style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: "#F72585" }} />
                                        <TouchableOpacity
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                right: 0,
                                                backgroundColor: "#F72585",
                                                paddingHorizontal: 8,
                                                paddingVertical: 4,
                                                borderRadius: 12,
                                            }}
                                        >
                                            <Text style={{ color: "#fff", fontSize: 10, fontWeight: "600" }}>Edit</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={{ fontSize: 24, fontWeight: "bold", color: "#2C2C2C", marginBottom: 4 }}>{profileData.name}</Text>
                                    <Text style={{ fontSize: 16, color: "#F72585", fontWeight: "600", marginBottom: 4 }}>{profileData.title}</Text>
                                    <Text style={{ fontSize: 14, color: "#6D6D6D", marginBottom: 4 }}>{profileData.bio}</Text>
                                </View>
                            </View>
                            {/* Dummy Personal Details */}
                            <View
                                style={{
                                    backgroundColor: "#fff",
                                    borderRadius: 10,
                                    marginHorizontal: 20,
                                    marginTop: 20,
                                    padding: 20,
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 3.84,
                                    elevation: 5,
                                }}
                            >
                                <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 12 }}>Personal Details</Text>
                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                                    <Text style={{ fontSize: 16, marginRight: 8 }}>📍</Text>
                                    <Text style={{ fontSize: 14, color: "#2C2C2C" }}>{profileData.location}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
                                    <Text style={{ fontSize: 16, marginRight: 8 }}>🗣️</Text>
                                    {profileData.languages.map((lang, idx) => (
                                        <View
                                            key={lang.name}
                                            style={{ backgroundColor: "#F1F3F9", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6, marginBottom: 4 }}
                                        >
                                            <Text style={{ fontSize: 12, color: "#2C2C2C" }}>
                                                {lang.name} ({lang.level})
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                                    <Text style={{ fontSize: 16, marginRight: 8 }}>📅</Text>
                                    <Text style={{ fontSize: 14, color: "#2C2C2C" }}>
                                        Member since <Text style={{ fontWeight: "bold" }}>{DUMMY_USER.clientSince}</Text>
                                    </Text>
                                </View>
                            </View>
                        </>
                    )}
                    <View style={{ paddingHorizontal: 16 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 24, marginBottom: 8 }}>
                            <Text style={{ fontWeight: "bold", fontSize: 16 }}>My Job Posts</Text>
                            <TouchableOpacity onPress={() => {}}>
                                <Text style={{ color: "#7209B7", fontWeight: "600" }}>View All</Text>
                            </TouchableOpacity>
                        </View>
                        {isAuthenticated ? (
                            <JobPostCard onJobPress={handleJobPress} />
                        ) : (
                            (jobs || []).map((job) => (
                                <View key={job.id} style={{ backgroundColor: "#F1F3F9", borderRadius: 10, padding: 16, marginBottom: 12 }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <Text style={{ fontWeight: "bold", fontSize: 15 }}>{job.title}</Text>
                                        <View
                                            style={{
                                                backgroundColor: job.status === "Active" ? "#22C55E" : job.status === "Completed" ? "#6D6D6D" : "#FACC15",
                                                borderRadius: 8,
                                                paddingHorizontal: 8,
                                                paddingVertical: 2,
                                            }}
                                        >
                                            <Text style={{ color: "#fff", fontSize: 12 }}>{job.status}</Text>
                                        </View>
                                    </View>
                                    <Text style={{ color: "#6D6D6D", marginTop: 4 }}>{job.description}</Text>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                                        <Text style={{ color: "#A9A9A9", fontSize: 12 }}>Posted {job.posted}</Text>
                                        <View style={{ flexDirection: "row", marginLeft: "auto", gap: 8 }}>
                                            {job.actions.map((action) => (
                                                <TouchableOpacity
                                                    key={action}
                                                    style={{ marginLeft: 8, backgroundColor: "#E2E8F0", borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 }}
                                                >
                                                    <Text style={{ color: "#2C2C2C", fontSize: 12 }}>{action}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                    <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
                        {isAuthenticated ? (
                            <RatingsAndReviews onReviewPress={handleReviewPress} />
                        ) : (
                            <View
                                style={{
                                    backgroundColor: "#fff",
                                    borderRadius: 10,
                                    padding: 20,
                                    marginHorizontal: 4,
                                    marginBottom: 16,
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 3.84,
                                    elevation: 5,
                                }}
                            >
                                <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>Ratings & Reviews</Text>
                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                                    <Text style={{ fontSize: 28, fontWeight: "bold", color: "#F72585", marginRight: 8 }}>4.8</Text>
                                    <Text style={{ fontSize: 18, color: "#FACC15", marginRight: 8 }}>★★★★★</Text>
                                    <Text style={{ color: "#6D6D6D", fontSize: 14 }}>Based on 12 reviews</Text>
                                </View>
                                {DUMMY_REVIEWS.map((review) => (
                                    <View key={review.id} style={{ flexDirection: "row", marginBottom: 16 }}>
                                        <Image source={{ uri: review.reviewer.avatar }} style={{ width: 36, height: 36, borderRadius: 18, marginRight: 12 }} />
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
                                                <Text style={{ fontWeight: "bold", fontSize: 14, marginRight: 8 }}>{review.reviewer.name}</Text>
                                                <Text style={{ color: "#FACC15", fontSize: 14 }}>
                                                    {"★".repeat(review.rating)}
                                                    {"☆".repeat(5 - review.rating)}
                                                </Text>
                                                <Text style={{ color: "#A9A9A9", fontSize: 12, marginLeft: 8 }}>{review.date}</Text>
                                            </View>
                                            <Text style={{ color: "#2C2C2C", fontSize: 13 }}>{review.comment}</Text>
                                        </View>
                                    </View>
                                ))}
                                <TouchableOpacity style={{ alignItems: "center", marginTop: 4 }}>
                                    <Text style={{ color: "#7209B7", fontWeight: "600", fontSize: 14 }}>See All Reviews ▼</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
                        <SettingsPanel onSettingPress={handleSettingPress} />
                    </View>
                    <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 32 }}>
                        <TouchableOpacity style={{ backgroundColor: "#F72585", borderRadius: 8, paddingVertical: 12, alignItems: "center", marginBottom: 12 }} onPress={logout}>
                            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Logout</Text>
                        </TouchableOpacity>
                        {!isAuthenticated && (
                            <>
                                <TouchableOpacity
                                    style={{ backgroundColor: "#7209B7", borderRadius: 8, paddingVertical: 12, alignItems: "center", marginBottom: 8 }}
                                    onPress={() => router.push("./login")}
                                >
                                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Login</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ backgroundColor: "#4361EE", borderRadius: 8, paddingVertical: 12, alignItems: "center" }}
                                    onPress={() => router.push("./signup")}
                                >
                                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Sign Up</Text>
                                </TouchableOpacity>

                                <Button title="Job Post" onPress={() => router.push("../details/JobPost")} />
                                <Button title="Services" onPress={() => router.push("./details/Services")} />
                            </>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;
