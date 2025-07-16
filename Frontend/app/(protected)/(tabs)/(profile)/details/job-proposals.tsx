import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/Colors';
import proposalApi, { Proposal } from '@/api/proposals';

export default function JobProposalsScreen() {
  const { jobId } = useLocalSearchParams();
  const router = useRouter();
  
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProposals();
  }, [jobId]);

  const fetchProposals = async () => {
    try {
      const response = await proposalApi.getJobProposals(jobId as string);
      if (response.success && response.data && 'proposals' in response.data) {
        setProposals(response.data.proposals);
      }
    } catch (error) {
      console.error('Failed to fetch proposals:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProposals();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#22C55E';
      case 'rejected':
        return '#EF4444';
      case 'cancelled':
        return '#6B7280';
      default:
        return COLORS.accent;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Accepted';
      case 'rejected':
        return 'Declined';
      case 'cancelled':
        return 'Cancelled';
      case 'active':
        return 'Pending';
      default:
        return 'Pending';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Proposals</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Proposals</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {proposals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No Proposals Yet</Text>
            <Text style={styles.emptyText}>
              When freelancers send proposals for this job, they'll appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.proposalsList}>
            {proposals.map((proposal) => (
              <TouchableOpacity
                key={proposal._id}
                style={styles.proposalCard}
                onPress={() => router.push(`/(protected)/(tabs)/(proposals)/${proposal._id}`)}
              >
                <View style={styles.proposalHeader}>
                  <View style={styles.freelancerInfo}>
                    <Text style={styles.freelancerName}>{proposal.freelancer.name}</Text>
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={14} color="#FFB800" />
                      <Text style={styles.rating}>4.7</Text>
                    </View>
                  </View>
                  <View 
                    style={[
                      styles.statusBadge, 
                      { backgroundColor: getStatusColor(proposal.status) + '20' }
                    ]}
                  >
                    <Text 
                      style={[
                        styles.statusText, 
                        { color: getStatusColor(proposal.status) }
                      ]}
                    >
                      {getStatusText(proposal.status)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.coverLetterPreview} numberOfLines={3}>
                  {proposal.cover_letter}
                </Text>

                <View style={styles.proposalFooter}>
                  <View style={styles.proposalDetails}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Proposed Price</Text>
                      <Text style={styles.detailValue}>{parseFloat(proposal.proposed_price?.$numberDecimal || proposal.proposed_price || 0)} KD</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Location</Text>
                      <Text style={styles.detailValue}>{proposal.freelancer.location || 'Remote'}</Text>
                    </View>
                  </View>

                  <View style={styles.skillsRow}>
                    {proposal.freelancer.skills.slice(0, 3).map((skill, index) => (
                      <View key={index} style={styles.skillBadge}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                    {proposal.freelancer.skills.length > 3 && (
                      <View style={styles.moreSkillsBadge}>
                        <Text style={styles.moreSkillsText}>
                          +{proposal.freelancer.skills.length - 3}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cardActions}>
                    <TouchableOpacity 
                      style={styles.viewButton}
                      onPress={() => router.push(`/(protected)/(tabs)/(proposals)/${proposal._id}`)}
                    >
                      <LinearGradient
                        colors={[COLORS.accent, COLORS.accentSecondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.viewButtonGradient}
                      >
                        <Text style={styles.viewButtonText}>View Proposal</Text>
                        <Ionicons name="arrow-forward" size={16} color="white" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.background,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  proposalsList: {
    padding: 20,
  },
  proposalCard: {
    backgroundColor: COLORS.background,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
  },
  proposalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  freelancerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  freelancerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  coverLetterPreview: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  proposalFooter: {
    gap: 16,
  },
  proposalDetails: {
    flexDirection: 'row',
    gap: 24,
  },
  detailItem: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: COLORS.accent + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '500',
  },
  moreSkillsBadge: {
    backgroundColor: COLORS.secondary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  moreSkillsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  cardActions: {
    marginTop: 8,
  },
  viewButton: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  viewButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});