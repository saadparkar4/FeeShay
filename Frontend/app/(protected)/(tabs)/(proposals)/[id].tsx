import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/Colors';

// Type definition for proposal status - helps TypeScript understand what values are allowed
type ProposalStatus = 'active' | 'completed' | 'cancelled';

// Mock data function - simulates fetching proposal data from an API
// In a real app, this would be replaced with an actual API call
const getProposalData = (id: string) => ({
  freelancer: {
    name: 'Alex Johnson',
    title: 'Full Stack Developer',
    location: 'San Francisco, CA',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
    rating: 4.7,
  },
  project: {
    title: 'E-commerce Website Redesign',
    summary: 'Complete redesign of your online store with modern UI/UX and enhanced functionality...',
    timeline: '14 Days',
    budget: '$1,200',
    skills: ['UI/UX Design', 'Web Development', 'E-commerce', 'Responsive'],
    status: 'active' as ProposalStatus,
  },
  proposal: {
    description: `Hello! I'm excited to work on your e-commerce website redesign project. Based on your requirements, I'll deliver a modern, user-friendly online store that will enhance your customer experience and boost conversions.`,
    deliverables: [
      'Complete UI/UX redesign with modern aesthetics',
      'Mobile-responsive design for all devices',
      'Enhanced product catalog and search functionality',
      'Streamlined checkout process',
      'Performance optimization and SEO improvements',
      'Admin dashboard for easy management',
    ],
    approach: `I'll use React.js for the frontend and Node.js for the backend, ensuring a fast and scalable solution. The project will be completed in 14 days with regular updates and revisions included.`,
    closingNote: 'Looking forward to bringing your vision to life!',
  },
  attachments: [
    { type: 'image', name: 'Design Mockup', file: 'portfolio_sample.jpg', icon: 'image' },
    { type: 'pdf', name: 'Project Plan', file: 'timeline_plan.pdf', icon: 'document' },
  ],
  personalNote: `I noticed your current website has some performance issues. I'll make sure to optimize the loading speed and implement best practices for better user experience. I'm also available for a quick call to discuss any specific requirements you might have!`,
});

