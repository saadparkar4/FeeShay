// ============================================================================
// FLOATING ACTION BUTTON (FAB) COMPONENT
// ============================================================================
// Floating action button for creating new content
// Features:
// - Fixed position at bottom right
// - Plus icon for creating new content
// - Shadow and elevation for depth
// - Touch feedback for user interaction
// TODO: Add navigation to create job/talent profile page
// TODO: Add haptic feedback on press
// TODO: Add different actions based on current tab (create job vs create profile)
// ============================================================================

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/Colors';

export default function Fab() {
  return (
    <TouchableOpacity style={styles.fabTouchable} onPress={() => alert('Create new content')}>
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