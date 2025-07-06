// ============================================================================
// ONBOARDING SCREEN COMPONENT
// ============================================================================
// 4-page introduction flow for new FeeShay users
// Features:
// - Beautiful hero illustrations for each page
// - Smooth page transitions with swipe gestures
// - Progress indicators
// - Animated elements and floating icons
// - Skip functionality
// - "Get Started" final action
// ============================================================================

import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  Dimensions,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';

const { width: screenWidth } = Dimensions.get('window');

// ============================================================================
// INTERFACES FOR TYPE SAFETY
// ============================================================================
interface OnboardingPage {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  iconColor: string;
  icon?: string;
  hasSecondaryIcon?: boolean;
  secondaryIcon?: string;
  secondaryIconColor?: string;
}

interface OnboardingScreenProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

// ============================================================================
// ONBOARDING DATA
// ============================================================================
const onboardingPages: OnboardingPage[] = [
  {
    id: 1,
    title: 'Discover Local Talent',
    subtitle: 'Browse a wide variety of skilled freelancers in your region.',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/19f551eaba-d9b662318c145df3deb6.png',
    iconColor: COLORS.accent,
    icon: 'search-outline'
  },
  {
    id: 2,
    title: 'Post Jobs with AI Help',
    subtitle: 'Quickly define your needs with our smart job posting wizard.',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/504fd73c3c-25f701a2cfce65b9deb6.png',
    iconColor: '#F59E0B',
    icon: 'sparkles-outline',
    hasSecondaryIcon: true,
    secondaryIcon: 'bulb-outline',
    secondaryIconColor: COLORS.accent
  },
  {
    id: 3,
    title: 'Secure Payments & Trust',
    subtitle: 'Work safely with escrow, ratings, and verified skills.',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/990bfef0bf-ac26b974289fc8dbdea2.png',
    iconColor: '#10B981',
    icon: 'shield-checkmark-outline',
    hasSecondaryIcon: true,
    secondaryIcon: 'lock-closed-outline',
    secondaryIconColor: COLORS.accentTertiary
  },
  {
    id: 4,
    title: 'Build Your Future',
    subtitle: 'Whether you\'re starting a freelance career or hiring talent to grow, FeeShay helps you succeed.',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/d6058f416b-47872b3d0f0bd6dc040e.png',
    iconColor: '#F59E0B',
    icon: 'rocket-outline',
    hasSecondaryIcon: true,
    secondaryIcon: 'trending-up-outline',
    secondaryIconColor: '#10B981'
  }
];

