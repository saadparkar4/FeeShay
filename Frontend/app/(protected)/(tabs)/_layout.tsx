import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#FF2D8B",
				headerStyle: { backgroundColor: "#fff" },
				headerShadowVisible: false,
				headerTintColor: "#222",
				tabBarStyle: { backgroundColor: "#fff" },
				headerShown: false,
			}}>
			<Tabs.Screen
				name="(home)"
				options={{
					title: "Home",
					tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home" : "home-outline"} color={color} size={24} />,
				}}
			/>
			<Tabs.Screen
				name="(proposals)"
				options={{
					title: "Proposals",

					tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "document" : "document-outline"} color={color} size={24} />,
				}}
			/>
			<Tabs.Screen
				name="(messages)"
				options={{
					title: "Messages",
					tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "chatbubble" : "chatbubble-outline"} color={color} size={24} />,
				}}
			/>
			<Tabs.Screen
				name="(profile)"
				options={{
					title: "Profile",
					
					tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "person" : "person-outline"} color={color} size={24} />,
				}}
			/>
		</Tabs>
	);
}
//
