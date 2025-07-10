import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/Colors';

interface PortfolioSectionProps {
  onViewAll?: () => void;
  onAddPortfolio?: () => void;
}

export default function PortfolioSection({ onViewAll, onAddPortfolio }: PortfolioSectionProps) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Portfolio</Text>
        <TouchableOpacity onPress={onViewAll}>
          <LinearGradient
            colors={[COLORS.accentTertiary, COLORS.accent]}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      <View style={styles.portfolioGrid}>
        {[1, 2, 3, 4, 5].map((item) => (
          <TouchableOpacity key={item} style={styles.portfolioItem}>
            <Image
              source={{ uri: `https://storage.googleapis.com/uxpilot-auth.appspot.com/3c9621a5e6-4dc3e3ea3625a58786c3.png` }}
              style={styles.portfolioImage}
            />
            {item === 5 && (
              <LinearGradient
                colors={[`${COLORS.accentSecondary}CC`, `${COLORS.accent}CC`]}
                style={styles.portfolioOverlay}
              >
                <Text style={styles.moreText}>+12</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addPortfolio} onPress={onAddPortfolio}>
          <Ionicons name="add" size={28} color={COLORS.accent} />
        </TouchableOpacity>
      </View>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  viewAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
  },
  viewAllText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '600',
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  portfolioItem: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
  },
  portfolioOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  addPortfolio: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: `${COLORS.accent}50`,
    backgroundColor: `${COLORS.accent}05`,
    justifyContent: 'center',
    alignItems: 'center',
  },
});