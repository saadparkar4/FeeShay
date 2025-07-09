import React from "react";
import { ScrollView, SafeAreaView } from "react-native";
import HeaderCard from "../../../components/Profile/HeaderCard";
import BioCard from "../../../components/Profile/BioCard";
import PortfolioCard from "../../../components/Profile/PortfolioCard";
import RatingsAndReviews from "../../../components/Profile/RatingsAndReviews";
import AccountSettingsCard from "../../../components/Profile/AccountSettingsCard";
import { PortfolioItem } from "../../../components/Profile/PortfolioCard";
import { useAuth } from "../../../src/contexts/AuthContext";

// Fallback profile to ensure header & bio render when no profile loaded
const FALLBACK_PROFILE = {
    name: "Guest User",
    bio: "Add a short bio to let clients know more about you.",
    location: "Earth",
    member_since: new Date().toISOString(),
    languages: ["English"],
    profile_image_url: "https://randomuser.me/api/portraits/lego/1.jpg",
} as any;

const DUMMY_PORTFOLIO: PortfolioItem[] = [
    { id: "1", image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
    { id: "2", image_url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca" },
    { id: "3", image_url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308" },
    { id: "4", image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
    { id: "5", title: "+12" },
];

// Screen
const ProfileScreen = () => {
    const { user, profile } = useAuth();

    // Prefer loaded profile, otherwise fallback dummy (with user email as name if possible)
    const displayProfile = profile || {
        ...FALLBACK_PROFILE,
        name: user?.email?.split("@")[0] || FALLBACK_PROFILE.name,
        role: user?.role || "freelancer", // used by HeaderCard for role pill
    };

    const handleSettingSelect = (id: string) => {
        // TODO: navigate or logout
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F0FB" }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <HeaderCard profile={displayProfile} onEdit={() => {}} onSwitchRole={() => {}} />
                <BioCard profile={displayProfile} />
                <PortfolioCard items={DUMMY_PORTFOLIO} onAdd={() => {}} onViewAll={() => {}} />
                <RatingsAndReviews onReviewPress={() => {}} />
                <AccountSettingsCard onSelect={handleSettingSelect} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;
