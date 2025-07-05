import { Link, Redirect } from "expo-router";
import { Text, View } from "react-native";
import ProfileScreen from "./screens/ProfileScreen";

export default function Index() {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}>
			<Redirect href={"/screens/ProfileScreen"} />
		</View>
	);
}
