/**
 * Services Screen Component
 * 
 * Displays a list of services offered by the user with the ability to:
 * - View service details (image, price, rating, status)
 * - Edit or delete services
 * - Add new services via CTA section or floating button
 * - See service status (active/paused)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  ColorValue,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';

// Type definition for service data structure
// This ensures type safety and helps with autocomplete
interface ServiceData {
  id: string;           // Unique identifier for the service
  title: string;        // Service name/title
  price: string;        // Price display string (e.g., "Starting at 25 KD")
  image: string;        // URL to service portfolio image
  rating: number;       // Average rating (0-5)
  reviews: number;      // Total number of reviews
  status: 'active' | 'paused';  // Service availability status
}

// Mock service data - In production, this would come from an API
// Each service represents a different offering with its own pricing and ratings
const servicesData: ServiceData[] = [
  {
    id: '1',
    title: 'Logo Design',
    price: 'Starting at 25 KD',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/92f87864f4-c5b6309f7a33eb7911a0.png',
    rating: 4.9,
    reviews: 23,
    status: 'active',
  },
  {
    id: '2',
    title: 'Brand Identity',
    price: 'Starting at 75 KD',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/14667a6c62-ddceb1cce350335ba431.png',
    rating: 4.7,
    reviews: 15,
    status: 'active',
  },
  {
    id: '3',
    title: 'Digital Illustration',
    price: 'Starting at 40 KD',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/c802708e87-5039c8dbdc110c6bcfec.png',
    rating: 4.2,
    reviews: 8,
    status: 'paused',
  },
  {
    id: '4',
    title: 'UI/UX Design',
    price: 'Starting at 120 KD',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/fdf0b10422-94f08bf9efc361a6bf03.png',
    rating: 5.0,
    reviews: 12,
    status: 'active',
  },
];

/**
 * ServiceCard Component
 * 
 * Renders an individual service card with:
 * - Service image thumbnail
 * - Title and pricing with gradient effect
 * - Active/Paused status badge
 * - Star ratings and review count
 * - Edit/Delete action buttons
 * 
 * @param service - The service data to display
 */
