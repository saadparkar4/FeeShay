// ============================================================================
// TALENT CARD COMPONENT
// ============================================================================
// Displays individual freelancer/talent information in a card format
// Features:
// - Profile avatar image
// - Name, title, and location information
// - Star rating display
// - Hourly rate information
// - View profile button
// - Responsive layout with proper spacing
// TODO: Add navigation to talent profile page
// TODO: Add loading states for avatar images
// TODO: Add error handling for broken image URLs
// ============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

// Talent data interface
interface Talent {
  id: string;           // Unique identifier
  name: string;         // Full name of the talent
  title: string;        // Professional title/role
  location: string;     // City and country
  rating: number;       // Star rating (0-5)
  price: number;        // Hourly rate in USD
  avatar: string;       // Profile image URL
  category: string;     // Professional category
}

// Props interface for TalentCard component
interface TalentCardProps {
  talent: Talent;  // Talent data object
}

export default function TalentCard({ talent }: TalentCardProps) {
  return (
    <View style={styles.talentCard}>
      {/* Profile avatar image */}
      <Image source={{ uri: talent.avatar }} style={styles.avatar} />
      
      {/* Main content area */}
      <View style={styles.content}>
        {/* Header with name and rating */}
        <View style={styles.header}>
          <Text style={styles.talentName}>{talent.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={COLORS.warning} />
            <Text style={styles.ratingText}>{talent.rating}</Text>
          </View>
        </View>
        
        {/* Talent title/profession */}
        <Text style={styles.talentTitle}>{talent.title}</Text>
        
        {/* Location information */}
        <View style={styles.locationWrapper}>
          <Ionicons name="location-sharp" size={13} color={COLORS.primary} style={{ marginRight: 2 }} />
          <Text style={styles.locationText}>{talent.location}</Text>
        </View>
        
        {/* Footer with pricing and action button */}
        <View style={styles.cardFooter}>
          {/* Pricing information */}
          <View>
            <Text style={styles.startingAt}>Starting at</Text>
            <Text style={styles.price}>{talent.price} KD</Text>
          </View>
          
          {/* View profile button */}
          <TouchableOpacity style={styles.profileBtn}>
            <Text style={styles.profileBtnText}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ============================================================================
// STYLES FOR TALENT CARD
// ============================================================================
const styles = StyleSheet.create({
  // Talent card container
  talentCard: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: COLORS.cardShadow,
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    borderWidth: 0.8,
    borderColor: COLORS.border,
  },
  
  // Profile avatar image
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 8,
    backgroundColor: COLORS.border,
    borderWidth: 0.8,
    borderColor: COLORS.border,
  },
  
  // Main content area
  content: {
    flex: 1,
  },
  
  // Header with name and rating
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  
  // Talent name styling
  talentName: {
    fontWeight: 'bold',
    fontSize: 17,
    color: COLORS.textPrimary,
  },
  
  // Rating container
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  
  // Rating text styling
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 2,
  },
  
  // Talent title/profession
  talentTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  
  // Location wrapper
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  
  // Location text styling
  locationText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  
  // Card footer with pricing and button
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  
  // "Starting at" text
  startingAt: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  
  // Price text styling
  price: {
    fontWeight: 'bold',
    color: COLORS.accent,
    fontSize: 16,
    marginTop: 2,
  },
  
  // View profile button
  profileBtn: {
    backgroundColor: COLORS.accentTertiary,
    borderRadius: 80,
    paddingHorizontal: 18,
    paddingVertical: 7,
  },
  
  // Profile button text
  profileBtnText: {
    color: COLORS.background,
    fontWeight: '500',
    fontSize: 15,
  },
}); 