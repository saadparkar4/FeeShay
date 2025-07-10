// ============================================================================
// TOGGLE BAR COMPONENT
// ============================================================================
// Tab switcher between Talents and Jobs views
// Features:
// - Two-tab toggle with smooth animations
// - Active tab highlighting
// - Tab switching with callback function
// - Responsive design with proper touch targets
// TODO: Add tab-specific icons for better visual representation
// ============================================================================

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/Colors';

// Props interface for ToggleBar component
interface ToggleBarProps {
  tab: 'talents' | 'jobs';                           // Current active tab
  setTab: (tab: 'talents' | 'jobs') => void;        // Function to switch tabs
}

export default function ToggleBar({ tab, setTab }: ToggleBarProps) {
  return (
    <View style={styles.toggleSection}>
      <View style={styles.toggleContainer}>
        {/* Talents tab */}
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            tab === 'talents' && styles.toggleBtnActive
          ]}
          onPress={() => setTab('talents')}
        >
          <Text style={[
            styles.toggleText,
            tab === 'talents' && styles.toggleTextActive
          ]}>
            Talents
          </Text>
        </TouchableOpacity>
        
        {/* Jobs tab */}
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            tab === 'jobs' && styles.toggleBtnActive
          ]}
          onPress={() => setTab('jobs')}
        >
          <Text style={[
            styles.toggleText,
            tab === 'jobs' && styles.toggleTextActive
          ]}>
            Jobs
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ============================================================================
// STYLES FOR TOGGLE BAR
// ============================================================================
const styles = StyleSheet.create({
  // Toggle section container
  toggleSection: {
    paddingHorizontal: 16,
    paddingVertical: 0,
    paddingBottom: 8,
  },
  
  // Toggle container with background
  toggleContainer: {
    backgroundColor: COLORS.muted,
    borderRadius: 12,
    padding: 4,
    flexDirection: 'row',
  },
  
  // Individual toggle button
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Active toggle button styling
  toggleBtnActive: {
    backgroundColor: COLORS.background,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  
  // Toggle text styling
  toggleText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  
  // Active toggle text styling
  toggleTextActive: {
    color: COLORS.accent,
    fontWeight: '600',
  },
}); 