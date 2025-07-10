import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/Colors';

interface Review {
  name: string;
  rating: number;
  text: string;
  time: string;
  avatar: string;
}

interface ReviewsSectionProps {
  onViewAll?: () => void;
}

const reviews: Review[] = [
  { 
    name: 'Alex Johnson', 
    rating: 5, 
    text: 'Sarah did an amazing job with our logo design. Very professional and responsive throughout the process. 🚀', 
    time: '2 days ago',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg'
  },
  { 
    name: 'Emma Wilson', 
    rating: 4, 
    text: 'Great illustrations for our website. Would have liked a bit more revisions, but overall very satisfied with the work.', 
    time: '1 week ago',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg'
  },
  { 
    name: 'Michael Brown', 
    rating: 4.5, 
    text: 'Sarah created a beautiful brand identity for my startup. She was able to capture our vision perfectly.', 
    time: '2 weeks ago',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg'
  },
];

export default function ReviewsSection({ onViewAll }: ReviewsSectionProps) {
  const renderStars = (rating: number, size: number = 10) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Ionicons
        key={star}
        name={star <= Math.floor(rating) ? "star" : rating % 1 && star === Math.ceil(rating) ? "star-half" : "star-outline"}
        size={size}
        color={COLORS.warning}
      />
    ));
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        <TouchableOpacity onPress={onViewAll}>
          <LinearGradient
            colors={[COLORS.accentTertiary, COLORS.accent]}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      <View style={styles.ratingOverview}>
        <View style={styles.ratingLeft}>
          <Text style={styles.ratingNumber}>4.8</Text>
          <View style={styles.starsContainer}>
            {renderStars(4.8, 14)}
          </View>
        </View>
        <View style={styles.ratingRight}>
          <Text style={styles.ratingText}>Based on 47 reviews</Text>
          <View style={styles.ratingBar}>
            <LinearGradient
              colors={[COLORS.accent, COLORS.accentSecondary]}
              style={[styles.ratingFill, { width: '85%' }]}
            />
          </View>
        </View>
      </View>
      
      {/* Review Items */}
      {reviews.map((review, index) => (
        <View 
          key={index} 
          style={[
            styles.reviewItem, 
            { backgroundColor: index === 0 ? `${COLORS.accent}10` : index === 1 ? `${COLORS.accentSecondary}10` : `${COLORS.accentTertiary}10` }
          ]}
        >
          <View style={styles.reviewHeader}>
            <View style={styles.reviewerInfo}>
              {review.avatar && review.avatar.trim() !== '' ? (
                <Image
                  source={{ uri: review.avatar }}
                  style={styles.reviewerAvatar}
                />
              ) : (
                <View style={[styles.reviewerAvatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarText}>{review.name ? review.name.charAt(0).toUpperCase() : '?'}</Text>
                </View>
              )}
              <View>
                <Text style={styles.reviewerName}>{review.name}</Text>
                <View style={styles.reviewStars}>
                  {renderStars(review.rating)}
                </View>
              </View>
            </View>
            <Text style={styles.reviewTime}>{review.time}</Text>
          </View>
          <Text style={styles.reviewText}>{review.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: COLORS.background,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 24,
    borderRadius: 24,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  viewAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
  },
  viewAllText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '600',
  },
  ratingOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.accent}08`,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  ratingLeft: {
    marginRight: 16,
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  ratingRight: {
    flex: 1,
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 8,
  },
  ratingBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingFill: {
    height: '100%',
    borderRadius: 4,
  },
  reviewItem: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 16,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  reviewStars: {
    flexDirection: 'row',
  },
  reviewTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reviewText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 21,
  },
});