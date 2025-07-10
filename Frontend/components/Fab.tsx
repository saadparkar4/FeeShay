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
import { COLORS } from '../constants/Colors';

export default function Fab() {
  return (
    <TouchableOpacity style={styles.fab} onPress={() => alert('Create new content')}>
      <Ionicons name="add" size={24} color={COLORS.background} />
    </TouchableOpacity>
  );
}

// ============================================================================
// STYLES FOR FLOATING ACTION BUTTON
// ============================================================================
const styles = StyleSheet.create({
  // Floating action button container
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 1000,
  },
}); 