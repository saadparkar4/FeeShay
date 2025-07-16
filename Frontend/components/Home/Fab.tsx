// ============================================================================
// FLOATING ACTION BUTTON (FAB) COMPONENT
// ============================================================================
// Floating action button for creating new content (Client only)
// Features:
// - Fixed position at bottom right
// - Plus icon for creating new job posts
// - Shadow and elevation for depth
// - Touch feedback for user interaction
// - Hidden for freelancer accounts
// - Navigates to create job screen for clients
// TODO: Add haptic feedback on press
// ============================================================================

import React, { useContext } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/Colors';
import AuthContext from '../../context/AuthContext';

export default function Fab() {
  const router = useRouter();
  const { userRole } = useContext(AuthContext);
  
  // Hide FAB for freelancers
  if (userRole === 'freelancer') {
    return null;
  }

  const handlePress = () => {
    // Navigate to create job screen for clients
    router.push('/(protected)/(tabs)/(profile)/details/create-job');
  };

  return (
    <TouchableOpacity style={styles.fabTouchable} onPress={handlePress}>
      <LinearGradient
        colors={[COLORS.accent, COLORS.accentSecondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fab}
      >
        <Ionicons name="add" size={28} color={COLORS.background} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ============================================================================
// STYLES FOR FLOATING ACTION BUTTON
// ============================================================================
const styles = StyleSheet.create({
  // Touchable wrapper for FAB
  fabTouchable: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  
  // Floating action button container
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
}); 