import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/Colors';
import { router } from 'expo-router';

interface Job {
  _id: string;
  title: string;
  budget_min?: number;
  budget_max?: number;
  status: string;
  created_at: string;
  proposals?: any[];
}

interface ClientJobsSectionProps {
  jobs: Job[];
}

const ClientJobsSection: React.FC<ClientJobsSectionProps> = ({ jobs = [] }) => {
  // Ensure jobs is always an array
  const jobsArray = Array.isArray(jobs) ? jobs : [];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return COLORS.success;
      case 'in_progress':
        return COLORS.accentSecondary;
      case 'completed':
        return COLORS.textSecondary;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Active';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatBudget = (job: any) => {
    const min = job.budget_min ? parseFloat(job.budget_min.$numberDecimal || job.budget_min) : null;
    const max = job.budget_max ? parseFloat(job.budget_max.$numberDecimal || job.budget_max) : null;
    
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    } else if (min) {
      return `$${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to $${max.toLocaleString()}`;
    }
    return 'Budget TBD';
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffMs = now.getTime() - posted.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleViewAll = () => {
    router.push('/(protected)/(tabs)/(profile)/details/JobPost');
  };

  const handleJobPress = (jobId: string) => {
    // Navigate to job details
    console.log('Navigate to job:', jobId);
  };

  if (!jobsArray || jobsArray.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>My Jobs</Text>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="briefcase-outline" size={48} color={COLORS.textSecondary} />
          </View>
          <Text style={styles.emptyText}>No jobs posted yet</Text>
          <TouchableOpacity
            style={styles.postJobButton}
            onPress={() => router.push('/(protected)/(tabs)/(post)')}
          >
            <LinearGradient
              colors={[COLORS.accent, COLORS.accentSecondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Ionicons name="add" size={20} color={COLORS.background} />
              <Text style={styles.postJobButtonText}>Post Your First Job</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recent Jobs</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <LinearGradient
            colors={[COLORS.accent, COLORS.accentSecondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.background} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.jobsList}>
        {jobsArray.slice(0, 5).map((job) => (
          <TouchableOpacity
            key={job._id}
            style={styles.jobCard}
            onPress={() => handleJobPress(job._id)}
            activeOpacity={0.7}
          >
            <View style={styles.jobHeader}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) + '20' }]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(job.status) }]} />
                <Text style={[styles.statusText, { color: getStatusColor(job.status) }]}>
                  {getStatusText(job.status)}
                </Text>
              </View>
              <Text style={styles.postedDate}>{getTimeAgo(job.created_at)}</Text>
            </View>

            <Text style={styles.jobTitle} numberOfLines={2}>
              {job.title}
            </Text>

            <View style={styles.jobStats}>
              <View style={styles.statItem}>
                <Ionicons name="cash-outline" size={16} color={COLORS.accent} />
                <Text style={styles.statText}>{formatBudget(job)}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="document-text-outline" size={16} color={COLORS.accentSecondary} />
                <Text style={styles.statText}>{job.proposals?.length || 0} proposals</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.manageButton}>
              <Text style={styles.manageButtonText}>Manage</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.accent} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* Add New Job Card */}
        <TouchableOpacity
          style={[styles.jobCard, styles.addJobCard]}
          onPress={() => router.push('/(protected)/(tabs)/(post)')}
          activeOpacity={0.7}
        >
          <View style={styles.addJobContent}>
            <View style={styles.addIconContainer}>
              <Ionicons name="add" size={32} color={COLORS.accent} />
            </View>
            <Text style={styles.addJobText}>Post New Job</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.background,
  },
  jobsList: {
    paddingLeft: 20,
  },
  jobCard: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  postedDate: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
    lineHeight: 22,
  },
  jobStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent + '15',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
  },
  manageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accent,
  },
  addJobCard: {
    backgroundColor: COLORS.background,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addJobContent: {
    alignItems: 'center',
    gap: 12,
  },
  addIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.accent + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addJobText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  postJobButton: {
    borderRadius: 24,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  postJobButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },
});

export default ClientJobsSection;