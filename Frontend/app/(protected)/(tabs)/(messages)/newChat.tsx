import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { getAllUsers } from "@/api/users";
import { createChat } from "@/api/messages";

interface UserProfile {
    _id: string;
    email: string;
    role: "freelancer" | "client";
    profile?: {
        name: string;
        bio?: string;
        location?: string;
        profile_image_url?: string;
        skills?: string[];
    };
}

export default function NewChatScreen() {
    const router = useRouter();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [creating, setCreating] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Fetch users
    const fetchUsers = async (pageNum = 1, search = "") => {
        if (pageNum === 1) setLoading(true);
        setSearching(true);

        try {
            const response = await getAllUsers(pageNum, 20, search);
            if (response.success && response.data) {
                if (pageNum === 1) {
                    setUsers(response.data.users);
                } else {
                    setUsers((prev) => [...prev, ...response.data!.users]);
                }
                setHasMore(response.data.pagination.page < response.data.pagination.pages);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
            setSearching(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle search
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery) {
                setPage(1);
                fetchUsers(1, searchQuery);
            } else {
                setPage(1);
                fetchUsers(1);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    // Handle creating chat
    const handleCreateChat = async (otherUserId: string) => {
        setCreating(true);
        try {
            const response = await createChat(otherUserId);
            if (response.success && response.data) {
                // Navigate to the chat
                router.push({
                    pathname: "/(protected)/(tabs)/(messages)/[id]",
                    params: { id: response.data._id },
                });
            }
        } catch (error) {
            console.error("Error creating chat:", error);
        } finally {
            setCreating(false);
        }
    };

    // Load more users
    const loadMore = () => {
        if (!searching && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchUsers(nextPage, searchQuery);
        }
    };

    // Render user item
    const renderUser = ({ item }: { item: UserProfile }) => {
        const userName = item.profile?.name || item.email;
        const userAvatar = item.profile?.profile_image_url;
        const userBio = item.profile?.bio || `${item.role} on FeeShay`;
        const userRole = item.role === "freelancer" ? "Freelancer" : "Client";

        return (
            <TouchableOpacity style={styles.userItem} onPress={() => handleCreateChat(item._id)} disabled={creating}>
                <View style={styles.avatarContainer}>
                    {userAvatar ? (
                        <Image source={{ uri: userAvatar }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.userName} numberOfLines={1}>
                        {userName}
                    </Text>
                    <Text style={styles.userRole}>{userRole}</Text>
                    <Text style={styles.userBio} numberOfLines={1}>
                        {userBio}
                    </Text>
                </View>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Chat</Text>
                <View style={styles.spacer} />
            </View>

            {/* Search bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={COLORS.textSecondary} />
                <TextInput style={styles.searchInput} placeholder="Search users..." placeholderTextColor={COLORS.textSecondary} value={searchQuery} onChangeText={setSearchQuery} />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* User list */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.accent} />
                </View>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item._id}
                    renderItem={renderUser}
                    contentContainerStyle={styles.listContent}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No users found</Text>
                            <Text style={styles.emptySubtext}>{searchQuery ? "Try a different search" : "No users available"}</Text>
                        </View>
                    }
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={searching && !loading ? <ActivityIndicator style={styles.footerLoader} color={COLORS.accent} /> : null}
                />
            )}

            {/* Loading overlay when creating chat */}
            {creating && (
                <View style={styles.creatingOverlay}>
                    <View style={styles.creatingContainer}>
                        <ActivityIndicator size="large" color={COLORS.accent} />
                        <Text style={styles.creatingText}>Starting chat...</Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: COLORS.textPrimary,
    },
    spacer: {
        width: 40,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        margin: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: COLORS.textPrimary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    listContent: {
        flexGrow: 1,
    },
    userItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    avatarPlaceholder: {
        backgroundColor: COLORS.accent,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        color: COLORS.background,
        fontSize: 20,
        fontWeight: "600",
    },
    userInfo: {
        flex: 1,
        marginRight: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    userRole: {
        fontSize: 12,
        color: COLORS.accent,
        marginBottom: 2,
    },
    userBio: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    separator: {
        height: 1,
        backgroundColor: COLORS.border,
        marginLeft: 78,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 100,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    footerLoader: {
        paddingVertical: 20,
    },
    creatingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    creatingContainer: {
        backgroundColor: COLORS.background,
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
    },
    creatingText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.textPrimary,
    },
});