export default function ProposalDetailsScreen() {
  // Extract URL parameters - id is the proposal ID, status is the proposal status
  const { id, status: paramStatus } = useLocalSearchParams();
  
  // Router hook for navigation (e.g., going back to previous screen)
  const router = useRouter();
  
  // Fetch proposal data using the ID from URL params
  const data = getProposalData(id as string);
  
  // Determine the proposal status - use the one from URL params if available,
  // otherwise fall back to the default status from mock data
  const status = (paramStatus as ProposalStatus) || data.project.status;

  // Helper function to get appropriate colors and text based on proposal status
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          text: 'Completed',
          color: '#22C55E',      // Green color for completed
          bgColor: '#22C55E20',  // Light green background (20% opacity)
        };
      case 'cancelled':
        return {
          text: 'Cancelled',
          color: '#EF4444',      // Red color for cancelled
          bgColor: '#EF444420',  // Light red background (20% opacity)
        };
      default:
        
        return null; // Active proposals don't show a status badge
    }
  };

  // Get the status configuration (colors and text)
  const statusConfig = getStatusConfig();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section - Fixed at top with back button, title, and options menu */}
      <View style={styles.header}>
        {/* Back button - returns to previous screen (proposals list) */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        {/* Screen title */}
        <Text style={styles.headerTitle}>Proposal Details</Text>
        
        {/* Options menu button (for future features like report, save, etc.) */}
        <TouchableOpacity style={styles.optionsButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Freelancer Header Card */}
        <View style={[styles.card, styles.freelancerCard]}>
          <View style={styles.freelancerInfo}>
            <Image source={{ uri: data.freelancer.avatar }} style={styles.avatar} />
            <View style={styles.freelancerDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.freelancerName}>{data.freelancer.name}</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color="#FFB800" />
                  <Text style={styles.rating}>{data.freelancer.rating}</Text>
                </View>
              </View>
              <Text style={styles.freelancerTitle}>{data.freelancer.title}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={12} color={COLORS.textSecondary} />
                <Text style={styles.location}>{data.freelancer.location}</Text>
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
              <Text style={styles.projectTitle}>{data.project.title}</Text>
              {statusConfig && (
                <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
                  <Text style={[styles.statusText, { color: statusConfig.color }]}>
                    {statusConfig.text}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.projectSummary}>{data.project.summary}</Text>
          </View>

          <View style={styles.metricsRow}>
            <View style={[styles.metricCard, { backgroundColor: COLORS.accentTertiary + '20' }]}>
              <View style={styles.metricHeader}>
                <Ionicons name="time" size={16} color={COLORS.accentTertiary} />
                <Text style={styles.metricLabel}>Timeline</Text>
              </View>
              <Text style={[styles.metricValue, { color: COLORS.accentTertiary }]}>
                {data.project.timeline}
              </Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: COLORS.accent + '20' }]}>
              <View style={styles.metricHeader}>
                <Text style={[styles.dollarSign, { color: COLORS.accent }]}>$</Text>
                <Text style={styles.metricLabel}>Budget</Text>
              </View>
              <Text style={[styles.metricValue, { color: COLORS.accent }]}>
                {data.project.budget}
              </Text>
            </View>
          </View>

          <View style={styles.skillsContainer}>
            {data.project.skills.map((skill, index) => (
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
          
          <Text style={styles.proposalText}>{data.proposal.description}</Text>
          
          <Text style={styles.subheading}>What I'll deliver:</Text>
          {data.proposal.deliverables.map((item, index) => (
            <View key={index} style={styles.deliverableItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.deliverableText}>{item}</Text>
            </View>
          ))}
          
          <Text style={styles.proposalText}>{data.proposal.approach}</Text>
          
          <Text style={styles.closingNote}>{data.proposal.closingNote}</Text>
        </View>

        {/* Attachments */}
        <View style={[styles.card, styles.attachmentsCard]}>
          <Text style={styles.sectionTitle}>Attachments</Text>
          
          <View style={styles.attachmentsGrid}>
            {data.attachments.map((attachment, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.attachmentItem,
                  {
                    backgroundColor:
                      index === 0
                        ? `linear-gradient(135deg, ${COLORS.accent}20 0%, ${COLORS.accentSecondary}20 100%)`
                        : `linear-gradient(135deg, ${COLORS.accentTertiary}20 0%, ${COLORS.accent}20 100%)`,
                  },
                ]}
              >
                <LinearGradient
                  colors={
                    index === 0
                      ? [COLORS.accent + '20', COLORS.accentSecondary + '20']
                      : [COLORS.accentTertiary + '20', COLORS.accent + '20']
                  }
                  style={styles.attachmentGradient}
                >
                  <Ionicons
                    name={attachment.icon as any}
                    size={24}
                    color={index === 0 ? COLORS.accent : COLORS.accentTertiary}
                  />
                  <Text style={styles.attachmentName}>{attachment.name}</Text>
                  <Text style={styles.attachmentFile}>{attachment.file}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Personal Note */}
        <View style={[styles.card, styles.noteCard]}>
          <View style={styles.noteHeader}>
            <Ionicons name="document-text" size={18} color={COLORS.accentSecondary} />
            <Text style={styles.sectionTitle}>Personal Note</Text>
          </View>
          <Text style={styles.noteText}>"{data.personalNote}"</Text>
        </View>

        {/* Spacer for bottom buttons */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Action Buttons - Only show for active proposals */}
      {status === 'active' && (
        <View style={styles.actionButtons}>
          <View style={styles.topButtonsRow}>
            <TouchableOpacity style={styles.acceptButtonWrapper}>
              <LinearGradient
                colors={[COLORS.accent, COLORS.accentSecondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.acceptButton}
              >
                <Ionicons name="checkmark" size={20} color="white" />
                <Text style={styles.acceptButtonText}>Accept Proposal</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.messageButton}>
              <Ionicons name="chatbubble" size={24} color={COLORS.accentTertiary} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.declineButton}>
            <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            <Text style={styles.declineButtonText}>Decline Proposal</Text>
          </TouchableOpacity>
        </View>
      )}
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
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
    shadowOpacity: 0.25,
    shadowRadius: 20,
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
  closingNote: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  attachmentsCard: {
    borderWidth: 1,
    borderColor: COLORS.accentSecondary + '20',
  },
  attachmentsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  attachmentItem: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  attachmentGradient: {
    padding: 16,
    alignItems: 'center',
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  attachmentFile: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    padding: 20,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
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
});