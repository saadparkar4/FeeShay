/**
 * Proposals Screen Component
 * 
 * Main screen for viewing and managing proposals from freelancers
 * Features:
 * - Tab navigation (Active, Completed, Cancelled)
 * - Paginated proposal list
 * - Proposal cards with freelancer info
 * - Navigation to detailed proposal view
 * 
 * This screen helps users manage incoming proposals for their job posts
 */

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { ProposalCard, Proposal } from '@/components/Proposals/ProposalCard';
import { TabBar, TabType } from '@/components/Proposals/TabBar';
import { Pagination } from '@/components/Proposals/Pagination';
import TopBar from '@/components/Home/TopBar';

// Mock proposal data - In production, this would be fetched from an API
// Each proposal represents a freelancer's offer for a job
const mockProposals: Proposal[] = [
  {
    id: '1',
    freelancerName: 'Michael Chen',
    freelancerAvatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
    projectTitle: 'Website Redesign Project',
    rating: 4.7,
    price: 1200,
    duration: '14 days',
    description: 'I can revamp your website with modern design principles and ensure it\'s fully responsive across all devices...',
    status: 'active'
  },
  {
    id: '2',
    freelancerName: 'Emma Rodriguez',
    freelancerAvatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
    projectTitle: 'Logo Design for Startup',
    rating: 5.0,
    price: 350,
    duration: '5 days',
    description: 'I specialize in creating modern, memorable logos that capture brand essence. Will deliver multiple concepts with unlimited revisions...',
    status: 'active'
  },
  {
    id: '3',
    freelancerName: 'Sarah Johnson',
    freelancerAvatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
    projectTitle: 'Social Media Content Creation',
    rating: 4.9,
    price: 800,
    duration: '10 days',
    description: 'I can create a month\'s worth of engaging social media content tailored to your brand voice and target audience...',
    status: 'active'
  },
  {
    id: '4',
    freelancerName: 'David Wilson',
    freelancerAvatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg',
    projectTitle: 'Mobile App Development',
    rating: 4.6,
    price: 3500,
    duration: '30 days',
    description: 'I can build a high-performance cross-platform mobile app using React Native with all the features you\'ve specified...',
    status: 'active'
  },
  {
    id: '5',
    freelancerName: 'Alex Thompson',
    freelancerAvatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
    projectTitle: 'SEO Optimization',
    rating: 4.8,
    price: 500,
    duration: '7 days',
    description: 'Complete SEO audit and optimization for your website to improve search rankings and organic traffic...',
    status: 'completed'
  },
  {
    id: '6',
    freelancerName: 'Lisa Chen',
    freelancerAvatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
    projectTitle: 'Video Editing Project',
    rating: 4.5,
    price: 750,
    duration: '5 days',
    description: 'Professional video editing with color grading, transitions, and motion graphics...',
    status: 'cancelled'
  },
];

export default function ProposalsScreen() {
  // Router for navigation to proposal details
  const router = useRouter();
  
  // State for currently selected tab (Active/Completed/Cancelled)
  const [selectedTab, setSelectedTab] = useState<TabType>('Active');
  
  // State for current page in pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  // Number of proposals to show per page
  const itemsPerPage = 4;

  // Filter proposals based on selected tab
  // Uses memoization to avoid unnecessary recalculations
  const filteredProposals = useMemo(() => {
    // Map tab names to proposal status values
    const statusMap = {
      'Active': 'active',
      'Completed': 'completed',
      'Cancelled': 'cancelled'
    };
    // Return only proposals matching current tab status
    return mockProposals.filter(p => p.status === statusMap[selectedTab]);
  }, [selectedTab]);  // Recalculate when tab changes

  // Pagination calculations
  const totalPages = Math.ceil(filteredProposals.length / itemsPerPage);
  
  // Get proposals for current page
  const paginatedProposals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProposals.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProposals, currentPage]);  // Recalculate when page or filters change

  // Effect to reset pagination when switching tabs
  // Prevents showing empty pages when tab has fewer items
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab]);

  // Handler for viewing full proposal details
  // Navigates to detail screen with proposal data
  const handleViewDetails = (proposal: Proposal) => {
    // Navigate to dynamic route [id].tsx with proposal info
    router.push({
      pathname: '/(protected)/(tabs)/(proposals)/[id]',
      params: { 
        id: proposal.id,           // Pass proposal ID
        status: proposal.status    // Pass status for proper display
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top navigation bar component */}
        <TopBar />
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Page Header - Title and description */}
          <View style={styles.header}>
            <Text style={styles.title}>Proposals</Text>
            <Text style={styles.subtitle}>Manage job proposals from freelancers</Text>
          </View>

          {/* Tab Bar - Switch between proposal states */}
          <TabBar 
            selectedTab={selectedTab} 
            onTabChange={setSelectedTab}  // Update selected tab
          />

          {/* Proposals List - Main content area */}
          <View style={styles.proposalsList}>
            {paginatedProposals.length > 0 ? (
              // Map through proposals and render cards
              paginatedProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onViewDetails={() => handleViewDetails(proposal)}
                />
              ))
            ) : (
              // Empty state when no proposals match current filter
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No {selectedTab.toLowerCase()} proposals</Text>
              </View>
            )}
          </View>

          {/* Pagination - Only show if multiple pages exist */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}  // Handle page navigation
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Styles for the proposals screen
const styles = StyleSheet.create({
  // Safe area wrapper
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Main container
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Header section with title
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  // Main title text
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  // Subtitle description
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  // Container for proposal cards
  proposalsList: {
    paddingHorizontal: 16,
    paddingBottom: 100,     // Extra space for bottom tab navigation
  },
  // Empty state styling
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,    // Generous padding for visibility
  },
  // Empty state message
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});