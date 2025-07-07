import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { COLORS } from "../../constants/Colors";
import { useProfile, useUpdateProfile } from "../../src/hooks/useQueries";

interface PersonalDetailsProps {
    onClose: () => void;
}

export default function PersonalDetails({ onClose }: PersonalDetailsProps) {
    const { data: profileData, isLoading, error, refetch } = useProfile();
    const updateProfileMutation = useUpdateProfile();

    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        location: "",
        phone: "",
        website: "",
    });

    // Update form data when profile data loads
    React.useEffect(() => {
        if (profileData) {
            const profile = (profileData as any)?.data;
            if (profile) {
                setFormData({
                    name: profile.name || "",
                    bio: profile.bio || "",
                    location: profile.location || "",
                    phone: profile.phone || "",
                    website: profile.website || "",
                });
            }
        }
    }, [profileData]);

    const handleSave = async () => {
        try {
            await updateProfileMutation.mutateAsync(formData);
            Alert.alert("Success", "Profile updated successfully");
            onClose();
        } catch (error) {
            Alert.alert("Error", "Failed to update profile");
        }
    };

    const handleRefresh = async () => {
        try {
            await refetch();
        } catch (error) {
            Alert.alert("Error", "Failed to refresh profile data");
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Failed to load profile</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Personal Details</Text>
                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                        placeholder="Enter your full name"
                        placeholderTextColor={COLORS.placeholder}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.bio}
                        onChangeText={(text) => setFormData({ ...formData, bio: text })}
                        placeholder="Tell us about yourself"
                        placeholderTextColor={COLORS.placeholder}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Location</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.location}
                        onChangeText={(text) => setFormData({ ...formData, location: text })}
                        placeholder="Enter your location"
                        placeholderTextColor={COLORS.placeholder}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.phone}
                        onChangeText={(text) => setFormData({ ...formData, phone: text })}
                        placeholder="Enter your phone number"
                        placeholderTextColor={COLORS.placeholder}
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Website</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.website}
                        onChangeText={(text) => setFormData({ ...formData, website: text })}
                        placeholder="Enter your website URL"
                        placeholderTextColor={COLORS.placeholder}
                        keyboardType="url"
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave} disabled={updateProfileMutation.isPending}>
                        {updateProfileMutation.isPending ? <ActivityIndicator size="small" color={COLORS.background} /> : <Text style={styles.saveButtonText}>Save</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.gray,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: COLORS.error,
        textAlign: "center",
        marginBottom: 10,
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: COLORS.background,
        fontSize: 14,
        fontWeight: "600",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.dark,
    },
    closeButton: {
        fontSize: 24,
        color: COLORS.gray,
        fontWeight: "bold",
    },
    form: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.dark,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: COLORS.dark,
        backgroundColor: COLORS.background,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: COLORS.muted,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
    },
    cancelButtonText: {
        color: COLORS.dark,
        fontSize: 16,
        fontWeight: "600",
    },
    saveButtonText: {
        color: COLORS.background,
        fontSize: 16,
        fontWeight: "600",
    },
});
