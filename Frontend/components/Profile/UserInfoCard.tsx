import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/Colors";
import AuthContext from "@/context/AuthContext";

interface UserInfoCardProps {
    onSwitchRole?: () => void;
    onEditProfile?: () => void;
    profile?: any;
    user?: any;
}

export default function UserInfoCard({ onSwitchRole, onEditProfile, profile, user }: UserInfoCardProps) {
    const { userRole } = useContext(AuthContext);

    const handleSwitchRole = () => {
        onSwitchRole?.();
    };

    const userName = profile?.name || user?.email?.split("@")[0] || "User";

    const avatar = profile?.profile_image_url || "https://www.shutterstock.com/image-vector/man-character-face-avatar-glasses-600nw-542759665.jpg";
    // const avatar = profile?.profile_image_url || "https://www.shutterstock.com/image-vector/man-character-face-avatar-glasses-600nw-542759665.jpg";

    return (
        <View style={styles.userCard}>
            <View style={styles.avatarContainer}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <TouchableOpacity style={styles.cameraButton}>
                    <LinearGradient colors={[COLORS.accent, COLORS.accentSecondary]} style={styles.cameraGradient}>
                        <Ionicons name="camera" size={16} color="white" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <Text style={styles.userName}>{userName}</Text>

            <LinearGradient colors={userRole === "freelancer" ? [COLORS.accentSecondary, COLORS.accent] : [COLORS.accentTertiary, COLORS.accent]} style={styles.roleTag}>
                <Text style={styles.roleText}>{userRole === "freelancer" ? "✨ Freelancer" : "💼 Client"}</Text>
            </LinearGradient>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
                    <Ionicons name="pencil" size={18} color={COLORS.accent} />
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.switchButton} onPress={handleSwitchRole}>
                    <LinearGradient colors={[COLORS.accentTertiary, COLORS.accentSecondary]} style={styles.switchGradient}>
                        <Ionicons name="repeat" size={16} color="white" />
                        <Text style={styles.switchText}>Switch to {userRole === "freelancer" ? "Client" : "Freelancer"}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    userCard: {
        backgroundColor: COLORS.background,
        margin: 16,
        padding: 24,
        borderRadius: 24,
        alignItems: "center",
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 25,
        elevation: 8,
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 16,
    },
    avatar: {
        width: 112,
        height: 112,
        borderRadius: 24,
        borderWidth: 4,
        borderColor: `${COLORS.secondary}33`,
    },
    cameraButton: {
        position: "absolute",
        bottom: -8,
        right: -8,
    },
    cameraGradient: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 6,
    },
    userName: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    verifiedBadge: {
        position: "absolute",
        top: 140,
        right: 100,
        backgroundColor: COLORS.accentTertiary,
        borderRadius: 12,
        padding: 2,
    },
    roleTag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 25,
        elevation: 8,
    },
    roleText: {
        color: COLORS.background,
        fontSize: 14,
        fontWeight: "600",
    },
    buttonContainer: {
        width: "100%",
        gap: 12,
        marginTop: 8,
    },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.accent + "15",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 16,
        gap: 8,
    },
    editButtonText: {
        color: COLORS.accent,
        fontSize: 14,
        fontWeight: "600",
    },
    switchButton: {
        alignItems: "center",
        justifyContent: "center",
    },
    switchGradient: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 16,
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 25,
        elevation: 8,
    },
    switchText: {
        color: COLORS.background,
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 8,
    },
});
