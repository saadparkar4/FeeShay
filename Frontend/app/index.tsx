import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Redirect } from "expo-router";

const index = () => {
    return (
        <View>
            <Redirect href="/(tabs)/home" />
        </View>
    );
};

export default index;

const styles = StyleSheet.create({});

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
			//<Redirect href={"/screens/ProfileScreen"} />
      <Redirect href="/(tabs)/home" />
		</View>
	);
}

