/**
 * JobPost Screen Component
 * 
 * Displays a list of job posts created by the user with:
 * - Post new job button at the top
 * - List of job cards showing job details
 * - Status indicators (open, in progress, closed)
 * - Action buttons based on job status
 * 
 * This screen helps users manage their posted jobs and view proposals
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ColorValue,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { jobsApi } from '@/api/jobs';

// Type definition for job post data structure
interface JobPostData {
  id: string;           // Unique identifier
  title: string;        // Job title
  categories: {         // Array of job categories/tags
    name: string;       // Category display name
    color: 'primary' | 'secondary' | 'accent';  // Color theme for the category
  }[];
  budget: string;       // Budget amount (e.g., "80 KD")
  proposals: number;    // Number of proposals received
  status: 'open' | 'in_progress' | 'closed';  // Current job status
  timeAgo: string;      // Time since posted (e.g., "2 days ago")
}

// Mock job posts data - In production, this would be fetched from an API
// Each job represents a different project with various states
const jobPostsData: JobPostData[] = [
  {
    id: '1',
    title: 'Build Landing Page',
    categories: [
      { name: 'Tech', color: 'accent' },
      { name: 'Design', color: 'secondary' },
    ],
    budget: '80 KD',
    proposals: 12,
    status: 'open',
    timeAgo: '2 days ago',
  },
  {
    id: '2',
    title: 'Logo Design Project',
    categories: [
      { name: 'Design', color: 'primary' },
      { name: 'Branding', color: 'secondary' },
    ],
    budget: '45 KD',
    proposals: 8,
    status: 'in_progress',
    timeAgo: '5 days ago',
  },
  {
    id: '3',
    title: 'Mobile App UI/UX',
    categories: [
      { name: 'UI/UX', color: 'accent' },
      { name: 'Mobile', color: 'primary' },
    ],
    budget: '120 KD',
    proposals: 15,
    status: 'closed',
    timeAgo: '1 week ago',
  },
  {
    id: '4',
    title: 'Content Writing',
    categories: [
      { name: 'Writing', color: 'secondary' },
      { name: 'Marketing', color: 'accent' },
    ],
    budget: '35 KD',
    proposals: 3,
    status: 'open',
    timeAgo: '1 day ago',
  },
];

/**
 * JobPostCard Component
 * 
 * Renders an individual job post card displaying:
 * - Job title and categories
 * - Budget and proposal count
 * - Status badge with appropriate colors
 * - Action buttons (edit/delete)
 * - CTA button that changes based on status
 * 
 * @param job - The job post data to display
 */
