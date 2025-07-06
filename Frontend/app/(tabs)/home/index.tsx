// import React from "react";
// import { View, FlatList, StyleSheet } from "react-native";
// import { FreelancerCard, Freelancer } from "../../../components/FreelancerCard";

// const mockFreelancers: Freelancer[] = [
//   { id: "1", name: "Sarah Johnson", skill: "UI/UX Designer", rating: 4.9 },
//   { id: "2", name: "Michael Chen", skill: "Full Stack Developer", rating: 4.7 },
//   { id: "3", name: "Emma Rodriguez", skill: "Content Writer", rating: 4.8 },
//   { id: "4", name: "David Kim", skill: "Mobile Developer", rating: 4.6 },
//   { id: "5", name: "Jessica Parker", skill: "SEO Specialist", rating: 4.5 },
// ];

// function HomeTab() {
//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={mockFreelancers}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => <FreelancerCard freelancer={item} />}
//         contentContainerStyle={{ paddingVertical: 16 }}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// }

// export default HomeTab;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 16,
//   },
// });

import { Text, View } from "react-native";

const Index = () => {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text>Home Tab</Text>
		</View>
	);
};

export default Index;

// const styles = StyleSheet.create({});
