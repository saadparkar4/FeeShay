import { Link, Redirect } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}>
			{/* <Redirect href={"/screens/ProfileScreen"} /> */}
			<Redirect href="/(tabs)/home" />
		</View>
	);
}
//
