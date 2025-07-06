import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, SafeAreaView, Platform } from 'react-native';
import Constants from 'expo-constants';
import TopBar from '../../../components/Home/TopBar';
import SearchBar from '../../../components/Home/SearchBar';
import CategoryScroll from '../../../components/Home/CategoryScroll';
import ToggleBar from '../../../components/Home/ToggleBar';
import TalentCard from '../../../components/Home/TalentCard';
import JobCard from '../../../components/Home/JobCard';
import Fab from '../../../components/Home/Fab';
import { COLORS } from '../../../constants/Colors';

// ============================================================================
// DYNAMIC CATEGORY GENERATION
// ============================================================================
// Generate categories dynamically based on current tab data
const getDynamicCategories = (data: any[]) => {
  const uniqueCategories = [...new Set(data.map(item => item.category))];
  return ['All Categories', ...uniqueCategories.sort()];
};

// ============================================================================
// MOCK DATA - TALENTS (FREELANCERS)
// ============================================================================
// Sample freelancer data with all necessary fields for display
// TODO: Replace with backend API call to fetch talents
const talents = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'UI/UX Designer & Illustrator',
    location: 'New York, US',
    rating: 4.9,
    price: 45,
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
    category: 'Graphic Designing',
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Full Stack Developer',
    location: 'San Francisco, US',
    rating: 4.7,
    price: 60,
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
    category: 'Web Development',
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    title: 'Content Writer & SEO Expert',
    location: 'Austin, US',
    rating: 5.0,
    price: 35,
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
    category: 'Content Writing',
  },
  {
    id: '4',
    name: 'David Kim',
    title: 'Digital Marketing Specialist',
    location: 'Los Angeles, US',
    rating: 4.8,
    price: 50,
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
    category: 'Digital Marketing',
  },
  {
    id: '5',
    name: 'Lisa Wang',
    title: 'Video Editor & Motion Designer',
    location: 'Chicago, US',
    rating: 4.6,
    price: 40,
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
    category: 'Video Editing',
  },
];

// ============================================================================
// MOCK DATA - JOBS (PROJECTS)
// ============================================================================
// Sample job posting data with diverse categories to showcase different colors
// TODO: Replace with backend API call to fetch jobs
const jobs = [
  {
    id: '1',
    title: 'Complete Brand Identity Design',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/8decf4170a-1220338dc9ccd47cd233.png',
    sellerAvatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
    sellerName: 'Emma W.',
    rating: 4.7,
    ratingCount: 98,
    category: 'Design',
    price: 250,
  },
  {
    id: '2',
    title: 'Website Development',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/90efecceec-ee1c74c722b3034a37ef.png',
    sellerAvatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
    sellerName: 'James H.',
    rating: 4.8,
    ratingCount: 156,
    category: 'Tech',
    price: 180,
  },
  {
    id: '3',
    title: 'Blog Content Writing',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/cffe96cd84-0fbdac65050f7a36822a.png',
    sellerAvatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg',
    sellerName: 'Sophia L.',
    rating: 4.7,
    ratingCount: 63,
    category: 'Writing',
    price: 65,
  },
  {
    id: '4',
    title: 'Social Media Marketing',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e398cd7767-77966952d90f712a2f7a.png',
    sellerAvatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg',
    sellerName: 'Jessica M.',
    rating: 4.6,
    ratingCount: 42,
    category: 'Marketing',
    price: 120,
  },
  {
    id: '5',
    title: 'Professional Photography',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/8decf4170a-1220338dc9ccd47cd233.png',
    sellerAvatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
    sellerName: 'Alex P.',
    rating: 4.9,
    ratingCount: 87,
    category: 'Photography',
    price: 300,
  },
  {
    id: '6',
    title: 'Music Production & Mixing',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/90efecceec-ee1c74c722b3034a37ef.png',
    sellerAvatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
    sellerName: 'Sam R.',
    rating: 4.8,
    ratingCount: 145,
    category: 'Music',
    price: 200,
  },
  {
    id: '7',
    title: '2D Animation & Motion Graphics',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/cffe96cd84-0fbdac65050f7a36822a.png',
    sellerAvatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
    sellerName: 'Maya K.',
    rating: 4.7,
    ratingCount: 76,
    category: 'Animation',
    price: 350,
  },
  {
    id: '8',
    title: 'Business Consulting',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e398cd7767-77966952d90f712a2f7a.png',
    sellerAvatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
    sellerName: 'Robert L.',
    rating: 4.9,
    ratingCount: 234,
    category: 'Consulting',
    price: 150,
  },
];

