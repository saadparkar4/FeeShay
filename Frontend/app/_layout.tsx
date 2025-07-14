import AuthContext, { UserRole } from "@/context/AuthContext";
import { deleteToken, getToken, getUserRole, storeUserRole, deleteUserRole } from "@/api/storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import socketService from "@/services/socketService";

export default function RootLayout() {
	const queryClient = new QueryClient();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState<UserRole>("guest"); // Default to guest
	const [ready, setReady] = useState(false);

	const checkToken = async () => {
		const token = await getToken();
		if (token) {
			setIsAuthenticated(true);
			// Load saved user role
			const savedRole = await getUserRole();
			if (savedRole && savedRole !== "guest") {
				setUserRole(savedRole);
			}
		} else {
			// No token means guest user
			setUserRole("guest");
		}
		setReady(true);
	};

	// Save user role whenever it changes
	const handleSetUserRole = (role: UserRole) => {
		setUserRole(role);
		storeUserRole(role);
	};

	const handleLogout = async () => {
		await deleteToken();
		await deleteUserRole();
		setIsAuthenticated(false);
		setUserRole("guest"); // Reset to guest
	};

	useEffect(() => {
		checkToken();
	}, []);

	// Connect/disconnect socket based on auth status
	useEffect(() => {
		if (isAuthenticated) {
			socketService.connect();
		} else {
			socketService.disconnect();
		}

		return () => {
			socketService.disconnect();
		};
	}, [isAuthenticated]);

	if (!ready) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: "white",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<ActivityIndicator size={"large"} />
			</View>
		);
	}

	return (
		<SafeAreaProvider>
			<QueryClientProvider client={queryClient}>
				<AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userRole, setUserRole: handleSetUserRole }}>
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name="(auth)" />
						<Stack.Screen name="(protected)" />
					</Stack>
				</AuthContext.Provider>
			</QueryClientProvider>
			<StatusBar barStyle={"default"} />
		</SafeAreaProvider>
	);
}
