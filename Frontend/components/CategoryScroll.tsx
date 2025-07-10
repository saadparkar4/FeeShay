// ============================================================================
// CATEGORY SCROLL COMPONENT
// ============================================================================
// Horizontal scrollable list of categories for filtering content
// Features:
// - Horizontal scrolling with smooth animations
// - Active state highlighting for selected category
// - Support for display names with counts (e.g., "Graphic Design (5)")
// - Touch feedback for category selection
// TODO: Add category icons and improve accessibility
// ============================================================================

import React from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/Colors';

// Props interface for CategoryScroll component
interface CategoryScrollProps {
  categories: string[];                    // Array of category names
  selected: string;                        // Currently selected category
  onSelect: (category: string) => void;    // Function to handle category selection
  displayNames?: string[];                 // Optional display names (e.g., with counts)
}

export default function CategoryScroll({ categories, selected, onSelect, displayNames }: CategoryScrollProps) {
  // Extract category name and count from display names
  const getCategoryData = (category: string, index: number) => {
    if (displayNames && displayNames[index]) {
      const displayName = displayNames[index];
      const match = displayName.match(/^(.+)\s\((\d+)\)$/);
      if (match) {
        return { name: match[1], count: match[2] };
      }
    }
    return { name: category, count: null };
  };
  
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryScroll}
      style={styles.scrollContainer}
    >
      {categories.map((category, index) => {
        const { name, count } = getCategoryData(category, index);
        const isActive = selected === category;
        
        return (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryBtn,
              isActive && styles.categoryBtnActive
            ]}
            onPress={() => onSelect(category)}
          >
            <Text style={[
              styles.categoryText,
              isActive && styles.categoryTextActive
            ]}>
              {name}
            </Text>
            {count && (
              <View style={[
                styles.countBadge,
                isActive && styles.countBadgeActive
              ]}>
                <Text style={[
                  styles.countText,
                  isActive && styles.countTextActive
                ]}>
                  {count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ============================================================================
// STYLES FOR CATEGORY SCROLL
// ============================================================================
const styles = StyleSheet.create({
  // Scroll container
  scrollContainer: {
    marginBottom: 8,
  },
  
  // Category scroll content container
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  
  // Individual category button
  categoryBtn: {
    backgroundColor: COLORS.background,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  // Active category button styling
  categoryBtnActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  
  // Category text styling
  categoryText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  
  // Active category text styling
  categoryTextActive: {
    color: COLORS.background,
    fontWeight: '600',
  },
  
  // Count badge styling
  countBadge: {
    backgroundColor: COLORS.muted,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Active count badge styling
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  // Count text styling
  countText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  
  // Active count text styling
  countTextActive: {
    color: COLORS.background,
    fontWeight: '600',
  },
}); 