import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';

interface SettingItem {
  icon: string;
  text: string;
  color: string;
  route: string;
  isLogout?: boolean;
}

interface SettingsSectionProps {
  onNavigate?: (route: string) => void;
  onLogout?: () => void;
  userRole?: string;
}

export default function SettingsSection({ onNavigate, onLogout, userRole = 'freelancer' }: SettingsSectionProps) {
  const freelancerItems: SettingItem[] = [
    { icon: 'briefcase', text: 'My Services', color: COLORS.accent, route: 'services' },
    { icon: 'document-text', text: 'My Proposals', color: COLORS.accentSecondary, route: 'proposals' },
    { icon: 'card', text: 'Payment Settings', color: COLORS.accentTertiary, route: 'payment' },
    { icon: 'notifications', text: 'Notifications Settings', color: COLORS.accent, route: 'notifications' },
    { icon: 'globe', text: 'Language & Currency', color: COLORS.accentSecondary, route: 'language' },
    { icon: 'log-out', text: 'Logout', color: COLORS.error, route: 'logout', isLogout: true },
  ];

  const clientItems: SettingItem[] = [
    { icon: 'list', text: 'My Job Posts', color: COLORS.accent, route: 'jobs' },
    { icon: 'people', text: 'Hired Freelancers', color: COLORS.accentSecondary, route: 'hired' },
    { icon: 'card', text: 'Payment Settings', color: COLORS.accentTertiary, route: 'payment' },
    { icon: 'notifications', text: 'Notifications Settings', color: COLORS.accent, route: 'notifications' },
    { icon: 'globe', text: 'Language & Currency', color: COLORS.accentSecondary, route: 'language' },
    { icon: 'log-out', text: 'Logout', color: COLORS.error, route: 'logout', isLogout: true },
  ];

  const settingsItems = userRole === 'client' ? clientItems : freelancerItems;
  const handlePress = (item: SettingItem) => {
    if (item.isLogout) {
      onLogout?.();
    } else {
      onNavigate?.(item.route);
    }
  };

  return (
    <View style={[styles.sectionCard, { marginBottom: 100 }]}>
      <Text style={styles.sectionTitle}>Account & Settings</Text>
      
      {settingsItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.settingItem, index < settingsItems.length - 1 && styles.settingBorder]}
          onPress={() => handlePress(item)}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon as any} size={18} color={item.color} />
            </View>
            <Text style={[styles.settingText, item.isLogout && { color: item.color }]}>
              {item.text}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: COLORS.background,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 24,
    borderRadius: 24,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.muted,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
});