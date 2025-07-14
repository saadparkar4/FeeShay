import { Tabs } from "expo-router";
import CustomTabBar from "@/components/Navigation/CustomTabBar";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
			}}
			tabBar={(props) => <CustomTabBar {...props} />}
		>
			<Tabs.Screen
				name="(home)"
				options={{
					title: "Home",
				}}
			/>
			<Tabs.Screen
				name="(proposals)"
				options={{
					title: "Proposals",
				}}
			/>
			<Tabs.Screen
				name="(messages)"
				options={{
					title: "Messages",
				}}
			/>
			<Tabs.Screen
				name="(profile)"
				options={{
					title: "Profile",
				}}
			/>
		</Tabs>
	);
}
//
