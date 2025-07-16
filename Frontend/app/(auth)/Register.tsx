import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "../../constants/Colors";
import { authApi } from "../../api/auth";
import AuthContext from "../../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import LogoImage from "@/components/Home/Logo";

type UserRole = "freelancer" | "client" | "both";

export default function RegisterScreen() {
	// Context
	const { setIsAuthenticated, setUserRole } = useContext(AuthContext);

	// State
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [role, setRole] = useState<UserRole | "">("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Register Mutation
	const { mutate: register, isPending } = useMutation({
		mutationKey: ["register"],
		mutationFn: () =>
			authApi.register({
				name: fullName.trim(),
				email: email.toLowerCase().trim(),
				password,
				role: role as UserRole,
			}),
		onSuccess: (response) => {
			// Extract user role from response
			const userRole = response.data?.user?.role || response.user?.role;
			
			// Set authentication status
			setIsAuthenticated(true);
			
			// Set the user's actual role from backend
			if (userRole) {
				setUserRole(userRole as 'freelancer' | 'client' | 'guest');
			}
			
			Alert.alert("Success", "Account created successfully!", [{ text: "OK", onPress: () => router.replace("/(protected)/(tabs)/(home)/") }]);
		},
		onError: (error: any) => {
			if (error.status === 409) {
				Alert.alert("Error", "An account with this email already exists");
			} else {
				Alert.alert("Error", error.message || "Registration failed. Please try again.");
			}
		},
	});

	// Validation
	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!fullName.trim()) {
			newErrors.fullName = "Full name is required";
		}

		if (!email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = "Invalid email address";
		}

		if (!password) {
			newErrors.password = "Password is required";
		} else if (password.length < 8) {
			newErrors.password = "Password must be at least 8 characters";
		}

		if (!confirmPassword) {
			newErrors.confirmPassword = "Please confirm your password";
		} else if (password !== confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		if (!role) {
			newErrors.role = "Please select your role";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handlers
	const handleRegister = () => {
		if (validateForm()) {
			register();
		}
	};

	const handleSocialRegister = (provider: string) => {
		Alert.alert("Coming Soon", `${provider} registration will be available soon`);
	};

	const clearError = (field: string) => {
		if (errors[field]) {
			//       setErrors({...errors, [field]: undefined});

			setErrors({ ...errors, [field]: "" });
		}
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

					{/* Header */}
					<View style={styles.headerSection}>
						<Text style={styles.title}>Create Account</Text>
						<Text style={styles.subtitle}>Join FeeShay today</Text>
					</View>

					{/* Form */}
					<View style={styles.form}>
						{/* Full Name Input */}
						<View style={styles.inputContainer}>
							<View style={[styles.inputWrapper, errors.fullName && styles.inputError]}>
								<Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />
								<TextInput
									style={styles.input}
									placeholder="Full name"
									placeholderTextColor={COLORS.textSecondary}
									value={fullName}
									onChangeText={(text) => {
										setFullName(text);
										clearError("fullName");
									}}
									editable={!isPending}
								/>
							</View>
							{errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
						</View>

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
										clearError("email");
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
										clearError("password");
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

						{/* Confirm Password Input */}
						<View style={styles.inputContainer}>
							<View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
								<Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />
								<TextInput
									style={styles.input}
									placeholder="Confirm password"
									placeholderTextColor={COLORS.textSecondary}
									value={confirmPassword}
									onChangeText={(text) => {
										setConfirmPassword(text);
										clearError("confirmPassword");
									}}
									secureTextEntry={!showConfirmPassword}
									editable={!isPending}
								/>
								<TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
									<Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.textSecondary} />
								</TouchableOpacity>
							</View>
							{errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
						</View>

						{/* Role Selection */}
						<View style={styles.roleSection}>
							<Text style={styles.roleLabel}>I want to:</Text>
							<View style={styles.roleButtons}>
								<TouchableOpacity
									style={[styles.roleButton, role === "freelancer" && styles.roleButtonActive]}
									onPress={() => {
										setRole("freelancer");
										clearError("role");
									}}
									disabled={isPending}>
									<Ionicons name="briefcase-outline" size={20} color={role === "freelancer" ? COLORS.background : COLORS.textSecondary} />
									<Text style={[styles.roleButtonText, role === "freelancer" && styles.roleButtonTextActive]}>Work</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[styles.roleButton, role === "client" && styles.roleButtonActive]}
									onPress={() => {
										setRole("client");
										clearError("role");
									}}
									disabled={isPending}>
									<Ionicons name="people-outline" size={20} color={role === "client" ? COLORS.background : COLORS.textSecondary} />
									<Text style={[styles.roleButtonText, role === "client" && styles.roleButtonTextActive]}>Hire</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[styles.roleButton, role === "both" && styles.roleButtonActive]}
									onPress={() => {
										setRole("both");
										clearError("role");
									}}
									disabled={isPending}>
									<Ionicons name="git-merge-outline" size={20} color={role === "both" ? COLORS.background : COLORS.textSecondary} />
									<Text style={[styles.roleButtonText, role === "both" && styles.roleButtonTextActive]}>Both</Text>
								</TouchableOpacity>
							</View>
							{errors.role && <Text style={styles.errorText}>{errors.role}</Text>}
						</View>

						{/* Register Button */}
						<TouchableOpacity style={[styles.button, isPending && styles.buttonDisabled]} onPress={handleRegister} disabled={isPending}>
							<Text style={styles.buttonText}>{isPending ? "Creating Account..." : "Sign Up"}</Text>
						</TouchableOpacity>

						{/* Divider */}
						<View style={styles.divider}>
							<View style={styles.dividerLine} />
							<Text style={styles.dividerText}>or continue with</Text>
							<View style={styles.dividerLine} />
						</View>

						{/* Social Buttons */}
						<View style={styles.socialButtons}>
							<TouchableOpacity style={styles.socialButton} onPress={() => handleSocialRegister("Google")} disabled={isPending}>
								<Ionicons name="logo-google" size={20} color="#4285F4" />
								<Text style={styles.socialButtonText}>Google</Text>
							</TouchableOpacity>

							<TouchableOpacity style={styles.socialButton} onPress={() => handleSocialRegister("Apple")} disabled={isPending}>
								<Ionicons name="logo-apple" size={20} color="#000000" />
								<Text style={styles.socialButtonText}>Apple</Text>
							</TouchableOpacity>
						</View>
					</View>

					{/* Footer */}
					<View style={styles.footer}>
						<Text style={styles.footerText}>Already have an account? </Text>
						<TouchableOpacity onPress={() => router.push("/(auth)/Login")}>
							<Text style={styles.linkText}>Sign In</Text>
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
		marginBottom: 32,
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
		marginBottom: 24,
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
	roleSection: {
		marginBottom: 24,
	},
	roleLabel: {
		fontSize: 16,
		fontWeight: "500",
		color: COLORS.textPrimary,
		marginBottom: 12,
	},
	roleButtons: {
		flexDirection: "row",
		gap: 12,
	},
	roleButton: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: COLORS.border,
		backgroundColor: COLORS.background,
		gap: 8,
	},
	roleButtonActive: {
		backgroundColor: COLORS.primary,
		borderColor: COLORS.primary,
	},
	roleButtonText: {
		fontSize: 14,
		fontWeight: "500",
		color: COLORS.textSecondary,
	},
	roleButtonTextActive: {
		color: COLORS.background,
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
