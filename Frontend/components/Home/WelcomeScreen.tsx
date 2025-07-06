// ============================================================================
// WELCOME SCREEN COMPONENT
// ============================================================================
// First screen users see when opening FeeShay app
// Features:
// - FeeShay logo with tagline
// - Hero illustration
// - Welcome message
// - Sign In / Sign Up buttons
// - Social login options (Google, Apple)
// - Language selector and footer links
// ============================================================================

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';

interface WelcomeScreenProps {
  onSignIn?: () => void;
  onSignUp?: () => void;
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
}

export default function WelcomeScreen({ 
  onSignIn, 
  onSignUp, 
  onGoogleLogin, 
  onAppleLogin 
}: WelcomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoText}>
              <Text style={styles.logoFee}>Fee</Text>
              <Text style={styles.logoShay}>Shay</Text>
            </View>
            <Text style={styles.tagline}>Find. Hire. Thrive.</Text>
          </View>
        </View>

        {/* Hero Illustration */}
        <View style={styles.heroSection}>
          <Image 
            source={{ 
              uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/17a1aa5c57-6d1e1050686457d0f667.png' 
            }}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeTextSection}>
          <Text style={styles.welcomeTitle}>Welcome to FeeShay</Text>
          <Text style={styles.welcomeSubtitle}>Connect with talent or find your next opportunity</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsSection}>
          {/* Sign In Button */}
          <TouchableOpacity 
            style={styles.signInButton}
            onPress={onSignIn}
            activeOpacity={0.8}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <TouchableOpacity 
            style={styles.signUpButton}
            onPress={onSignUp}
            activeOpacity={0.8}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Social Login Section */}
          <View style={styles.socialLoginSection}>
            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialButtonsContainer}>
              {/* Google Button */}
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={onGoogleLogin}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-google" size={20} color="#4285F4" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              {/* Apple Button */}
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={onAppleLogin}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-apple" size={20} color="#000000" />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerSection}>
          {/* Language Selector */}
          <TouchableOpacity style={styles.languageSelector}>
            <Ionicons name="globe-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.languageText}>English (US)</Text>
            <Ionicons name="chevron-down" size={12} color={COLORS.textSecondary} />
          </TouchableOpacity>

          {/* Footer Links */}
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text style={styles.footerLinkText}>Terms & Conditions</Text>
            </TouchableOpacity>
            <View style={styles.footerDot} />
            <TouchableOpacity>
              <Text style={styles.footerLinkText}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// STYLES FOR WELCOME SCREEN
// ============================================================================
const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Scroll container
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 0,
  },

  // Logo Section
  logoSection: {
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },

  logoContainer: {
    alignItems: 'center',
  },

  logoText: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoFee: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.accent,
  },

  logoShay: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.accentTertiary,
  },

  tagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginVertical: 24,
  },

  heroImage: {
    width: '100%',
    height: 250,
    borderRadius: 16,
  },

  // Welcome Text Section
  welcomeTextSection: {
    alignItems: 'center',
    marginVertical: 10,
  },

  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },

  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Action Buttons Section
  actionButtonsSection: {
    marginVertical: 10,
    gap: 16,
  },

  // Sign In Button
  signInButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  signInButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },

  // Sign Up Button
  signUpButton: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },

  signUpButtonText: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '600',
  },

  // Social Login Section
  socialLoginSection: {
    marginTop: 16,
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  dividerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    paddingHorizontal: 16,
  },

  // Social Buttons
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },

  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },

  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },

  // Footer Section
  footerSection: {
    marginTop: 'auto',
    paddingTop: 24,
    alignItems: 'center',
  },

  // Language Selector
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 4,
  },

  languageText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  // Footer Links
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  footerLinkText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  footerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textSecondary,
  },
}); 