const JobPostCard = ({ job }: { job: JobPostData }) => {
  const router = useRouter();
  // Determines the appropriate colors and text for the status badge
  // Different statuses get different color schemes
  const getStatusStyle = () => {
    switch (job.status) {
      case 'open':
        return {
          colors: ['#22C55E', '#16A34A'], // Green gradient indicates accepting proposals
          text: 'Open',
        };
      case 'in_progress':
        return {
          colors: ['#FACC15', '#F59E0B'], // Yellow gradient indicates work in progress
          text: 'In Progress',
        };
      case 'closed':
        return {
          colors: ['#6B7280', '#4B5563'], // Gray gradient indicates completed/closed
          text: 'Closed',
        };
    }
  };

  // Maps category color names to actual color values from the theme
  // This allows flexible color assignment to categories
  const getCategoryColor = (color: string) => {
    switch (color) {
      case 'primary':
        return COLORS.accent;          // Pink color
      case 'secondary':
        return COLORS.accentSecondary; // Purple color
      case 'accent':
        return COLORS.accentTertiary;  // Blue color
      default:
        return COLORS.accent;          // Fallback to pink
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <View style={styles.jobCard}>
      {/* Job header section - Contains title, categories, and action buttons */}
      <View style={styles.jobHeader}>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          
          {/* Category badges - Display job categories with gradient backgrounds */}
          <View style={styles.categoriesContainer}>
            {job.categories.map((category, index) => (
              <LinearGradient
                key={index}
                // Light gradient background (30% to 20% opacity)
                colors={[getCategoryColor(category.color) + '30', getCategoryColor(category.color) + '20']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.categoryBadge}
              >
                <Text style={[styles.categoryText, { color: getCategoryColor(category.color) }]}>
                  {category.name}
                </Text>
              </LinearGradient>
            ))}
          </View>
        </View>
        
        {/* Action buttons for editing and deleting the job post */}
        <View style={styles.actionButtons}>
          {/* Edit button */}
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.accentTertiary + '15' }]}>
            <Ionicons name="pencil" size={12} color={COLORS.accentTertiary} />
          </TouchableOpacity>
          {/* Delete button */}
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="trash" size={12} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Job details section with budget, proposals, and status */}
      <View style={styles.jobDetails}>
        {/* Budget row */}
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <View style={[styles.detailIcon, { backgroundColor: COLORS.accent + '15' }]}>
              <Text style={[styles.dollarSign, { color: COLORS.accent }]}>$</Text>
            </View>
            <Text style={styles.detailText}>Budget: {job.budget}</Text>
          </View>
          
          {/* Status badge */}
          <LinearGradient
            colors={statusStyle.colors as [ColorValue, ColorValue, ...ColorValue[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.statusBadge}
          >
            <Text style={styles.statusText}>{statusStyle.text}</Text>
          </LinearGradient>
        </View>

        {/* Proposals row */}
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <View style={[styles.detailIcon, { backgroundColor: COLORS.accentSecondary + '15' }]}>
              <Ionicons name="document-text" size={12} color={COLORS.accentSecondary} />
            </View>
            <Text style={styles.detailText}>{job.proposals} Proposals</Text>
          </View>
          <Text style={styles.timeText}>{job.timeAgo}</Text>
        </View>
      </View>

      {/* Dynamic action button - Changes text and color based on job status */}
      <TouchableOpacity
        onPress={() => {
          if (job.status === 'open') {
            router.push(`/(protected)/(tabs)/(profile)/details/job-proposals?jobId=${job.id}`);
          }
        }}
      >
        <LinearGradient
          colors={
            job.status === 'open' 
              ? [COLORS.accentTertiary, COLORS.accent]     // Blue to pink for open jobs
              : job.status === 'in_progress'
              ? [COLORS.accentSecondary, COLORS.accent]    // Purple to pink for active jobs
              : ['#9CA3AF', '#6B7280']                     // Gray for closed jobs
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.viewButton}
        >
          <Text style={styles.viewButtonText}>
            {job.status === 'open' 
              ? 'View Proposals'
              : job.status === 'in_progress' 
              ? 'Manage Project'
              : 'Project Completed'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Main JobPost Screen Component
 * 
 * The main screen that displays all job posts created by the user
 * Features:
 * - Header with back navigation and add button
 * - "Post a New Job" CTA button
 * - Scrollable list of job post cards
 * - Different states for open, in progress, and closed jobs
 */
export default function JobPostScreen() {
  // Navigation router for handling screen transitions
  const router = useRouter();
  
  // State for managing jobs data
  const [jobs, setJobs] = useState<JobPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const response = await jobsApi.getMyJobs();
      if (response.success && response.data) {
        // Transform API data to match our JobPostData interface
        const transformedJobs = response.data.jobs.map((job: any) => ({
          id: job._id || job.id,
          title: job.title,
          categories: job.category ? [{ name: job.category.name || job.category, color: 'primary' }] : [],
          budget: `${parseFloat(job.budget_min?.$numberDecimal || job.budget_min || 0)}-${parseFloat(job.budget_max?.$numberDecimal || job.budget_max || 0)} KD`,
          proposals: job.proposal_count || job.proposals || 0,
          status: job.status || 'open',
          timeAgo: getTimeAgo(job.created_at),
        }));
        setJobs(transformedJobs);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      // Use mock data as fallback
      setJobs(jobPostsData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyJobs();
  };

  // Helper function to calculate time ago
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} week${days >= 14 ? 's' : ''} ago`;
    return `${Math.floor(days / 30)} month${days >= 60 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={18} color={COLORS.accent} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Job Posts</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header section with back button and add button */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={18} color={COLORS.accent} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Job Posts</Text>
        </View>
        
        
      </View>

      {/* Scrollable content area */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.accent}
          />
        }
      >
        {/* Post new job button */}
        <TouchableOpacity 
          style={styles.postNewJobButton}
          onPress={() => router.push('/(protected)/(tabs)/(profile)/details/create-job')}
        >
          <LinearGradient
            colors={[COLORS.accent, COLORS.accentSecondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.postNewJobGradient}
          >
            <Ionicons name="add" size={18} color="white" style={styles.postNewJobIcon} />
            <Text style={styles.postNewJobText}>Post a New Job</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* List of job posts */}
        <View style={styles.jobsList}>
          {jobs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="briefcase-outline" size={64} color={COLORS.textSecondary} />
              <Text style={styles.emptyTitle}>No Jobs Posted Yet</Text>
              <Text style={styles.emptyText}>
                Click the button above to post your first job!
              </Text>
            </View>
          ) : (
            jobs.map((job) => (
              <JobPostCard key={job.id} job={job} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// StyleSheet definitions organized by component/section
// Using consistent spacing, colors, and shadows throughout
const styles = StyleSheet.create({
  // Main container - Full screen with theme background
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Header styles
  header: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: COLORS.accent + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Content area styles
  content: {
    flex: 1,
    paddingTop: 20,
  },
  
  // Post new job button styles
  postNewJobButton: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  postNewJobGradient: {
    paddingVertical: 16,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  postNewJobIcon: {
    marginRight: 12,
  },
  postNewJobText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Jobs list container
  jobsList: {
    paddingHorizontal: 16,
  },
  
  // Job card styles
  jobCard: {
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
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  
  // Category styles
  categoriesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Action buttons styles
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Job details styles
  jobDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  dollarSign: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  
  // Status badge styles
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  
  // View button styles
  viewButton: {
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
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
});