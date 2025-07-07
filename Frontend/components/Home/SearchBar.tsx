// ============================================================================
// SEARCH BAR COMPONENT
// ============================================================================
// Provides search functionality with real-time filtering
// Features:
// - Text input for search queries
// - Clear button (X) that appears when there's text
// - Filter button for advanced search options
// - Real-time search as user types
// TODO: Add debouncing for better performance with backend API
// ============================================================================

import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';

// Props interface for SearchBar component
interface SearchBarProps {
  value: string;                    // Current search query text
  onChange: (v: string) => void;    // Function to update search query
  onClear?: () => void;             // Optional function for clear button
}

export default function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  return (
    <View style={styles.searchSection}>
      <View style={styles.searchInputWrapper}>
        {/* Search icon */}
        <Ionicons name="search" size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
        
        {/* Search input field */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search for talents or services..."
          placeholderTextColor={COLORS.placeholder}
          value={value}
          onChangeText={onChange}
        />
        
        {/* Clear button - only shows when there's text */}
        {value.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={() => onChange('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
        
        {/* Filter button for advanced search options */}
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options" size={18} color={COLORS.accentSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ============================================================================
// STYLES FOR SEARCH BAR
// ============================================================================
const styles = StyleSheet.create({
  // Search section container
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  
  // Search input wrapper with background
  searchInputWrapper: {
    backgroundColor: COLORS.muted,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    position: 'relative',
  },
  
  // Search icon styling
  searchIcon: {
    marginRight: 4,
  },
  
  // Search input field
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  
  // Clear button styling
  clearBtn: {
    padding: 4,
    marginRight: 4,
  },
  
  // Filter button styling
  filterBtn: {
    backgroundColor: COLORS.background,
    borderRadius: 999,
    padding: 6,
    marginLeft: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
}); 