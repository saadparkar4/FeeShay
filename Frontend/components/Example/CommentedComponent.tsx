import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/Colors';

// Interface defines the shape of props this component expects
// This helps with TypeScript type checking and autocomplete
interface CommentedComponentProps {
  title: string;           // Required title to display
  count?: number;          // Optional initial count (defaults to 0)
  onCountChange?: (newCount: number) => void;  // Optional callback when count changes
}

/**
 * Example Component with Comprehensive Comments
 * 
 * This component demonstrates best practices for commenting:
 * - Explains the purpose of the component
 * - Documents props and their usage
 * - Explains complex logic or calculations
 * - Notes any side effects or important behaviors
 */
export default function CommentedComponent({ 
  title, 
  count = 0,  // Default value if not provided
  onCountChange 
}: CommentedComponentProps) {
  // State to track the current count
  // We initialize it with the count prop or 0 if not provided
  const [currentCount, setCurrentCount] = useState(count);

  // Effect hook that runs when currentCount changes
  // This notifies the parent component of count changes
  useEffect(() => {
    // Only call the callback if it exists (optional prop)
    if (onCountChange) {
      onCountChange(currentCount);
    }
  }, [currentCount, onCountChange]); // Dependencies array

  // Handler for increment button
  const handleIncrement = () => {
    // Update state using functional update to ensure we have latest value
    setCurrentCount(prevCount => prevCount + 1);
  };

  // Handler for decrement button
  const handleDecrement = () => {
    // Prevent negative values
    setCurrentCount(prevCount => Math.max(0, prevCount - 1));
  };

  // Determine button opacity based on count
  // Decrement button is disabled (semi-transparent) when count is 0
  const decrementOpacity = currentCount === 0 ? 0.5 : 1;

  return (
    <View style={styles.container}>
      {/* Title Section */}
      <Text style={styles.title}>{title}</Text>
      
      {/* Counter Display */}
      <View style={styles.counterContainer}>
        {/* Decrement Button */}
        <TouchableOpacity 
          style={[styles.button, { opacity: decrementOpacity }]}
          onPress={handleDecrement}
          disabled={currentCount === 0}  // Disable when count is 0
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        
        {/* Current Count Display */}
        <View style={styles.countDisplay}>
          <Text style={styles.countText}>{currentCount}</Text>
        </View>
        
        {/* Increment Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={handleIncrement}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      {/* Additional Info - Shows different message based on count */}
      <Text style={styles.infoText}>
        {currentCount === 0 
          ? 'Click + to start counting'
          : `You've counted to ${currentCount}!`
        }
      </Text>
    </View>
  );
}

// Styles object contains all the styling for this component
const styles = StyleSheet.create({
  // Main container styling
  container: {
    padding: 20,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    alignItems: 'center',
  },
  
  // Title text styling
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  
  // Container for the counter controls
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  // Styling for increment/decrement buttons
  button: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.accent,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Text inside buttons
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  
  // Container for the count number
  countDisplay: {
    marginHorizontal: 24,
    minWidth: 60,
    alignItems: 'center',
  },
  
  // The actual count number
  countText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  
  // Informational text at the bottom
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});