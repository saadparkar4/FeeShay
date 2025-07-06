// ============================================================================
// SIGN UP SCREEN COMPONENT
// ============================================================================
// Complete registration form for new FeeShay users
// Features:
// - User information form (name, email, password, confirm password)
// - Role selection (Freelancer, Client, Both)
// - Password visibility toggle
// - Social registration options (Google, Apple)
// - Form validation
// - Backend integration ready with detailed comments
// ============================================================================

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';

// ============================================================================
// INTERFACES FOR TYPE SAFETY
// ============================================================================
interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'freelancer' | 'client' | 'both';
}

interface SignUpScreenProps {
  onSignUp?: (formData: SignUpFormData) => void;
  onGoogleSignUp?: () => void;
  onAppleSignUp?: () => void;
  onSignInPress?: () => void;
  onGoBack?: () => void;
}

// ============================================================================
// SIGN UP SCREEN COMPONENT
// ============================================================================
export default function SignUpScreen({ 
  onSignUp, 
  onGoogleSignUp, 
  onAppleSignUp, 
  onSignInPress,
  onGoBack 
}: SignUpScreenProps) {
  
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'freelancer'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ============================================================================
  // FORM VALIDATION FUNCTIONS
  // ============================================================================
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // Password should be at least 8 characters with at least one number and one letter
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name');
      return false;
    }
    
    if (!validateEmail(formData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!validatePassword(formData.password)) {
      Alert.alert(
        'Validation Error', 
        'Password must be at least 8 characters with at least one letter and one number'
      );
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return false;
    }
    
    return true;
  };

  // ============================================================================
  // FORM HANDLERS
  // ============================================================================
  const handleInputChange = (field: keyof SignUpFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRoleSelect = (role: 'freelancer' | 'client' | 'both') => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  // ============================================================================
  // SIGN UP HANDLER - READY FOR BACKEND INTEGRATION
  // ============================================================================
  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // TODO: BACKEND INTEGRATION
      // Replace this section with actual API call
      // Example:
      // const response = await fetch('YOUR_API_ENDPOINT/auth/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     fullName: formData.fullName,
      //     email: formData.email,
      //     password: formData.password,
      //     role: formData.role
      //   })
      // });
      // 
      // const data = await response.json();
      // 
      // if (response.ok) {
      //   // Store authentication token
      //   await AsyncStorage.setItem('authToken', data.token);
      //   await AsyncStorage.setItem('userRole', formData.role);
      //   onSignUp?.(formData);
      // } else {
      //   Alert.alert('Sign Up Failed', data.message || 'Please try again');
      // }

      // TEMPORARY: Simulate API call
      console.log('Sign Up Data:', formData);
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => onSignUp?.(formData) }
        ]);
      }, 1000);
      
    } catch (error) {
      setIsLoading(false);
      console.error('Sign up error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  // ============================================================================
  // SOCIAL SIGN UP HANDLERS - READY FOR BACKEND INTEGRATION
  // ============================================================================
  const handleGoogleSignUp = async () => {
    try {
      // TODO: GOOGLE OAUTH INTEGRATION
      // Example using @react-native-google-signin/google-signin:
      // await GoogleSignin.hasPlayServices();
      // const userInfo = await GoogleSignin.signIn();
      // 
      // Send Google token to your backend:
      // const response = await fetch('YOUR_API_ENDPOINT/auth/google', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     googleToken: userInfo.idToken,
      //     role: 'freelancer' // or let user choose
      //   })
      // });
      
      console.log('Google Sign Up pressed');
      onGoogleSignUp?.();
    } catch (error) {
      console.error('Google sign up error:', error);
      Alert.alert('Error', 'Google sign up failed. Please try again.');
    }
  };

  const handleAppleSignUp = async () => {
    try {
      // TODO: APPLE SIGN IN INTEGRATION
      // Example using @invertase/react-native-apple-authentication:
      // const appleAuthRequestResponse = await appleAuth.performRequest({
      //   requestedOperation: appleAuth.Operation.LOGIN,
      //   requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      // });
      // 
      // Send Apple token to your backend:
      // const response = await fetch('YOUR_API_ENDPOINT/auth/apple', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     appleToken: appleAuthRequestResponse.identityToken,
      //     role: 'freelancer' // or let user choose
      //   })
      // });
      
      console.log('Apple Sign Up pressed');
      onAppleSignUp?.();
    } catch (error) {
      console.error('Apple sign up error:', error);
      Alert.alert('Error', 'Apple sign up failed. Please try again.');
    }
  };

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top App Bar */}
        <View style={styles.appBar}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onGoBack}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Text style={styles.logoFee}>Fee</Text>
            <Text style={styles.logoShay}>Shay</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Create Your Account</Text>
          <Text style={styles.welcomeSubtitle}>Join FeeShay as a freelancer, client, or both</Text>
        </View>

        {/* Sign Up Form */}
        <View style={styles.formSection}>
          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Full Name"
              placeholderTextColor={COLORS.placeholder}
              value={formData.fullName}
              onChangeText={(text) => handleInputChange('fullName', text)}
              autoCapitalize="words"
              autoComplete="name"
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Email Address"
              placeholderTextColor={COLORS.placeholder}
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text.toLowerCase())}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              placeholderTextColor={COLORS.placeholder}
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color={COLORS.textSecondary} 
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Confirm Password"
              placeholderTextColor={COLORS.placeholder}
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons 
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color={COLORS.textSecondary} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Role Selection */}
        <View style={styles.roleSection}>
          <Text style={styles.roleTitle}>I want to join as:</Text>
          <View style={styles.roleGrid}>
            {/* Freelancer Option */}
            <TouchableOpacity
              style={[
                styles.roleOption,
                formData.role === 'freelancer' && styles.roleOptionSelected
              ]}
              onPress={() => handleRoleSelect('freelancer')}
            >
              <Ionicons 
                name="laptop-outline" 
                size={24} 
                color={formData.role === 'freelancer' ? COLORS.accent : COLORS.textSecondary} 
              />
              <Text style={[
                styles.roleText,
                formData.role === 'freelancer' && styles.roleTextSelected
              ]}>
                Freelancer
              </Text>
            </TouchableOpacity>

            {/* Client Option */}
            <TouchableOpacity
              style={[
                styles.roleOption,
                formData.role === 'client' && styles.roleOptionSelected
              ]}
              onPress={() => handleRoleSelect('client')}
            >
              <Ionicons 
                name="briefcase-outline" 
                size={24} 
                color={formData.role === 'client' ? COLORS.accent : COLORS.textSecondary} 
              />
              <Text style={[
                styles.roleText,
                formData.role === 'client' && styles.roleTextSelected
              ]}>
                Client
              </Text>
            </TouchableOpacity>

            {/* Both Option */}
            <TouchableOpacity
              style={[
                styles.roleOptionBoth,
                formData.role === 'both' && styles.roleOptionSelected
              ]}
              onPress={() => handleRoleSelect('both')}
            >
              <Ionicons 
                name="people-outline" 
                size={24} 
                color={formData.role === 'both' ? COLORS.accent : COLORS.textSecondary} 
              />
              <Text style={[
                styles.roleText,
                formData.role === 'both' && styles.roleTextSelected
              ]}>
                Both
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Up Button */}
        <View style={styles.signUpSection}>
          <TouchableOpacity
            style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text style={styles.signUpButtonText}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Social Sign Up */}
        <View style={styles.socialSection}>
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign up with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={handleGoogleSignUp}
            >
              <Ionicons name="logo-google" size={20} color="#4285F4" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialButton}
              onPress={handleAppleSignUp}
            >
              <Ionicons name="logo-apple" size={20} color="#000000" />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text style={styles.signInLink} onPress={onSignInPress}>
              Sign In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// STYLES FOR SIGN UP SCREEN
