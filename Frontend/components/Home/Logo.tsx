import React from "react";
import { StyleSheet, Image } from "react-native";

export default function LogoImage() {
	return <Image source={require("../../assets/images/FeeShay_Logo.png")} style={styles.logo} />;
}
const styles = StyleSheet.create({
	logo: {
		marginTop: 10,
		width: 100,
		height: 50,
		// borderRadius: 24,
		// borderWidth: 4,
		objectFit: "contain",
		//  mixBlendMode: 'screen',
	},
});
