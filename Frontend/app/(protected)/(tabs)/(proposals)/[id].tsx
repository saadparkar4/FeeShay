import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/Colors';
import AuthContext from '@/context/AuthContext';
import proposalApi, { Proposal } from '@/api/proposals';

type ProposalStatus = 'active' | 'completed' | 'cancelled' | 'rejected';

export default function ProposalDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { userRole } = useContext(AuthContext);
  const isClient = userRole === 'client';
  
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProposal();
  }, [id]);

  const fetchProposal = async () => {
    try {
      setLoading(true);
      const response = await proposalApi.getProposalById(id as string);
      if (response.success && response.data && 'job' in response.data) {
        setProposal(response.data as Proposal);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load proposal details');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptProposal = async () => {
    Alert.alert(
      'Accept Proposal',
      'Are you sure you want to accept this proposal? This will start the project.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              setUpdating(true);
              const response = await proposalApi.updateProposalStatus(proposal!._id, 'completed');
              if (response.success) {
                Alert.alert('Success', 'Proposal accepted successfully!', [
                  { text: 'OK', onPress: () => fetchProposal() }
                ]);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to accept proposal');
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  const handleRejectProposal = async () => {
    Alert.alert(
      'Decline Proposal',
      'Are you sure you want to decline this proposal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            try {
              setUpdating(true);
              const response = await proposalApi.updateProposalStatus(proposal!._id, 'rejected');
              if (response.success) {
                Alert.alert('Success', 'Proposal declined', [
                  { text: 'OK', onPress: () => router.back() }
                ]);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to decline proposal');
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  const getStatusConfig = () => {
    if (!proposal) return null;
    
    switch (proposal.status) {
      case 'completed':
        return {
          text: 'Accepted',
          color: '#22C55E',
          bgColor: '#22C55E20',
        };
      case 'rejected':
        return {
          text: 'Declined',
          color: '#EF4444',
          bgColor: '#EF444420',
        };
      case 'cancelled':
        return {
          text: 'Cancelled',
          color: '#EF4444',
          bgColor: '#EF444420',
        };
      default:
        return null;
    }
  };

  const parseCoverLetter = (coverLetter: string) => {
    const sections = coverLetter.split('\n\n');
    const parsed: any = {
      service: '',
      title: '',
      description: '',
      deliverables: [],
      timeline: ''
    };

    sections.forEach(section => {
      if (section.startsWith('Service:')) {
        parsed.service = section.replace('Service:', '').trim();
      } else if (section.startsWith('Project Title:')) {
        parsed.title = section.replace('Project Title:', '').trim();
      } else if (section.startsWith('Description:')) {
        parsed.description = section.replace('Description:', '').trim();
      } else if (section.startsWith('Deliverables:')) {
        const deliverableText = section.replace('Deliverables:', '').trim();
        parsed.deliverables = deliverableText.split('\n').map(d => d.trim()).filter(d => d);
      } else if (section.startsWith('Timeline:')) {
        parsed.timeline = section.replace('Timeline:', '').trim();
      }
    });

    return parsed;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Proposal Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!proposal) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Proposal Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Proposal not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusConfig = getStatusConfig();
  const coverLetterData = parseCoverLetter(proposal.cover_letter);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Proposal Details</Text>
        <TouchableOpacity style={styles.optionsButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Freelancer/Client Header Card */}
        <View style={[styles.card, styles.freelancerCard]}>
          <View style={styles.freelancerInfo}>
            <Image 
              source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg' }} 
              style={styles.avatar} 
            />
            <View style={styles.freelancerDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.freelancerName}>
                  {isClient ? proposal.freelancer.name : 'Client'}
                </Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color="#FFB800" />
                  <Text style={styles.rating}>4.7</Text>
                </View>
              </View>
              <Text style={styles.freelancerTitle}>
                {proposal.freelancer.bio || 'Professional Freelancer'}
              </Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={12} color={COLORS.textSecondary} />
                <Text style={styles.location}>{proposal.freelancer.location || 'Remote'}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewProfileButton}>
              <Text style={styles.viewProfileText}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Proposal Summary */}
        <View style={[styles.card, styles.summaryCard]}>
          <Text style={styles.sectionTitle}>Proposal Summary</Text>
          
          <View style={styles.projectInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.projectTitle}>{proposal.job.title}</Text>
              {statusConfig && (
                <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
                  <Text style={[styles.statusText, { color: statusConfig.color }]}>
                    {statusConfig.text}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.projectSummary}>{proposal.job.description}</Text>
          </View>

          <View style={styles.metricsRow}>
            <View style={[styles.metricCard, { backgroundColor: COLORS.accentTertiary + '20' }]}>
              <View style={styles.metricHeader}>
                <Ionicons name="time" size={16} color={COLORS.accentTertiary} />
                <Text style={styles.metricLabel}>Timeline</Text>
              </View>
              <Text style={[styles.metricValue, { color: COLORS.accentTertiary }]}>
                {coverLetterData.timeline || '5-7 days'}
              </Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: COLORS.accent + '20' }]}>
              <View style={styles.metricHeader}>
                <Text style={[styles.dollarSign, { color: COLORS.accent }]}>$</Text>
                <Text style={styles.metricLabel}>Proposed Price</Text>
              </View>
              <Text style={[styles.metricValue, { color: COLORS.accent }]}>
                {proposal.proposed_price} KD
              </Text>
            </View>
          </View>

          <View style={styles.skillsContainer}>
            {proposal.freelancer.skills.map((skill, index) => (
              <View
                key={index}
                style={[
                  styles.skillBadge,
                  {
                    backgroundColor:
                      index % 4 === 0
                        ? COLORS.accentSecondary + '20'
                        : index % 4 === 1
                        ? COLORS.accentTertiary + '20'
                        : index % 4 === 2
                        ? COLORS.accent + '20'
                        : '#E9D5FF',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.skillText,
                    {
                      color:
                        index % 4 === 0
                          ? COLORS.accentSecondary
                          : index % 4 === 1
                          ? COLORS.accentTertiary
                          : index % 4 === 2
                          ? COLORS.accent
                          : '#9333EA',
                    },
                  ]}
                >
                  {skill}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Detailed Proposal */}
        <View style={[styles.card, styles.detailsCard]}>
          <Text style={styles.sectionTitle}>Detailed Proposal</Text>
          
          <Text style={styles.proposalText}>{coverLetterData.description || proposal.cover_letter}</Text>
          
          {coverLetterData.deliverables.length > 0 && (
            <>
              <Text style={styles.subheading}>What I'll deliver:</Text>
              {coverLetterData.deliverables.map((item: any, index: any) => (
                <View key={index} style={styles.deliverableItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.deliverableText}>{item}</Text>
                </View>
              ))}
            </>
          )}
          
          <View style={styles.budgetInfo}>
            <Text style={styles.subheading}>Budget Details:</Text>
            <Text style={styles.proposalText}>
              Job Budget: {proposal.job.budget_min} - {proposal.job.budget_max} KD
            </Text>
            <Text style={styles.proposalText}>
              My Proposal: {proposal.proposed_price} KD
            </Text>
          </View>
        </View>

        {/* Service Information */}
        {coverLetterData.service && (
          <View style={[styles.card, styles.noteCard]}>
            <View style={styles.noteHeader}>
              <Ionicons name="briefcase" size={18} color={COLORS.accentSecondary} />
              <Text style={styles.sectionTitle}>Selected Service</Text>
            </View>
            <Text style={styles.noteText}>{coverLetterData.service}</Text>
          </View>
        )}

        {/* Action Buttons - Only show for active proposals */}
        {proposal.status === 'active' && (
          <View style={styles.actionButtons}>
            {isClient ? (
              <>
                <View style={styles.topButtonsRow}>
                  <TouchableOpacity 
                    style={styles.acceptButtonWrapper}
                    onPress={handleAcceptProposal}
                    disabled={updating}
                  >
                    <LinearGradient
                      colors={[COLORS.accent, COLORS.accentSecondary]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.acceptButton}
                    >
                      {updating ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <>
                          <Ionicons name="checkmark" size={20} color="white" />
                          <Text style={styles.acceptButtonText}>Accept Proposal</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.messageButton}
                    onPress={() => router.push({ pathname: "/(protected)/(tabs)/(messages)/[id]", params: { id: '1' } })}
                  >
                    <Ionicons name="chatbubble" size={24} color={COLORS.accentTertiary} />
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity 
                  style={styles.declineButton}
                  onPress={handleRejectProposal}
                  disabled={updating}
                >
                  <Ionicons name="close" size={20} color={COLORS.textSecondary} />
                  <Text style={styles.declineButtonText}>Decline Proposal</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.topButtonsRow}>
                  <TouchableOpacity style={styles.acceptButtonWrapper}>
                    <LinearGradient
                      colors={[COLORS.accent, COLORS.accentSecondary]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.acceptButton}
                    >
                      <Ionicons name="create" size={20} color="white" />
                      <Text style={styles.acceptButtonText}>Edit Proposal</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.messageButton}
                    onPress={() => router.push({ pathname: "/(protected)/(tabs)/(messages)/[id]", params: { id: '1' } })}
                  >
                    <Ionicons name="chatbubble" size={24} color={COLORS.accentTertiary} />
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity style={styles.declineButton}>
                  <Ionicons name="trash" size={20} color={COLORS.textSecondary} />
                  <Text style={styles.declineButtonText}>Withdraw Proposal</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* Status Message for Non-Active Proposals */}
        {proposal.status !== 'active' && (
          <View style={[styles.card, styles.statusMessageCard]}>
            <Ionicons 
              name={proposal.status === 'completed' ? 'checkmark-circle' : 'close-circle'} 
              size={48} 
              color={proposal.status === 'completed' ? '#22C55E' : '#EF4444'} 
            />
            <Text style={styles.statusMessageTitle}>
              {proposal.status === 'completed' ? 'Proposal Accepted!' : 
               proposal.status === 'rejected' ? 'Proposal Declined' : 'Proposal Cancelled'}
            </Text>
            <Text style={styles.statusMessageText}>
              {proposal.status === 'completed' 
                ? 'Congratulations! The client has accepted your proposal. You can now start working on the project.'
                : proposal.status === 'rejected'
                ? 'Unfortunately, the client has decided to go with another freelancer for this project.'
                : 'This proposal has been cancelled.'}
            </Text>
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
  optionsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  freelancerCard: {
    borderWidth: 1,
    borderColor: COLORS.accent + '20',
  },
  freelancerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: COLORS.accent + '30',
  },
  freelancerDetails: {
    flex: 1,
    marginLeft: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  freelancerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginRight: 8,
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
  freelancerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  viewProfileButton: {
    backgroundColor: COLORS.accent + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  viewProfileText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: COLORS.accentTertiary + '20',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  projectInfo: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  projectSummary: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dollarSign: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailsCard: {
    borderWidth: 1,
    borderColor: COLORS.accentSecondary + '20',
  },
  proposalText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  deliverableItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  deliverableText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  noteCard: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.accentSecondary + '20',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  actionButtons: {
    backgroundColor: COLORS.background,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  topButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  acceptButtonWrapper: {
    flex: 1,
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageButton: {
    backgroundColor: COLORS.accentTertiary + '20',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  declineButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  budgetInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary + '20',
  },
  statusMessageCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  statusMessageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  statusMessageText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});