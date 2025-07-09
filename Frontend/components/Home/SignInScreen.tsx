// ============================================================================
// SIGN IN SCREEN COMPONENT
// ============================================================================
// Login form for existing FeeShay users
// Features:
// - Email and password authentication
// - Password visibility toggle
// - "Forgot Password?" functionality
// - Social login options (Google, Apple)
// - Form validation
// - Backend integration ready with detailed comments
// ============================================================================

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/Colors";

// ============================================================================
// INTERFACES FOR TYPE SAFETY
// ============================================================================
interface SignInFormData {
    email: string;
    password: string;
}

interface SignInScreenProps {
    onSignIn?: (formData: SignInFormData) => void;
    onGoogleSignIn?: () => void;
    onAppleSignIn?: () => void;
    onForgotPassword?: (email: string) => void;
    onSignUpPress?: () => void;
    onGoBack?: () => void;
}

// ============================================================================
// SIGN IN SCREEN COMPONENT
// ============================================================================
export default function SignInScreen({ onSignIn, onGoogleSignIn, onAppleSignIn, onForgotPassword, onSignUpPress, onGoBack }: SignInScreenProps) {
    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================
    const [formData, setFormData] = useState<SignInFormData>({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // ============================================================================
    // FORM VALIDATION FUNCTIONS
    // ============================================================================
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = (): boolean => {
        if (!validateEmail(formData.email)) {
            Alert.alert("Validation Error", "Please enter a valid email address");
            return false;
        }

        if (formData.password.length <= 8) {
            Alert.alert("Validation Error", "Password must be at least 8 characters");
            return false;
        }

        return true;
    };

    // ============================================================================
    // FORM HANDLERS
    // ============================================================================
    const handleInputChange = (field: keyof SignInFormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // ============================================================================
    // SIGN IN HANDLER - READY FOR BACKEND INTEGRATION
    // ============================================================================
    const handleSignIn = async () => {
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // TODO: BACKEND INTEGRATION
            // Replace this section with actual API call
            // Example:
            // const response = await fetch('YOUR_API_ENDPOINT/auth/login', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            //   body: JSON.stringify({
            //     email: formData.email,
            //     password: formData.password
            //   })
            // });
            //
            // const data = await response.json();
            //
            // if (response.ok) {
            //   // Store authentication token and user data
            //   await AsyncStorage.setItem('authToken', data.token);
            //   await AsyncStorage.setItem('userId', data.user.id);
            //   await AsyncStorage.setItem('userRole', data.user.role);
            //   await AsyncStorage.setItem('userEmail', data.user.email);
            //   await AsyncStorage.setItem('userName', data.user.name);
            //
            //   // Call success callback
            //   onSignIn?.(formData);
            // } else {
            //   // Handle different error types
            //   if (response.status === 401) {
            //     Alert.alert('Sign In Failed', 'Invalid email or password');
            //   } else if (response.status === 404) {
            //     Alert.alert('Account Not Found', 'No account found with this email');
            //   } else {
            //     Alert.alert('Sign In Failed', data.message || 'Please try again');
            //   }
            // }

            // TEMPORARY: Simulate API call
            console.log("Sign In Data:", formData);
            setTimeout(() => {
                setIsLoading(false);
                Alert.alert("Success", "Welcome back to FeeShay!", [{ text: "OK", onPress: () => onSignIn?.(formData) }]);
            }, 1000);
        } catch (error) {
            setIsLoading(false);
            console.error("Sign in error:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };

    // ============================================================================
    // FORGOT PASSWORD HANDLER - READY FOR BACKEND INTEGRATION
    // ============================================================================
    const handleForgotPassword = async () => {
        if (!formData.email) {
            Alert.alert("Email Required", "Please enter your email address first");
            return;
        }

        if (!validateEmail(formData.email)) {
            Alert.alert("Invalid Email", "Please enter a valid email address");
            return;
        }

        try {
            // TODO: BACKEND INTEGRATION
            // Replace this section with actual API call
            // Example:
            // const response = await fetch('YOUR_API_ENDPOINT/auth/forgot-password', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            //   body: JSON.stringify({
            //     email: formData.email
            //   })
            // });
            //
            // const data = await response.json();
            //
            // if (response.ok) {
            //   Alert.alert(
            //     'Password Reset Sent',
            //     'Check your email for password reset instructions'
            //   );
            // } else {
            //   Alert.alert('Error', data.message || 'Failed to send reset email');
            // }

            // TEMPORARY: Simulate API call
            console.log("Forgot password for:", formData.email);
            Alert.alert("Password Reset Sent", "Check your email for password reset instructions");
            onForgotPassword?.(formData.email);
        } catch (error) {
            console.error("Forgot password error:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };

    // ============================================================================
    // SOCIAL SIGN IN HANDLERS - READY FOR BACKEND INTEGRATION
    // ============================================================================
    const handleGoogleSignIn = async () => {
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
            //     email: userInfo.user.email,
            //     name: userInfo.user.name
            //   })
            // });
            //
            // const data = await response.json();
            //
            // if (response.ok) {
            //   // Store authentication data
            //   await AsyncStorage.setItem('authToken', data.token);
            //   await AsyncStorage.setItem('userId', data.user.id);
            //   await AsyncStorage.setItem('userRole', data.user.role);
            //   await AsyncStorage.setItem('userEmail', data.user.email);
            //   await AsyncStorage.setItem('userName', data.user.name);
            //
            //   onGoogleSignIn?.();
            // } else {
            //   Alert.alert('Google Sign In Failed', data.message || 'Please try again');
            // }

            console.log("Google Sign In pressed");
            onGoogleSignIn?.();
        } catch (error) {
            console.error("Google sign in error:", error);
            Alert.alert("Error", "Google sign in failed. Please try again.");
        }
    };

    const handleAppleSignIn = async () => {
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
            //     email: appleAuthRequestResponse.email,
            //     name: appleAuthRequestResponse.fullName
            //   })
            // });
            //
            // const data = await response.json();
            //
            // if (response.ok) {
            //   // Store authentication data
            //   await AsyncStorage.setItem('authToken', data.token);
            //   await AsyncStorage.setItem('userId', data.user.id);
            //   await AsyncStorage.setItem('userRole', data.user.role);
            //   await AsyncStorage.setItem('userEmail', data.user.email);
            //   await AsyncStorage.setItem('userName', data.user.name);
            //
            //   onAppleSignIn?.();
            // } else {
            //   Alert.alert('Apple Sign In Failed', data.message || 'Please try again');
            // }

            console.log("Apple Sign In pressed");
            onAppleSignIn?.();
        } catch (error) {
            console.error("Apple sign in error:", error);
            Alert.alert("Error", "Apple sign in failed. Please try again.");
        }
    };

    // ============================================================================
    // RENDER COMPONENT
    // ============================================================================
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.scrollContainer}>
                {/* Top App Bar */}
                <View style={styles.appBar}>
                    <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
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
                    <Text style={styles.welcomeTitle}>Welcome Back!</Text>
                    <Text style={styles.welcomeSubtitle}>Sign in to continue to FeeShay</Text>
                </View>

                {/* Sign In Form */}
                <View style={styles.formSection}>
                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Email address"
                            placeholderTextColor={COLORS.placeholder}
                            value={formData.email}
                            onChangeText={(text) => handleInputChange("email", text.toLowerCase())}
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
                            onChangeText={(text) => handleInputChange("password", text)}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Forgot Password Link */}
                    <TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleForgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                {/* Sign In Button */}
                <View style={styles.signInSection}>
                    <TouchableOpacity style={[styles.signInButton, isLoading && styles.signInButtonDisabled]} onPress={handleSignIn} disabled={isLoading}>
                        <Text style={styles.signInButtonText}>{isLoading ? "Signing In..." : "Sign In"}</Text>
                    </TouchableOpacity>
                </View>

                {/* Social Sign In */}
                <View style={styles.socialSection}>
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or continue with</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.socialButtonsContainer}>
                        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn}>
                            <Ionicons name="logo-google" size={20} color="#4285F4" />
                            <Text style={styles.socialButtonText}>Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.socialButton} onPress={handleAppleSignIn}>
                            <Ionicons name="logo-apple" size={20} color="#000000" />
                            <Text style={styles.socialButtonText}>Apple</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footerSection}>
                    <Text style={styles.footerText}>
                        Don&apos;t have an account?{" "}
                        <Text style={styles.signUpLink} onPress={onSignUpPress}>
                            Sign Up
                        </Text>
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

// ============================================================================
// STYLES FOR SIGN IN SCREEN
// ============================================================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 16,
    },

    // App Bar
    appBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 40,
    },

    backButton: {
        padding: 8,
    },

    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    logoFee: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.accent,
    },

    logoShay: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.accentTertiary,
    },

    placeholder: {
        width: 40,
    },

    // Welcome Section
    welcomeSection: {
        alignItems: "center",
        marginTop: 100,
        marginBottom: 40,
    },

    welcomeTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginBottom: 8,
        textAlign: "center",
    },

    welcomeSubtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: "center",
    },

    // Form Section
    formSection: {
        marginBottom: 32,
        gap: 16,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
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

    // Forgot Password
    forgotPasswordContainer: {
        alignItems: "flex-end",
        marginTop: 8,
    },

    forgotPasswordText: {
        fontSize: 14,
        color: COLORS.accentTertiary,
        fontWeight: "500",
    },

    // Sign In Section
    signInSection: {
        marginBottom: 32,
    },

    signInButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    signInButtonDisabled: {
        opacity: 0.6,
    },

    signInButtonText: {
        color: COLORS.background,
        fontSize: 16,
        fontWeight: "600",
    },

    // Social Section
    socialSection: {
        marginBottom: 40,
    },

    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
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
        flexDirection: "row",
        gap: 16,
    },

    socialButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
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
        fontWeight: "500",
        color: COLORS.textPrimary,
    },

    // Footer Section
    footerSection: {
        alignItems: "center",
        marginTop: "auto",
    },

    footerText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: "center",
    },

    signUpLink: {
        color: COLORS.accentTertiary,
        fontWeight: "500",
    },
});
