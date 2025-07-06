// ============================================================================
// FEESHAY YOUTHLY UI - COLOR SYSTEM
// ============================================================================
// Centralized color definitions following the FeeShay Youthly UI design system
// Import this file in components to ensure consistent theming across the app

export const COLORS = {
  // ============================================================================
  // MAIN THEME COLORS
  // ============================================================================
  // Primary colors from design.json
  background: '#FFFFFF',        // Main background color
  textPrimary: '#2C2C2C',      // Primary text color
  textSecondary: '#6D6D6D',    // Secondary text color
  accent: '#F72585',           // Primary accent color (pink)
  accentSecondary: '#7209B7',  // Secondary accent color (purple)
  accentTertiary: '#4361EE',   // Tertiary accent color (blue)
  
  // ============================================================================
  // UI COLORS
  // ============================================================================
  // Interface and component colors
  muted: '#F1F3F9',           // Muted background color
  border: '#E2E8F0',          // Border color
  placeholder: '#A9A9A9',     // Placeholder text color
  cardShadow: 'rgba(0, 0, 0, 0.05)', // Card shadow color
  
  // ============================================================================
  // STATUS COLORS
  // ============================================================================
  // Semantic colors for different states
  success: '#22C55E',         // Success color (green)
  warning: '#FACC15',         // Warning color (yellow)
  error: '#EF4444',           // Error color (red)
  
  // ============================================================================
  // LEGACY COMPATIBILITY
  // ============================================================================
  // These map to the main theme colors for backward compatibility
  // TODO: Gradually replace usage of these with the main theme colors above
  primary: '#F72585',         // Maps to accent
  secondary: '#7209B7',       // Maps to accentSecondary
  light: '#FFFFFF',           // Maps to background
  dark: '#2C2C2C',           // Maps to textPrimary
  gray: '#6D6D6D',           // Maps to textSecondary
  yellow: '#FACC15',         // Maps to warning
  green: '#22C55E',          // Maps to success
} as const;

// ============================================================================
// CATEGORY COLORS
// ============================================================================
// Color mapping for different service categories with background and text colors
// 
// HOW TO ADD NEW CATEGORIES:
// ========================
// 1. Add your new category here with a unique color combination
// 2. Use light background colors (like #F0F9FF) with darker text colors (like #0284C7)
// 3. Make sure colors are accessible (good contrast ratio)
// 4. Add the category to CATEGORY_COLOR_KEYS array below for dynamic assignment
// 
// Example of adding a new "Fitness" category:
// Fitness: { bg: '#F0FDF4', text: '#15803D' },       // Green variant
//
export const CATEGORY_COLORS = {
  Design: { bg: '#DBEAFE', text: '#1E40AF' },        // Blue
  Tech: { bg: '#EDE9FE', text: '#7C3AED' },          // Purple
  Writing: { bg: '#DCFCE7', text: '#16A34A' },       // Green
  Marketing: { bg: '#FEF3C7', text: '#D97706' },     // Amber
  Photography: { bg: '#FCE7F3', text: '#BE185D' },   // Pink
  Music: { bg: '#F0F9FF', text: '#0284C7' },         // Sky Blue
  Animation: { bg: '#F3E8FF', text: '#9333EA' },     // Violet
  Consulting: { bg: '#ECFDF5', text: '#059669' },    // Emerald
  Translation: { bg: '#FFF7ED', text: '#EA580C' },   // Orange
  Legal: { bg: '#F1F5F9', text: '#475569' },         // Slate
  Finance: { bg: '#FEFCE8', text: '#CA8A04' },       // Yellow
  Health: { bg: '#F0FDF4', text: '#15803D' },        // Green
  Education: { bg: '#EFF6FF', text: '#2563EB' },     // Blue
  Gaming: { bg: '#FDF4FF', text: '#A21CAF' },        // Fuchsia
  // ADD NEW CATEGORIES HERE:
  // Fitness: { bg: '#F0FDF4', text: '#15803D' },    // Example: Green variant
  // Fashion: { bg: '#FDF2F8', text: '#BE185D' },    // Example: Pink variant
  // Food: { bg: '#FFFBEB', text: '#D97706' },       // Example: Amber variant
  
  default: { bg: COLORS.muted, text: COLORS.textSecondary }, // Gray fallback
} as const;

// Array of category color keys for dynamic assignment
// 
// HOW TO UPDATE FOR NEW CATEGORIES:
// ===============================
// When you add a new category above, also add it to this array
// This ensures new categories get proper colors when using dynamic assignment
// 
// Example: If you added 'Fitness', 'Fashion', 'Food' above, add them here:
// 'Design', 'Tech', 'Writing', 'Marketing', 'Photography', 'Music', 
// 'Animation', 'Consulting', 'Translation', 'Legal', 'Finance', 
// 'Health', 'Education', 'Gaming', 'Fitness', 'Fashion', 'Food'
//
const CATEGORY_COLOR_KEYS = [
  'Design', 'Tech', 'Writing', 'Marketing', 'Photography', 'Music', 
  'Animation', 'Consulting', 'Translation', 'Legal', 'Finance', 
  'Health', 'Education', 'Gaming'
  // ADD NEW CATEGORY KEYS HERE when you add them above
] as const;

// ============================================================================
// SHADOW PRESETS
// ============================================================================
// Common shadow configurations for consistent elevation
export const SHADOWS = {
  small: {
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
// Helper functions for working with colors

/**
 * Get category colors based on category name
 * @param category - The category name
 * @returns The corresponding background and text colors for the category
 */
export const getCategoryColors = (category: string): { bg: string; text: string } => {
  return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default;
};

/**
 * Get category color for a category by index (for dynamic assignment)
 * @param category - The category name
 * @param index - The index for color assignment
 * @returns The corresponding colors for the category
 */
export const getCategoryColorByIndex = (category: string, index: number): { bg: string; text: string } => {
  // If category exists in predefined colors, use it
  if (CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]) {
    return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS];
  }
  
  // Otherwise, assign color based on index
  const colorKey = CATEGORY_COLOR_KEYS[index % CATEGORY_COLOR_KEYS.length];
  return CATEGORY_COLORS[colorKey];
};

// ============================================================================
// EXPORT DEFAULT
// ============================================================================
// Export COLORS as default for convenient importing
export default COLORS; 