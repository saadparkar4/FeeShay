import { UserRole } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
const storeToken = async (token: string) => {
	if (Platform.OS === "web") {
		await AsyncStorage.setItem("token", token);
	} else {
		await SecureStore.setItemAsync("token", token);
	}
};
const getToken = async () => {
	if (Platform.OS === "web") {
		return await AsyncStorage.getItem("token");
	} else {
		return await SecureStore.getItemAsync("token");
	}
};
const deleteToken = async () => {
	if (Platform.OS === "web") {
		await AsyncStorage.removeItem("token");
	} else {
		await SecureStore.deleteItemAsync("token");
	}
};

const storeUserRole = async (role: UserRole) => {
	if (Platform.OS === "web") {
		await AsyncStorage.setItem("userRole", role);
	} else {
		await SecureStore.setItemAsync("userRole", role);
	}
};

const getUserRole = async (): Promise<UserRole | null> => {
	if (Platform.OS === "web") {
		const role = await AsyncStorage.getItem("userRole");
		return role as UserRole | null;
	} else {
		const role = await SecureStore.getItemAsync("userRole");
		return role as UserRole | null;
	}
};

const deleteUserRole = async () => {
	if (Platform.OS === "web") {
		await AsyncStorage.removeItem("userRole");
	} else {
		await SecureStore.deleteItemAsync("userRole");
	}
};

export { deleteToken, getToken, storeToken, storeUserRole, getUserRole, deleteUserRole };
