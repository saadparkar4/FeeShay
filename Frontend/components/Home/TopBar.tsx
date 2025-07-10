// ============================================================================
// TOP BAR COMPONENT
// ============================================================================
// Displays the app header with logo and notification bell
// This component is fixed at the top of the screen and shows:
// - App logo/brand name
// - Notification bell with badge count
// TODO: Connect notification count to backend API
// ============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';

export default function TopBar() {
  return (
    <View style={styles.header}>
      {/* App logo/brand name */}
      <Text style={styles.logo}>FeeShay</Text>
      
      {/* Notification bell with badge */}
      <TouchableOpacity style={styles.bellBtn}>
        <Ionicons name="notifications-outline" size={26} color={COLORS.textPrimary} />
        {/* Notification count badge - TODO: Get from backend */}
        <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
      </TouchableOpacity>
    </View>
  );
}

// ============================================================================
// STYLES FOR TOP BAR
// ============================================================================
const styles = StyleSheet.create({
  // Header container with logo and notifications
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 10,
  },
  
  // App logo styling
  logo: {
    color: COLORS.accent,
    fontWeight: 'bold',
    fontSize: 24,
    letterSpacing: 0.5,
  },
  
  // Notification bell button
  bellBtn: {
    position: 'relative',
    padding: 6,
  },
  
  // Notification count badge
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: COLORS.accent,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Badge text styling
  badgeText: {
    color: COLORS.background,
    fontSize: 10,
    fontWeight: 'bold',
  },
}); 
