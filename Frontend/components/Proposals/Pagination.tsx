import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    
    for (let i = 1; i <= Math.min(totalPages, maxVisiblePages); i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.pageButton,
            currentPage === i && styles.activePageButton
          ]}
          onPress={() => onPageChange(i)}
        >
          <Text style={[
            styles.pageNumber,
            currentPage === i && styles.activePageNumber
          ]}>
            {i}
          </Text>
        </TouchableOpacity>
      );
    }
    
    return pages;
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.navButton, currentPage === 1 && styles.disabledButton]}
        onPress={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <Ionicons 
          name="chevron-back" 
          size={12} 
          color={currentPage === 1 ? '#9CA3AF' : '#6B7280'} 
        />
      </TouchableOpacity>
      
      {renderPageNumbers()}
      
      <TouchableOpacity
        style={[styles.navButton, currentPage === totalPages && styles.disabledButton]}
        onPress={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <Ionicons 
          name="chevron-forward" 
          size={12} 
          color={currentPage === totalPages ? '#9CA3AF' : '#6B7280'} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  pageButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePageButton: {
    backgroundColor: COLORS.primary,
  },
  pageNumber: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  activePageNumber: {
    color: COLORS.white,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
});