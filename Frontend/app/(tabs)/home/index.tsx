/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { View, Text } from "react-native";
import OnboardingScreen from "../../../components/Home/OnboardingScreen";
import WelcomeScreen from "../../../components/Home/WelcomeScreen";
import SignUpScreen from "../../../components/Home/SignUpScreen";
import SignInScreen from "../../../components/Home/SignInScreen";
import HomeScreen from "../../(tabs)/home/Home";

// Define the possible screens
type Screen = "onboarding" | "welcome" | "signup" | "signin" | "home";

// Define the sign-up form data interface
interface SignUpFormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "freelancer" | "client" | "both";
}

// Define the sign-in form data interface
interface SignInFormData {
    email: string;
    password: string;
}

export default function index() {
    const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // ============================================================================
    // ONBOARDING SCREEN HANDLERS
    // ============================================================================
    const handleOnboardingComplete = () => {
        console.log("Onboarding completed - navigating to welcome screen");
        setCurrentScreen("welcome");
    };

    const handleOnboardingSkip = () => {
        console.log("Onboarding skipped - navigating to welcome screen");
        setCurrentScreen("welcome");
    };

    // ============================================================================
    // WELCOME SCREEN HANDLERS
    // ============================================================================
    const handleSignIn = () => {
        console.log("Sign In pressed - navigating to sign in screen");
        setCurrentScreen("signin");
    };

    const handleSignUp = () => {
        console.log("Sign Up pressed - navigating to sign up screen");
        setCurrentScreen("signup");
    };

    const handleGoogleLogin = () => {
        // TODO: Implement Google OAuth
        console.log("Google login pressed");
        setIsAuthenticated(true);
    };

    const handleAppleLogin = () => {
        // TODO: Implement Apple Sign In
        console.log("Apple login pressed");
        setIsAuthenticated(true);
    };

    // ============================================================================
    // SIGN UP SCREEN HANDLERS
    // ============================================================================
    const handleSignUpComplete = (formData: SignUpFormData) => {
        // TODO: This is where you'll handle the actual sign up with your backend
        console.log("Sign up completed with data:", formData);
        setIsAuthenticated(true);
        setCurrentScreen("home");
    };

    const handleSignUpGoogleSignUp = () => {
        // TODO: Implement Google OAuth for sign up
        console.log("Google sign up pressed");
        setIsAuthenticated(true);
        setCurrentScreen("home");
    };

    const handleSignUpAppleSignUp = () => {
        // TODO: Implement Apple Sign In for sign up
        console.log("Apple sign up pressed");
        setIsAuthenticated(true);
        setCurrentScreen("home");
    };

    const handleSignInPressFromSignUp = () => {
        console.log("Navigate to sign in from sign up");
        setCurrentScreen("signin");
    };

    const handleGoBackFromSignUp = () => {
        console.log("Go back to welcome screen from sign up");
        setCurrentScreen("welcome");
    };

    // ============================================================================
    // SIGN IN SCREEN HANDLERS
    // ============================================================================
    const handleSignInComplete = (formData: SignInFormData) => {
        // TODO: This is where you'll handle the actual sign in with your backend
        console.log("Sign in completed with data:", formData);
        setIsAuthenticated(true);
        setCurrentScreen("home");
    };

    const handleSignInGoogleSignIn = () => {
        // TODO: Implement Google OAuth for sign in
        console.log("Google sign in pressed");
        setIsAuthenticated(true);
        setCurrentScreen("home");
    };

    const handleSignInAppleSignIn = () => {
        // TODO: Implement Apple Sign In for sign in
        console.log("Apple sign in pressed");
        setIsAuthenticated(true);
        setCurrentScreen("home");
    };

    const handleForgotPassword = (email: string) => {
        // TODO: Handle forgot password functionality
        console.log("Forgot password for email:", email);
        // You might want to navigate to a password reset screen
    };

    const handleSignUpPressFromSignIn = () => {
        console.log("Navigate to sign up from sign in");
        setCurrentScreen("signup");
    };

    const handleGoBackFromSignIn = () => {
        console.log("Go back to welcome screen from sign in");
        setCurrentScreen("welcome");
    };

    // ============================================================================
    // SCREEN RENDERING LOGIC
    // ============================================================================

    // Show home screen if authenticated
    if (isAuthenticated) {
        return <HomeScreen />;
    }

    // Show appropriate screen based on current screen state
    switch (currentScreen) {
        case "onboarding":
            return <OnboardingScreen onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />;

        case "welcome":
            return <WelcomeScreen onSignIn={handleSignIn} onSignUp={handleSignUp} onGoogleLogin={handleGoogleLogin} onAppleLogin={handleAppleLogin} />;

        case "signup":
            return (
                <SignUpScreen
                    onSignUp={handleSignUpComplete}
                    onGoogleSignUp={handleSignUpGoogleSignUp}
                    onAppleSignUp={handleSignUpAppleSignUp}
                    onSignInPress={handleSignInPressFromSignUp}
                    onGoBack={handleGoBackFromSignUp}
                />
            );

        case "signin":
            return (
                <SignInScreen
                    onSignIn={handleSignInComplete}
                    onGoogleSignIn={handleSignInGoogleSignIn}
                    onAppleSignIn={handleSignInAppleSignIn}
                    onForgotPassword={handleForgotPassword}
                    onSignUpPress={handleSignUpPressFromSignIn}
                    onGoBack={handleGoBackFromSignIn}
                />
            );

        default:
            return <OnboardingScreen onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />;
    }
}