// ============================================================================
// ONBOARDING SCREEN COMPONENT
// ============================================================================
export default function OnboardingScreen({ onComplete, onSkip }: OnboardingScreenProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  // ============================================================================
  // ANIMATION FUNCTIONS
  // ============================================================================
  const startBounceAnimation = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startFadeTransition = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0.7,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      callback();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  // ============================================================================
  // NAVIGATION FUNCTIONS
  // ============================================================================
  const goToNextPage = () => {
    if (currentPage < onboardingPages.length - 1) {
      startFadeTransition(() => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        scrollViewRef.current?.scrollTo({
          x: nextPage * screenWidth,
          animated: true,
        });
      });
    } else {
      // Last page - complete onboarding
      startBounceAnimation();
      setTimeout(() => {
        onComplete?.();
      }, 200);
    }
  };

  const handleSkip = () => {
    startBounceAnimation();
    setTimeout(() => {
      onSkip?.();
    }, 200);
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(contentOffsetX / screenWidth);
    if (pageIndex !== currentPage && pageIndex >= 0 && pageIndex < onboardingPages.length) {
      setCurrentPage(pageIndex);
    }
  };

  // ============================================================================
  // RENDER FUNCTIONS
  // ============================================================================
  const renderProgressIndicator = () => (
    <View style={styles.progressContainer}>
      {onboardingPages.map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.progressDot,
            {
              backgroundColor: index === currentPage ? COLORS.accent : COLORS.border,
              transform: [{ scale: index === currentPage ? 1.2 : 1 }],
            },
          ]}
        />
      ))}
    </View>
  );

  const renderFloatingIcon = (
    icon: string,
    color: string,
    style: any,
    animationDelay: number = 0
  ) => {
    const floatAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -5,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      const timeout = setTimeout(() => {
        animation.start();
      }, animationDelay);

      return () => {
        clearTimeout(timeout);
        animation.stop();
      };
    }, []);

    return (
      <Animated.View
        style={[
          styles.floatingIcon,
          style,
          {
            backgroundColor: color,
            transform: [{ translateY: floatAnim }],
          },
        ]}
      >
        <Ionicons name={icon as any} size={16} color="white" />
      </Animated.View>
    );
  };

  const renderPage = (page: OnboardingPage, index: number) => (
    <View key={page.id} style={styles.pageContainer}>
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <Text style={styles.logoFee}>Fee</Text>
        <Text style={styles.logoShay}>Shay</Text>
      </View>

      {/* Hero Illustration */}
      <View style={styles.heroSection}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: page.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          
          {/* Floating Icons */}
          {page.icon && renderFloatingIcon(
            page.icon,
            page.iconColor,
            styles.primaryFloatingIcon,
            0
          )}
          
          {page.hasSecondaryIcon && page.secondaryIcon && renderFloatingIcon(
            page.secondaryIcon,
            page.secondaryIconColor || COLORS.accent,
            styles.secondaryFloatingIcon,
            500
          )}
          
          {/* Additional floating icon for last page */}
          {page.id === 4 && renderFloatingIcon(
            'star',
            COLORS.accentTertiary,
            styles.tertiaryFloatingIcon,
            1000
          )}
        </View>
      </View>

      {/* Welcome Text */}
      <View style={styles.textSection}>
        <Text style={styles.title}>{page.title}</Text>
        <Text style={styles.subtitle}>{page.subtitle}</Text>
      </View>
    </View>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Scrollable Pages */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {onboardingPages.map((page, index) => renderPage(page, index))}
        </ScrollView>

        {/* Progress Indicator */}
        {renderProgressIndicator()}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {currentPage < onboardingPages.length - 1 ? (
            <>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
                activeOpacity={0.7}
              >
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>

              <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={goToNextPage}
                  activeOpacity={0.8}
                >
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
              </Animated.View>
            </>
          ) : (
            <Animated.View style={[styles.getStartedContainer, { transform: [{ scale: bounceAnim }] }]}>
              <TouchableOpacity
                style={styles.getStartedButton}
                onPress={goToNextPage}
                activeOpacity={0.8}
              >
                <Text style={styles.getStartedButtonText}>Get Started</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

// ============================================================================
// STYLES FOR ONBOARDING SCREEN
// ============================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  pageContainer: {
    width: screenWidth,
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  // Logo Section
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },

  logoFee: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.accent,
  },

  logoShay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.accentTertiary,
  },

  // Hero Section
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 32,
  },

  imageContainer: {
    width: '100%',
    maxWidth: 300,
    position: 'relative',
  },

  heroImage: {
    width: '100%',
    height: 320,
    borderRadius: 16,
  },

  // Floating Icons
  floatingIcon: {
    position: 'absolute',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  primaryFloatingIcon: {
    top: -8,
    right: -8,
    padding: 12,
  },

  secondaryFloatingIcon: {
    bottom: -8,
    left: -8,
    padding: 8,
  },

  tertiaryFloatingIcon: {
    top: '50%',
    left: -16,
    padding: 8,
  },

  // Text Section
  textSection: {
    alignItems: 'center',
    marginVertical: 24,
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 34,
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },

  // Progress Indicator
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
    gap: 8,
  },

  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },

  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },

  skipButtonText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },

  nextButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  nextButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },

  // Get Started Button
  getStartedContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  getStartedButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  getStartedButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 