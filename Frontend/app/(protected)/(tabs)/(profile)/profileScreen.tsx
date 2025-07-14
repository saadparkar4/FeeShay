/**
 * Profile Screen Component
 * 
 * Main user profile screen that displays:
 * - User information card with avatar and stats
 * - Profile details including bio and skills
 * - Portfolio showcase section
 * - Reviews and ratings section
 * - Settings and account management options
 * 
 * This screen serves as the hub for user account management
 * and showcases their professional profile
 */

import React, { useContext } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { deleteToken } from '@/api/storage';
import AuthContext from '@/context/AuthContext';
import { COLORS } from '@/constants/Colors';
// Profile component imports - each handles a specific section
import UserInfoCard from '@/components/Profile/UserInfoCard';
import ProfileDetails from '@/components/Profile/ProfileDetails';
import PortfolioSection from '@/components/Profile/PortfolioSection';
import ReviewsSection from '@/components/Profile/ReviewsSection';
import SettingsSection from '@/components/Profile/SettingsSection';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  // Authentication context for managing login state
  const { setIsAuthenticated, isAuthenticated } = useContext(AuthContext);
  
  // Router for navigation between screens
  const router = useRouter();

  // Handles user logout - clears token and updates auth state
  const handleLogout = () => {
    deleteToken();                    // Remove stored authentication token
    setIsAuthenticated(false);        // Update auth context to logged out state
  };

  // Navigation handler for settings menu items
  // Routes to specific screens based on the selected option
  const handleNavigate = (route: string) => {
    if (route === 'services') {
      // Navigate to user's services list
      router.push('./details/Services');
    } else if (route === 'jobs') {
      // Navigate to user's job posts
      router.push('./details/JobPost');
    } else {
      // Placeholder for other navigation options
      console.log(`Navigating to ${route}`);
    }
  };

  // Handler for switching between freelancer/client roles
  const handleSwitchRole = () => {
    console.log('Switching role...');
    /* TODO: Implement role switching logic
       This would update user's active role in the app */
  };

  // Handle sign in navigation for guests
  const handleSignIn = () => {
    router.push('/Register');
  };

  // If user is not authenticated, show sign in prompt
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: 'white' }]}>
        <View style={styles.guestContainer}>
          <Text style={styles.guestTitle}>Profile</Text>
          <Text style={styles.guestMessage}>Please sign in to use this feature</Text>
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <LinearGradient
              colors={[COLORS.accent, COLORS.accentSecondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: 'white' }]}>
      <View style={styles.container}>
        {/* Main scrollable content */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* User info card - Avatar, name, stats */}
          <UserInfoCard onSwitchRole={handleSwitchRole} />
          
          {/* Profile details - Bio, skills, location */}
          <ProfileDetails />
          
          {/* Portfolio section - Showcases user's work */}
          {/* TODO: Navigate to full portfolio */}
          {/* TODO: Open add portfolio modal */}
          <PortfolioSection 
            onViewAll={() => console.log('View all portfolio')}
            onAddPortfolio={() => console.log('Add portfolio item')}
          />
          
          {/* Reviews section - User ratings and feedback */}
          {/* TODO: Navigate to reviews */}
          <ReviewsSection onViewAll={() => console.log('View all reviews')} />
          
          {/* Settings section - Account options and navigation */}
          <SettingsSection 
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Styles for the profile screen
const styles = StyleSheet.create({
  // Main container - fills entire screen
  container: {
    flex: 1,
    backgroundColor: COLORS.background,  // Uses app theme background color
  },
  // Guest container - centered content for non-authenticated users
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // Guest title
  guestTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  // Guest message
  guestMessage: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  // Sign in button
  signInButton: {
    width: 200,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
  },
  // Gradient button style
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Sign in button text
  signInButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
});