// ============================================================================
// MAIN HOME SCREEN COMPONENT
// ============================================================================
export default function HomeScreen() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  // UI state variables for managing user interactions and data filtering
  const [selectedCategory, setSelectedCategory] = useState('All Categories');  // Currently selected category filter
  const [tab, setTab] = useState<'talents' | 'jobs'>('talents');               // Current tab (talents or jobs)
  const [search, setSearch] = useState('');                                    // Search query text

  // ============================================================================
  // DYNAMIC CATEGORY GENERATION
  // ============================================================================
  // Generate categories with item counts based on current tab data
  // This shows users how many items are in each category
  const getCategoriesWithCounts = () => {
    const currentData = tab === 'talents' ? talents : jobs;
    const dynamicCategories = getDynamicCategories(currentData);
    const categoryCounts = currentData.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return dynamicCategories.map((cat: string) => ({
      name: cat,
      count: cat === 'All Categories' ? currentData.length : categoryCounts[cat] || 0
    }));
  };

  const categoriesWithCounts = getCategoriesWithCounts();

  // ============================================================================
  // DATA FILTERING LOGIC
  // ============================================================================
  // Filter talents based on search query and selected category
  // Search matches: name, title, location
  // Category filter: exact category match or "All Categories"
  const filteredTalents = talents.filter((talent) => {
    const matchesSearch = search === '' || 
      talent.name.toLowerCase().includes(search.toLowerCase()) ||
      talent.title.toLowerCase().includes(search.toLowerCase()) ||
      talent.location.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || 
      talent.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Filter jobs based on search query and selected category
  // Search matches: title, description
  // Category filter: exact category match or "All Categories"
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = search === '' || 
      job.title.toLowerCase().includes(search.toLowerCase()) 
      
    
    const matchesCategory = selectedCategory === 'All Categories' || 
      job.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // ============================================================================
  // TAB SWITCHING LOGIC
  // ============================================================================
  // Handle tab switching with smart category reset
  // If current category has no items in new tab, reset to "All Categories"
  const handleTabChange = (newTab: 'talents' | 'jobs') => {
    setTab(newTab);
    const currentData = newTab === 'talents' ? talents : jobs;
    const availableCategories = getDynamicCategories(currentData);
    const hasItemsInCategory = availableCategories.includes(selectedCategory);
    
    if (!hasItemsInCategory) {
      setSelectedCategory('All Categories');
    }
  };

  // ============================================================================
  // TODO: BACKEND INTEGRATION POINTS
  // ============================================================================
  // These are the main points where backend API calls will be needed:
  // 1. Fetch categories from backend
  // 2. Fetch talents with pagination and filtering
  // 3. Fetch jobs with pagination and filtering
  // 4. Get notification count for TopBar badge
  // 5. Handle search with backend search API
  // 6. Handle category filtering on backend

  // ============================================================================
  // RENDER UI
  // ============================================================================
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top navigation bar with logo and notifications */}
        <TopBar />
        
        {/* Main scrollable content area */}
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {/* Search bar for filtering content */}
          <SearchBar value={search} onChange={setSearch} />
          
          {/* Horizontal category filter with item counts */}
          <CategoryScroll 
            categories={categoriesWithCounts.map(cat => cat.name)} 
            selected={selectedCategory} 
            onSelect={setSelectedCategory} 
            displayNames={categoriesWithCounts.map(cat => `${cat.name} (${cat.count})`)}
          />
          
          {/* Tab switcher between Talents and Jobs */}
          <ToggleBar tab={tab} setTab={handleTabChange} />
          
          {/* Content Section: Display filtered talents or jobs */}
          <View style={styles.cardsSection}>
            {tab === 'talents'
              ? filteredTalents.map((talent) => <TalentCard key={talent.id} talent={talent} />)
              : filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
            }
            
            {/* No results message when filters return empty */}
            {tab === 'talents' && filteredTalents.length === 0 && (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No talents found matching your criteria</Text>
              </View>
            )}
            {tab === 'jobs' && filteredJobs.length === 0 && (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No jobs found matching your criteria</Text>
              </View>
            )}
          </View>
        </ScrollView>
        
        {/* Floating action button for creating new content */}
        <Fab />
      </View>
    </SafeAreaView>
  );
}

// ============================================================================
// STYLES FOR HOME SCREEN
// ============================================================================
const styles = StyleSheet.create({
  // Safe area wrapper for proper device compatibility
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
  },
  
  // Main container for the entire screen
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Cards section container
  cardsSection: {
    paddingHorizontal: 16,
    gap: 16,
  },

  // No results container
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  
  // No results text styling
  noResultsText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});