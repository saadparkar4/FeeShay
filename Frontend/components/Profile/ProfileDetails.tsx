import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';

export default function ProfileDetails() {
  return (
    <View style={styles.detailsCard}>
      <Text style={styles.bio}>
        Creative graphic designer with 5+ years of experience specializing in brand identity and digital illustrations. Passionate about turning ideas into visual stories. 🎨
      </Text>
      
      <View style={styles.skillsContainer}>
        <View style={[styles.skillTag, { backgroundColor: `${COLORS.accent}20` }]}>
          <Text style={[styles.skillText, { color: COLORS.accent }]}>UI/UX Design</Text>
        </View>
        <View style={[styles.skillTag, { backgroundColor: `${COLORS.accentSecondary}20` }]}>
          <Text style={[styles.skillText, { color: COLORS.accentSecondary }]}>Branding</Text>
        </View>
        <View style={[styles.skillTag, { backgroundColor: `${COLORS.accentTertiary}20` }]}>
          <Text style={[styles.skillText, { color: COLORS.accentTertiary }]}>Illustration</Text>
        </View>
        <View style={[styles.skillTag, { backgroundColor: `${COLORS.accent}20` }]}>
          <Text style={[styles.skillText, { color: COLORS.accent }]}>Logo Design</Text>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <View style={[styles.iconContainer, { backgroundColor: `${COLORS.accent}10` }]}>
            <Ionicons name="location" size={16} color={COLORS.accent} />
          </View>
          <Text style={styles.infoText}>New York, USA</Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={[styles.iconContainer, { backgroundColor: `${COLORS.accentSecondary}10` }]}>
            <Ionicons name="calendar" size={16} color={COLORS.accentSecondary} />
          </View>
          <Text style={styles.infoText}>Member since June 2022</Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={[styles.iconContainer, { backgroundColor: `${COLORS.accentTertiary}10` }]}>
            <Ionicons name="globe" size={16} color={COLORS.accentTertiary} />
          </View>
          <Text style={styles.infoText}>English, Spanish</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detailsCard: {
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
  bio: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 21,
    marginBottom: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  skillTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});