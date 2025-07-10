import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/Colors';

export type TabType = 'Active' | 'Completed' | 'Cancelled';

interface TabBarProps {
  selectedTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabBar({ selectedTab, onTabChange }: TabBarProps) {
  const tabs: TabType[] = ['Active', 'Completed', 'Cancelled'];
  
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            selectedTab === tab && styles.activeTab
          ]}
          onPress={() => onTabChange(tab)}
        >
          <Text style={[
            styles.tabText,
            selectedTab === tab && styles.activeTabText
          ]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: COLORS.primary,
  },
});