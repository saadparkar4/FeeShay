import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { COLORS } from "../../constants/Colors";
import { useReviews } from "../../src/hooks/useQueries";

interface RatingsAndReviewsProps {
    onReviewPress: (reviewId: string) => void;
}

export default function RatingsAndReviews({ onReviewPress }: RatingsAndReviewsProps) {
    const { data: reviewsData, isLoading, error, refetch } = useReviews();

    const handleRefresh = async () => {
        try {
            await refetch();
        } catch (error) {
            Alert.alert("Error", "Failed to refresh reviews data");
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading reviews...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Failed to load reviews</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const reviews = (reviewsData as any)?.data?.data || [];

    // Safety check to ensure reviews is always an array
    const safeReviews = Array.isArray(reviews) ? reviews : [];

    if (reviews.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>No Reviews Yet</Text>
                    <Text style={styles.emptyText}>You don&apos;t have any reviews yet.</Text>
                </View>
            </View>
        );
    }

    // Calculate average rating
    const averageRating = safeReviews.length > 0 ? safeReviews.reduce((sum: number, review: any) => sum + review.rating, 0) / safeReviews.length : 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Ratings & Reviews</Text>
                <TouchableOpacity style={styles.seeAllButton}>
                    <Text style={styles.seeAllButtonText}>See All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.ratingSummary}>
                <View style={styles.ratingContainer}>
                    <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
                    <Text style={styles.ratingLabel}>Average Rating</Text>
                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Text key={star} style={[styles.star, star <= averageRating ? styles.filledStar : styles.emptyStar]}>
                                ★
                            </Text>
                        ))}
                    </View>
                </View>
                <View style={styles.reviewCount}>
                    <Text style={styles.reviewCountText}>{safeReviews.length} reviews</Text>
                </View>
            </View>

            <View style={styles.reviewsList}>
                {safeReviews.slice(0, 3).map((review: any) => (
                    <TouchableOpacity key={review._id} style={styles.reviewCard} onPress={() => onReviewPress(review._id)}>
                        <View style={styles.reviewHeader}>
                            <View style={styles.reviewerInfo}>
                                <Text style={styles.reviewerName}>{review.reviewer?.name || "Anonymous"}</Text>
                                <View style={styles.starsContainer}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Text key={star} style={[styles.star, star <= review.rating ? styles.filledStar : styles.emptyStar]}>
                                            ★
                                        </Text>
                                    ))}
                                </View>
                            </View>
                            <Text style={styles.reviewDate}>{new Date(review.created_at).toLocaleDateString()}</Text>
                        </View>

                        <Text style={styles.reviewComment} numberOfLines={3}>
                            {review.comment || "No comment provided"}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {safeReviews.length > 3 && (
                <TouchableOpacity style={styles.viewMoreButton}>
                    <Text style={styles.viewMoreButtonText}>View {safeReviews.length - 3} more reviews</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 20,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loadingContainer: {
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.gray,
    },
    errorContainer: {
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
    emptyContainer: {
        alignItems: "center",
        padding: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.dark,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.gray,
        textAlign: "center",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.dark,
    },
    seeAllButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    seeAllButtonText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: "600",
    },
    ratingSummary: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    ratingContainer: {
        flex: 1,
        alignItems: "center",
    },
    averageRating: {
        fontSize: 32,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    ratingLabel: {
        fontSize: 14,
        color: COLORS.gray,
        marginBottom: 5,
    },
    starsContainer: {
        flexDirection: "row",
    },
    star: {
        fontSize: 16,
        marginHorizontal: 1,
    },
    filledStar: {
        color: COLORS.warning,
    },
    emptyStar: {
        color: COLORS.border,
    },
    reviewCount: {
        flex: 1,
        alignItems: "center",
    },
    reviewCountText: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.dark,
    },
    reviewsList: {
        gap: 12,
    },
    reviewCard: {
        backgroundColor: COLORS.muted,
        borderRadius: 8,
        padding: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    reviewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    reviewerInfo: {
        flex: 1,
    },
    reviewerName: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.dark,
        marginBottom: 4,
    },
    reviewDate: {
        fontSize: 12,
        color: COLORS.gray,
    },
    reviewComment: {
        fontSize: 14,
        color: COLORS.gray,
        lineHeight: 20,
    },
    viewMoreButton: {
        alignItems: "center",
        marginTop: 15,
        paddingVertical: 10,
    },
    viewMoreButtonText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: "600",
    },
});
