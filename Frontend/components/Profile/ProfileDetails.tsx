import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';

interface ProfileDetailsProps {
  profile?: any;
}

export default function ProfileDetails({ profile }: ProfileDetailsProps) {
  const bio = profile?.bio || 'No bio added yet. Tell us about yourself!';
  const skills = profile?.skills || ['React Native', 'TypeScript', 'UI/UX', 'Node.js'];
  const location = profile?.location || 'Location not set';
  const memberSince = profile?.member_since ? new Date(profile.member_since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently';
  const languages = profile?.languages || ['English'];
  
  const skillColors = [COLORS.accent, COLORS.accentSecondary, COLORS.accentTertiary];
  
  return (
    <View style={styles.detailsCard}>
      <Text style={styles.bio}>{bio}</Text>
      
      <View style={styles.skillsContainer}>
        {skills.map((skill: string, index: number) => {
          const color = skillColors[index % skillColors.length];
          return (
            <View key={index} style={[styles.skillTag, { backgroundColor: `${color}20` }]}>
              <Text style={[styles.skillText, { color }]}>{skill}</Text>
            </View>
          );
        })}
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <View style={[styles.iconContainer, { backgroundColor: `${COLORS.accent}10` }]}>
            <Ionicons name="location" size={16} color={COLORS.accent} />
          </View>
          <Text style={styles.infoText}>{location}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={[styles.iconContainer, { backgroundColor: `${COLORS.accentSecondary}10` }]}>
            <Ionicons name="calendar" size={16} color={COLORS.accentSecondary} />
          </View>
          <Text style={styles.infoText}>Member since {memberSince}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={[styles.iconContainer, { backgroundColor: `${COLORS.accentTertiary}10` }]}>
            <Ionicons name="globe" size={16} color={COLORS.accentTertiary} />
          </View>
          <Text style={styles.infoText}>{languages.join(', ')}</Text>
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