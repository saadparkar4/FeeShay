import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "../../constants/Colors";
import { authApi } from "../../api/auth";
import AuthContext from "../../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import LogoImage from "@/components/Home/Logo";

export default function LoginScreen() {
	// Context
	const { setIsAuthenticated, setUserRole } = useContext(AuthContext);

	// State
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

	// Login Mutation
	const { mutate: login, isPending } = useMutation({
		mutationKey: ["login"],
		mutationFn: () => authApi.login({ email: email.toLowerCase().trim(), password }),
		onSuccess: (response) => {
			// Extract user role from response
			const userRole = response.data?.user?.role || response.user?.role;
			
			// Set authentication status
			setIsAuthenticated(true);
			
			// Set the user's actual role from backend
			if (userRole) {
				setUserRole(userRole as 'freelancer' | 'client' | 'guest');
			}
			
			Alert.alert("Success", "Login successful!", [{ text: "OK", onPress: () => router.replace("/(protected)/(tabs)/(home)/") }]);
		},
		onError: (error: any) => {
			if (error.status === 401) {
				Alert.alert("Error", "Invalid email or password");
			} else {
				Alert.alert("Error", error.message || "Login failed. Please try again.");
			}
		},
	});

	// Validation
	const validateForm = () => {
		const newErrors: { email?: string; password?: string } = {};

		if (!email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = "Invalid email address";
		}

		if (!password.trim()) {
			newErrors.password = "Password is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handlers
	const handleLogin = () => {
		if (validateForm()) {
			login();
		}
	};

	const handleSocialLogin = (provider: string) => {
		Alert.alert("Coming Soon", `${provider} login will be available soon`);
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
				<ScrollView contentContainerStyle={styles.scrollContainer}>
					{/* Back Button */}
					<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
						<Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
					</TouchableOpacity>

					{/* Logo */}
					<View style={styles.logoSection}>
						<LogoImage />

						<Text style={styles.tagline}>Find. Hire. Thrive.</Text>
					</View>

					{/* Welcome Text */}
					<View style={styles.headerSection}>
						<Text style={styles.title}>Welcome Back!</Text>
						<Text style={styles.subtitle}>Sign in to continue</Text>
					</View>

					{/* Form */}
					<View style={styles.form}>
						{/* Email Input */}
						<View style={styles.inputContainer}>
							<View style={[styles.inputWrapper, errors.email && styles.inputError]}>
								<Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />
								<TextInput
									style={styles.input}
									placeholder="Email address"
									placeholderTextColor={COLORS.textSecondary}
									value={email}
									onChangeText={(text) => {
										setEmail(text);
										if (errors.email) setErrors({ ...errors, email: undefined });
									}}
									keyboardType="email-address"
									autoCapitalize="none"
									editable={!isPending}
								/>
							</View>
							{errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
						</View>

						{/* Password Input */}
						<View style={styles.inputContainer}>
							<View style={[styles.inputWrapper, errors.password && styles.inputError]}>
								<Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />
								<TextInput
									style={styles.input}
									placeholder="Password"
									placeholderTextColor={COLORS.textSecondary}
									value={password}
									onChangeText={(text) => {
										setPassword(text);
										if (errors.password) setErrors({ ...errors, password: undefined });
									}}
									secureTextEntry={!showPassword}
									editable={!isPending}
								/>
								<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
									<Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.textSecondary} />
								</TouchableOpacity>
							</View>
							{errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
						</View>

						{/* Forgot Password */}
						<TouchableOpacity style={styles.forgotPassword}>
							<Text style={styles.forgotPasswordText}>Forgot Password?</Text>
						</TouchableOpacity>

						{/* Login Button */}
						<TouchableOpacity style={[styles.button, isPending && styles.buttonDisabled]} onPress={handleLogin} disabled={isPending}>
							<Text style={styles.buttonText}>{isPending ? "Signing In..." : "Sign In"}</Text>
						</TouchableOpacity>

						{/* Divider */}
						<View style={styles.divider}>
							<View style={styles.dividerLine} />
							<Text style={styles.dividerText}>or continue with</Text>
							<View style={styles.dividerLine} />
						</View>

						{/* Social Buttons */}
						<View style={styles.socialButtons}>
							<TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin("Google")} disabled={isPending}>
								<Ionicons name="logo-google" size={20} color="#4285F4" />
								<Text style={styles.socialButtonText}>Google</Text>
							</TouchableOpacity>

							<TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin("Apple")} disabled={isPending}>
								<Ionicons name="logo-apple" size={20} color="#000000" />
								<Text style={styles.socialButtonText}>Apple</Text>
							</TouchableOpacity>
						</View>
					</View>

					{/* Footer */}
					<View style={styles.footer}>
						<Text style={styles.footerText}>Don't have an account? </Text>
						<TouchableOpacity onPress={() => router.push("/(auth)/Register")}>
							<Text style={styles.linkText}>Sign Up</Text>
						</TouchableOpacity>
					</View>
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
	keyboardView: {
		flex: 1,
	},
	scrollContainer: {
		flexGrow: 1,
		paddingHorizontal: 24,
	},
	backButton: {
		marginTop: 20,
		marginBottom: 20,
	},
	logoSection: {
		alignItems: "center",
		marginBottom: 40,
	},
	logoContainer: {
		flexDirection: "row",
	},
	logoFee: {
		fontSize: 32,
		fontWeight: "bold",
		color: COLORS.accent,
	},
	logoShay: {
		fontSize: 32,
		fontWeight: "bold",
		color: COLORS.accentTertiary,
	},
	tagline: {
		fontSize: 14,
		color: COLORS.textSecondary,
		marginTop: 8,
	},
	headerSection: {
		marginBottom: 32,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: COLORS.textPrimary,
		textAlign: "center",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: COLORS.textSecondary,
		textAlign: "center",
	},
	form: {
		flex: 1,
	},
	inputContainer: {
		marginBottom: 16,
	},
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F5F5F5",
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderWidth: 1,
		borderColor: "transparent",
	},
	inputError: {
		borderColor: COLORS.error,
	},
	input: {
		flex: 1,
		fontSize: 16,
		color: COLORS.textPrimary,
		marginLeft: 12,
	},
	errorText: {
		fontSize: 12,
		color: COLORS.error,
		marginTop: 4,
		marginLeft: 4,
	},
	forgotPassword: {
		alignSelf: "flex-end",
		marginBottom: 24,
	},
	forgotPasswordText: {
		fontSize: 14,
		color: COLORS.accent,
		fontWeight: "500",
	},
	button: {
		backgroundColor: COLORS.primary,
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: "center",
		marginBottom: 24,
	},
	buttonDisabled: {
		opacity: 0.6,
	},
	buttonText: {
		color: COLORS.background,
		fontSize: 16,
		fontWeight: "600",
	},
	divider: {
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
	socialButtons: {
		flexDirection: "row",
		gap: 16,
		marginBottom: 32,
	},
	socialButton: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: COLORS.background,
		borderWidth: 1,
		borderColor: COLORS.border,
		borderRadius: 12,
		paddingVertical: 12,
		gap: 8,
	},
	socialButtonText: {
		fontSize: 16,
		fontWeight: "500",
		color: COLORS.textPrimary,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "center",
		paddingBottom: 24,
	},
	footerText: {
		fontSize: 16,
		color: COLORS.textSecondary,
	},
	linkText: {
		fontSize: 16,
		color: COLORS.accent,
		fontWeight: "bold",
	},
});
