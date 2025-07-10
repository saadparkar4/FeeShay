// ============================================================================
// SERVICE CARD COMPONENT (JobCard)
// ============================================================================
// Modern card for displaying a freelance service/job, matching the provided design
// Features:
// - Left: Service image (object cover, rounded left)
// - Right: Title, seller avatar/name, rating, category badge, price
// - White background, rounded corners, shadow, border, overflow hidden
// - Color-coded category badge
// ============================================================================

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { COLORS, getCategoryColors } from '../../constants/Colors';

// Note: Category colors are now managed centrally in Colors.ts

// Service/job data interface
interface Job {
  id: string;
  title: string;
  image: string;
  sellerAvatar: string;
  sellerName: string;
  rating: number;
  ratingCount: number;
  category: string;
  price: number;
}

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  // Get router for navigation to job details
  const router = useRouter();
  
  // Get category-specific colors for the badge
  const categoryColors = getCategoryColors(job.category);

  // Handle navigation to job details screen when card is tapped
  const handlePress = () => {
    // Navigate to job details screen with job ID as parameter
    router.push(`/(protected)/(tabs)/(home)/job/${job.id}`);
  };

  return (
    // Remove the touchable from the whole card
    <View style={styles.card}>
      {/* Left: Service image */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: job.image }} style={styles.image} resizeMode="cover" />
      </View>
      {/* Right: Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>{job.title}</Text>
        {/* Seller row */}
        <View style={styles.sellerRow}>
          <Image source={{ uri: job.sellerAvatar }} style={styles.avatar} />
          <Text style={styles.sellerName}>{job.sellerName}</Text>
        </View>
        {/* Footer: Category badge & price */}
        <View style={styles.footerRow}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColors.bg }]}> 
            <Text style={[styles.categoryText, { color: categoryColors.text }]}>{job.category}</Text>
          </View>
          <Text style={styles.price}>{job.price} KD</Text>
        </View>
        {/* Apply button centered */}
        <TouchableOpacity style={styles.applyButton} onPress={handlePress} activeOpacity={0.8}>
          <LinearGradient
            colors={[COLORS.accent, COLORS.accentSecondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ============================================================================
// STYLES FOR SERVICE CARD
// ============================================================================
const styles = StyleSheet.create({
  // Main card container - no longer touchable
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 4,
    minHeight: 140,
  },
  imageWrapper: {
    width: 100,
    height: 140,
    backgroundColor: COLORS.border,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
    backgroundColor: COLORS.muted,
  },
  sellerName: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 3,
    fontWeight: '500',
  },
  ratingCount: {
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  price: {
    color: COLORS.accent,
    fontWeight: 'bold',
    fontSize: 15,
  },
  applyButton: {
    width: '100%',
    height: 36,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '600',
  },
}); 