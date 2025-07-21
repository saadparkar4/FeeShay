/**
 * Send Proposal Screen Component
 *
 * Allows users to send a proposal for a specific job
 * Features:
 * - Service selection dropdown
 * - Project details form
 * - File attachments
 * - Budget and deadline inputs
 * - Proposal summary preview
 * - Send proposal action
 */

import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Platform, KeyboardAvoidingView, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/Colors";
import proposalApi from "@/api/proposals";

export default function SendProposalScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const jobId = params.jobId as string; // Get jobId from route params

    // Form state
    // const [selectedService, setSelectedService] = useState("");
    const [projectTitle, setProjectTitle] = useState("");
    // const [description, setDescription] = useState("");
    const [deliverables, setDeliverables] = useState("");
    const [budget, setBudget] = useState("75");
    const [attachments, setAttachments] = useState<Array<{ id: string; name: string; size: string }>>([]);
    const [loading, setLoading] = useState(false);

    // Mock services data
    // const services = [
    //   'Logo Design Package - Starting at 75 KD',
    //   'Brand Identity Complete - Starting at 150 KD',
    //   'Business Card Design - Starting at 35 KD',
    //   'Custom Illustration - Starting at 90 KD',
    // ];

    const handleSendProposal = async () => {
        if (!projectTitle || !budget) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
        }

        setLoading(true);
        try {
            // Combine all the form data into cover letter
            const coverLetter = `
Project Title: ${projectTitle || "N/A"}
Deliverables:
${deliverables || "As discussed"}
      `.trim();

            const proposalData = {
                job: jobId,
                cover_letter: coverLetter,
                proposed_price: parseFloat(budget),
            };

            const response = await proposalApi.createProposal(proposalData);

            if (response.success) {
                Alert.alert("Success", "Your proposal has been submitted successfully!", [
                    {
                        text: "OK",
                        onPress: () => router.back(),
                    },
                ]);
            }
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || "Failed to submit proposal");
        } finally {
            setLoading(false);
        }
    };

    const handleAddFiles = () => {
        // Mock file addition
        const newFile = {
            id: Date.now().toString(),
            name: "reference-design.jpg",
            size: "245 KB",
        };
        setAttachments([...attachments, newFile]);
    };

    const handleRemoveFile = (id: string) => {
        setAttachments(attachments.filter((file) => file.id !== id));
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Submit Proposal</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="help-circle-outline" size={24} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
                        <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                    {/* Service Selection
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Service</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{selectedService}</Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.accent} />
            </TouchableOpacity>
          </View> */}

                    {/* Project Details */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Proposal Details</Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Proposal Details /"
                                placeholderTextColor={COLORS.textSecondary}
                                value={projectTitle}
                                multiline
                                onChangeText={setProjectTitle}
                            />
                        </View>

                        {/* <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your proposal in detail"
                placeholderTextColor={COLORS.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View> */}

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="List what the client should expect to receive. 
                Eg. Logo, PDF, Code Repo, etc."
                                placeholderTextColor={COLORS.textSecondary}
                                value={deliverables}
                                onChangeText={setDeliverables}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Budget (KD)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="75"
                                placeholderTextColor={COLORS.textSecondary}
                                value={budget}
                                onChangeText={setBudget}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/* Attachments */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Attachments (Optional)</Text>
                        <TouchableOpacity style={styles.uploadArea} onPress={handleAddFiles}>
                            <Ionicons name="cloud-upload-outline" size={40} color={COLORS.accent} />
                            <Text style={styles.uploadText}>Drop files here or click to upload</Text>
                            <Text style={styles.uploadSubtext}>PNG, JPG, PDF up to 10MB</Text>
                            <LinearGradient colors={[COLORS.accent, COLORS.accentSecondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.addFilesButton}>
                                <Ionicons name="add" size={18} color="white" />
                                <Text style={styles.addFilesText}>Add Files</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* File List */}
                        {attachments.map((file) => (
                            <View key={file.id} style={styles.fileItem}>
                                <Ionicons name="document-outline" size={20} color={COLORS.accentTertiary} />
                                <View style={styles.fileInfo}>
                                    <Text style={styles.fileName}>{file.name}</Text>
                                    <Text style={styles.fileSize}>{file.size}</Text>
                                </View>
                                <TouchableOpacity onPress={() => handleRemoveFile(file.id)}>
                                    <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    {/* Proposal Summary
          <View style={[styles.section, styles.summarySection]}>
            <Text style={styles.sectionTitle}>Proposal Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service:</Text>
              <Text style={styles.summaryValue}>Logo Design Package</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated Cost:</Text>
              <Text style={[styles.summaryValue, styles.priceText]}>{budget} KD</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated Delivery:</Text>
              <Text style={[styles.summaryValue, styles.deliveryText]}>5-7 business days</Text>
            </View>
          </View> */}

                    {/* Action Buttons */}
                    <TouchableOpacity onPress={handleSendProposal} activeOpacity={0.8}>
                        <LinearGradient colors={[COLORS.accent, COLORS.accentSecondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.sendButton}>
                            <Text style={styles.sendButtonText}>{loading ? "Submitting..." : "Submit Proposal"}</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    backButton: {
        marginRight: 12,
    },
    iconButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: COLORS.textPrimary,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    section: {
        backgroundColor: COLORS.background,
        borderRadius: 24,
        padding: 20,
        marginTop: 16,
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 25,
        elevation: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.textPrimary,
        marginBottom: 16,
    },
    dropdown: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 2,
        borderColor: `${COLORS.accent}20`,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: COLORS.background,
    },
    dropdownText: {
        fontSize: 14,
        color: COLORS.textPrimary,
        flex: 1,
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    input: {
        borderWidth: 2,
        borderColor: `${COLORS.accent}20`,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 14,
        color: COLORS.textPrimary,
        backgroundColor: `${COLORS.accent}05`,
    },
    textArea: {
        minHeight: 100,
        paddingTop: 14,
    },
    uploadArea: {
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: COLORS.accent,
        borderRadius: 24,
        padding: 32,
        alignItems: "center",
        backgroundColor: `${COLORS.accent}08`,
    },
    uploadText: {
        fontSize: 14,
        color: COLORS.textPrimary,
        marginTop: 12,
        marginBottom: 4,
    },
    uploadSubtext: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 16,
    },
    addFilesButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    addFilesText: {
        color: "white",
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 6,
    },
    fileItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.background,
        borderRadius: 12,
        padding: 12,
        marginTop: 12,
    },
    fileInfo: {
        flex: 1,
        marginLeft: 12,
    },
    fileName: {
        fontSize: 14,
        color: COLORS.textPrimary,
        fontWeight: "500",
    },
    fileSize: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    summarySection: {
        backgroundColor: `${COLORS.accent}08`,
        borderWidth: 1,
        borderColor: `${COLORS.accent}20`,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 25,
        elevation: 8,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textPrimary,
    },
    priceText: {
        color: COLORS.accent,
        fontSize: 16,
    },
    deliveryText: {
        color: COLORS.accentSecondary,
    },
    sendButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 16,
        marginTop: 24,
        marginHorizontal: 16,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    sendButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
    },
    cancelButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderRadius: 16,
        marginTop: 12,
        marginHorizontal: 16,
        marginBottom: 24,
        backgroundColor: COLORS.muted,
    },
    cancelButtonText: {
        color: COLORS.textPrimary,
        fontSize: 16,
        fontWeight: "500",
    },
});