const ServiceCard = ({ service }: { service: ServiceData }) => {
  // Function to render star ratings visually
  // Handles full stars, half stars, and empty stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add filled stars for whole number ratings
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={`star-${i}`} name="star" size={12} color="#FACC15" />
      );
    }
    
    // Add half star for decimal ratings (e.g., 4.5)
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half-star" name="star-half" size={12} color="#FACC15" />
      );
    }
    
    // Fill remaining slots with empty stars to always show 5 total
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={12} color="#FACC15" />
      );
    }
    
    return stars;
  };

  // Determines gradient colors for price text based on service
  // Different services get different gradients for visual variety
  const getPriceGradientColors = () => {
    if (service.id === '2') return [COLORS.accentSecondary, COLORS.accentTertiary];
    return [COLORS.accent, COLORS.accentSecondary];
  };

  // Determines status badge background gradient colors
  // Paused services get gray colors, active services get colored gradients
  const getStatusBadgeColors = () => {
    // Gray gradient for paused services
    if (service.status === 'paused') return ['#E5E7EB', '#F3F4F6'];
    
    // Different color gradients for different active services
    if (service.id === '2') return [COLORS.accentSecondary + '30', COLORS.accentSecondary + '20'];
    if (service.id === '4') return [COLORS.accentTertiary + '30', COLORS.accentTertiary + '20'];
    return [COLORS.accent + '30', COLORS.accent + '20'];  // Default pink gradient
  };

  // Determines text color for status badge
  // Matches the background color theme but with full opacity
  const getStatusTextColor = () => {
    if (service.status === 'paused') return '#6B7280';  // Gray for paused
    
    if (service.id === '2') return COLORS.accentSecondary;  // Purple
    if (service.id === '4') return COLORS.accentTertiary;   // Blue
    return COLORS.accent;  // Pink (default)
  };

  return (
    <View style={styles.serviceCard}>
      <View style={styles.serviceContent}>
        {/* Service image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: service.image }} style={styles.serviceImage} />
        </View>
        
        <View style={styles.serviceDetails}>
          {/* Service header with title and action buttons */}
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            
            {/* Edit and delete action buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.accent + '15' }]}>
                <Ionicons name="pencil" size={14} color={COLORS.accent} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="trash" size={14} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Price and status row */}
          <View style={styles.priceRow}>
            {/* Price with gradient text effect */}
            <LinearGradient
              colors={getPriceGradientColors() as [ColorValue, ColorValue, ...ColorValue[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.priceGradient}
            >
              <Text style={styles.priceText}>{service.price}</Text>
            </LinearGradient>
            
            {/* Status badge (Active/Paused) */}
            <LinearGradient 
              colors={getStatusBadgeColors() as [ColorValue, ColorValue, ...ColorValue[]] }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.statusBadge}
            >
              <Text style={[styles.statusText, { color: getStatusTextColor() }]}>
                {service.status === 'active' ? 'Active' : 'Paused'}
              </Text>
            </LinearGradient>
          </View>
          
          {/* Rating row with stars and review count */}
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {renderStars(service.rating)}
            </View>
            <Text style={styles.ratingText}>{service.rating.toFixed(1)}</Text>
            <Text style={styles.reviewsText}>({service.reviews} reviews)</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

/**
 * Main Services Screen Component
 * 
 * This is the main screen that displays all user services
 * Features:
 * - Header with back navigation
 * - Scrollable list of service cards
 * - Call-to-action section for adding new services
 * - Floating action button for quick service creation
 */
export default function ServicesScreen() {
  // Router hook for navigation functionality
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header section - Fixed at top with navigation and title */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Back button - navigates to previous screen (profile) */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={18} color={COLORS.accent} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Services</Text>
        </View>
        
        {/* Placeholder for header add button - removed in current design */}
        
      </View>

      {/* Scrollable content area */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* List of service cards */}
        <View style={styles.servicesList}>
          {servicesData.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </View>

        {/* Call-to-action section for adding new service */}
        <View style={styles.ctaSection}>
          <LinearGradient
            colors={[COLORS.accent + '10', COLORS.accentSecondary + '10', COLORS.accentTertiary + '10']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaCard}
          >
            {/* CTA icon */}
            <LinearGradient
              colors={[COLORS.accent, COLORS.accentSecondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaIcon}
            >
              <Ionicons name="add" size={24} color="white" />
            </LinearGradient>
            
            {/* CTA text content */}
            <Text style={styles.ctaTitle}>Add a New Service</Text>
            <Text style={styles.ctaDescription}>
              Showcase more of your skills and expand your earning potential
            </Text>
            
            {/* CTA button - currently empty */}
            
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Floating action button for quick add */}
      <TouchableOpacity style={styles.floatingButton}>
        <LinearGradient
          colors={[COLORS.accentTertiary, COLORS.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.floatingButtonGradient}
        >
          <Ionicons name="add" size={20} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// StyleSheet containing all component styles
// Organized by component/section for easy maintenance
const styles = StyleSheet.create({
  // Main container - full screen with white background
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  
  // Header styles
  header: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: COLORS.accent + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Content area styles
  content: {
    flex: 1,
    paddingTop: 24,
  },
  
  // Services list container
  servicesList: {
    paddingHorizontal: 16,
  },
  
  // Service card styles
  serviceCard: {
    backgroundColor: COLORS.background,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
  },
  serviceContent: {
    flexDirection: 'row',
  },
  
  // Service image styles
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  
  // Service details container
  serviceDetails: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  
  // Action buttons styles
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Price and status row styles
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceGradient: {
    marginRight: 12,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'transparent',
    backgroundClip: 'text',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Rating styles
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  reviewsText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  
  // CTA section styles
  ctaSection: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 100,
  },
  ctaCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.accent + '30',
    borderStyle: 'dashed',
  },
  ctaIcon: {
    width: 64,
    height: 64,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 16,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Floating action button styles
  floatingButton: {
    position: 'absolute',
    bottom: 28,
    right: 24,
  },
  floatingButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
});