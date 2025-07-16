import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/Colors';
import AuthContext from '@/context/AuthContext';
import { jobsApi, Category } from '@/api/jobs';

interface FormData {
  title: string;
  description: string;
  category: string;
  budget_min: string;
  budget_max: string;
  duration: string;
  skills: string[];
  projectType: 'fixed' | 'hourly';
  experienceLevel: 'entry' | 'intermediate' | 'expert';
}

export default function CreateJobScreen() {
  const router = useRouter();
  const { user, userRole } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Debug log to check user role
  console.log('Current user role:', userRole);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    budget_min: '',
    budget_max: '',
    duration: '',
    skills: [],
    projectType: 'fixed',
    experienceLevel: 'intermediate',
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    fetchCategories();
    
    // Check if user has correct role
    if (userRole !== 'client') {
      Alert.alert(
        'Access Denied', 
        'Only clients can create jobs. Please log out and log back in to refresh your account permissions.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  }, [userRole]);

  const fetchCategories = async () => {
    try {
      const response = await jobsApi.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
        console.log('Categories fetched:', response.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
      console.error('Error details:', error.response?.data);
      Alert.alert('Warning', 'Failed to load categories. Please try again later.');
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill),
    });
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.title || !formData.description || !formData.category || 
        !formData.budget_min || !formData.budget_max || !formData.duration) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Validate field lengths
    if (formData.title.length < 5) {
      Alert.alert('Error', 'Title must be at least 5 characters long');
      return;
    }
    
    if (formData.title.length > 100) {
      Alert.alert('Error', 'Title must be less than 100 characters');
      return;
    }
    
    if (formData.description.length < 10) {
      Alert.alert('Error', 'Description must be at least 10 characters long');
      return;
    }
    
    if (formData.description.length > 2000) {
      Alert.alert('Error', 'Description must be less than 2000 characters');
      return;
    }
    
    // Validate budget values
    const minBudget = parseFloat(formData.budget_min);
    const maxBudget = parseFloat(formData.budget_max);
    
    if (isNaN(minBudget) || isNaN(maxBudget)) {
      Alert.alert('Error', 'Please enter valid budget amounts');
      return;
    }
    
    if (minBudget <= 0 || maxBudget <= 0) {
      Alert.alert('Error', 'Budget must be greater than 0');
      return;
    }
    
    if (minBudget > maxBudget) {
      Alert.alert('Error', 'Minimum budget cannot be greater than maximum budget');
      return;
    }

    setLoading(true);
    try {
      // Map form data to match backend expectations
      const projectTypeMap: { [key: string]: string } = {
        'fixed': 'Fixed Price',
        'hourly': 'Hourly'
      };
      
      const experienceLevelMap: { [key: string]: string } = {
        'entry': 'Entry',
        'intermediate': 'Intermediate',
        'expert': 'Expert'
      };

      const jobData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget_min: parseFloat(formData.budget_min),
        budget_max: parseFloat(formData.budget_max),
        budget: parseFloat(formData.budget_max), // Using max as the main budget
        duration: formData.duration,
        skills: formData.skills,
        projectType: projectTypeMap[formData.projectType],
        experienceLevel: experienceLevelMap[formData.experienceLevel],
        status: 'open',
        visibility: 'public',
      };

      const response = await jobsApi.createJob(jobData);
      
      if (response.success) {
        Alert.alert('Success', 'Job posted successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error: any) {
      console.error('Job creation error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Request data sent:', jobData);
      
      let errorMessage = 'Failed to create job';
      
      // Handle different error scenarios
      if (error.response?.status === 401) {
        errorMessage = 'You are not authorized. Please login again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Only clients can create jobs.';
      } else if (error.response?.status === 404 && error.response?.data?.message?.includes('profile')) {
        errorMessage = 'Your profile is not properly set up. Please log out and log back in, or contact support.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors;
        if (Array.isArray(validationErrors)) {
          errorMessage = validationErrors.map((err: any) => err.msg || err.message).join(', ');
        }
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post a New Job</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.formSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Job Title *</Text>
              <Text style={[
                styles.charCount,
                formData.title.length < 5 && formData.title.length > 0 && styles.charCountError
              ]}>
                {formData.title.length}/100
              </Text>
            </View>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="e.g., Build a Mobile App (min. 5 characters)"
              placeholderTextColor={COLORS.textSecondary}
              maxLength={100}
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Description *</Text>
              <Text style={[
                styles.charCount,
                formData.description.length < 10 && formData.description.length > 0 && styles.charCountError
              ]}>
                {formData.description.length}/2000
              </Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Describe your project in detail... (min. 10 characters)"
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={2000}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category._id}
                    style={[
                      styles.categoryChip,
                      formData.category === category._id && styles.categoryChipActive,
                    ]}
                    onPress={() => setFormData({ ...formData, category: category._id })}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        formData.category === category._id && styles.categoryTextActive,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Budget Range (KD) *</Text>
            <View style={styles.budgetRow}>
              <TextInput
                style={[styles.input, styles.budgetInput]}
                value={formData.budget_min}
                onChangeText={(text) => setFormData({ ...formData, budget_min: text })}
                placeholder="Min (e.g., 50)"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
              />
              <Text style={styles.budgetSeparator}>to</Text>
              <TextInput
                style={[styles.input, styles.budgetInput]}
                value={formData.budget_max}
                onChangeText={(text) => setFormData({ ...formData, budget_max: text })}
                placeholder="Max (e.g., 200)"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Project Type *</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setFormData({ ...formData, projectType: 'fixed' })}
              >
                <View style={styles.radio}>
                  {formData.projectType === 'fixed' && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text style={styles.radioText}>Fixed Price</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setFormData({ ...formData, projectType: 'hourly' })}
              >
                <View style={styles.radio}>
                  {formData.projectType === 'hourly' && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text style={styles.radioText}>Hourly Rate</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Duration *</Text>
            <TextInput
              style={styles.input}
              value={formData.duration}
              onChangeText={(text) => setFormData({ ...formData, duration: text })}
              placeholder="e.g., 2 weeks, 1 month"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Required Skills</Text>
            <View style={styles.skillInputContainer}>
              <TextInput
                style={[styles.input, styles.skillInput]}
                value={skillInput}
                onChangeText={setSkillInput}
                placeholder="Add a skill"
                placeholderTextColor={COLORS.textSecondary}
                onSubmitEditing={handleAddSkill}
              />
              <TouchableOpacity style={styles.addSkillButton} onPress={handleAddSkill}>
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.skillsList}>
              {formData.skills.map((skill) => (
                <View key={skill} style={styles.skillChip}>
                  <Text style={styles.skillChipText}>{skill}</Text>
                  <TouchableOpacity onPress={() => handleRemoveSkill(skill)}>
                    <Ionicons name="close-circle" size={18} color={COLORS.accent} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Experience Level</Text>
            <View style={styles.experienceContainer}>
              {['entry', 'intermediate', 'expert'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.experienceOption,
                    formData.experienceLevel === level && styles.experienceOptionActive,
                  ]}
                  onPress={() => setFormData({ ...formData, experienceLevel: level as any })}
                >
                  <Text
                    style={[
                      styles.experienceText,
                      formData.experienceLevel === level && styles.experienceTextActive,
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient
              colors={[COLORS.accent, COLORS.accentSecondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitGradient}
            >
              <Text style={styles.submitText}>
                {loading ? 'Posting...' : 'Post Job'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  charCountError: {
    color: COLORS.error || '#EF4444',
  },
  keyboardView: {
    flex: 1,
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
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  formSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.secondary + '30',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.secondary + '10',
    borderWidth: 1,
    borderColor: COLORS.secondary + '20',
  },
  categoryChipActive: {
    backgroundColor: COLORS.accent + '20',
    borderColor: COLORS.accent,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  categoryTextActive: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  budgetInput: {
    flex: 1,
  },
  budgetSeparator: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 24,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
  },
  radioText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  skillInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  skillInput: {
    flex: 1,
  },
  addSkillButton: {
    backgroundColor: COLORS.accent,
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accent + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillChipText: {
    fontSize: 14,
    color: COLORS.accent,
  },
  experienceContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  experienceOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: COLORS.secondary + '10',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.secondary + '20',
  },
  experienceOptionActive: {
    backgroundColor: COLORS.accentTertiary + '20',
    borderColor: COLORS.accentTertiary,
  },
  experienceText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  experienceTextActive: {
    color: COLORS.accentTertiary,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 20,
  },
  submitGradient: {
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});