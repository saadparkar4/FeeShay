import React from "react";
import { TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { floatingButtonStyles } from "../../assets/AppStyles";

interface FloatingButtonProps {
	onPress: () => void;
	style?: StyleProp<ViewStyle>;
	accessibilityLabel?: string;
}

export function FloatingButton({ onPress, style, accessibilityLabel }: FloatingButtonProps) {
	return (
		<TouchableOpacity
			style={[floatingButtonStyles.button, style]}
			onPress={onPress}
			activeOpacity={0.8}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel || "Add new project"}>
			<Ionicons name="add" size={28} color="#fff" />
		</TouchableOpacity>
	);
}