// ============================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 0,
  },

  // App Bar
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },

  backButton: {
    padding: 8,
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoFee: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.accent,
  },

  logoShay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.accentTertiary,
  },

  placeholder: {
    width: 40,
  },

  // Welcome Section
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },

  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },

  welcomeSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  // Form Section
  formSection: {
    marginBottom: 32,
    gap: 16,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.muted,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  inputIcon: {
    marginRight: 12,
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingVertical: 12,
  },

  eyeIcon: {
    padding: 8,
  },

  // Role Selection
  roleSection: {
    marginBottom: 32,
  },

  roleTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },

  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  roleOption: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
  },

  roleOptionBoth: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
  },

  roleOptionSelected: {
    borderColor: COLORS.accent,
    backgroundColor: `${COLORS.accent}10`,
  },

  roleText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginTop: 4,
  },

  roleTextSelected: {
    color: COLORS.accent,
  },

  // Sign Up Section
  signUpSection: {
    marginBottom: 24,
  },

  signUpButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  signUpButtonDisabled: {
    opacity: 0.6,
  },

  signUpButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },

  // Social Section
  socialSection: {
    marginBottom: 32,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  dividerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    paddingHorizontal: 16,
  },

  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },

  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },

  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },

  // Footer Section
  footerSection: {
    alignItems: 'center',
    marginTop: 'auto',
  },

  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  signInLink: {
    color: COLORS.accent,
    fontWeight: '500',
  },
}); 