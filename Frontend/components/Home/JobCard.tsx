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
  const categoryColors = getCategoryColors(job.category);

  return (
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
        {/* Rating row */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color={COLORS.warning} />
          <Text style={styles.ratingText}>{job.rating.toFixed(1)} <Text style={styles.ratingCount}>({job.ratingCount})</Text></Text>
        </View>
        {/* Footer: Category badge & price */}
        <View style={styles.footerRow}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColors.bg }]}> 
            <Text style={[styles.categoryText, { color: categoryColors.text }]}>{job.category}</Text>
          </View>
          <Text style={styles.price}>{job.price} KD</Text>
        </View>
      </View>
    </View>
  );
}

// ============================================================================
// STYLES FOR SERVICE CARD
// ============================================================================
const styles = StyleSheet.create({
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
    minHeight: 112,
  },
  imageWrapper: {
    width: 100,
    height: 112,
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
}); 