import { Stack } from "expo-router";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../../../constants/Colors";

export default function HomeLayout() {
	return (
		<SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
			<Stack screenOptions={{ headerShown: false }} />
			<StatusBar barStyle={"default"} backgroundColor={COLORS.background} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
});	
