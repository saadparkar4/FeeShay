import { Stack } from "expo-router";
import { StatusBar, TouchableOpacity } from "react-native";
import { COLORS } from "../../../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function HomeLayout() {
	return (
		<>
			<StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen 
					name="index" 
					options={{ 
						title: "Home",
						headerShown: false 
					}} 
				/>
				<Stack.Screen 
					name="notifications" 
					options={{ 
						title: "Notifications",
						
						headerShown: false,
					
					}} 
				/>
				<Stack.Screen 
					name="job/[id]" 
					options={{ 
						title: "Job Details",
						headerShown: false 
					}} 
				/>
				<Stack.Screen 
					name="job/send-proposal" 
					options={{ 
						title: "Send Proposal",
						headerShown: false 
					}} 
				/>
			</Stack>
		</>
	);
}
