import React from "react";
import { View, Text, Image, StyleSheet, ImageSourcePropType } from "react-native";
import type { Message } from "../../models/dummyData";

interface MessageListItemProps {
	message: Message;
}

// this function will allow us to get the initials of the user's name
function getInitials(name: string): string {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase();
}

export function MessageListItem({ message }: MessageListItemProps) {
	return (
		<View style={styles.container}>
			<View style={styles.avatarContainer}>
				{message.user.avatar ? (
					<Image source={message.user.avatar as ImageSourcePropType} style={styles.avatar} />
				) : (
					<View style={[styles.avatar, styles.placeholderAvatar]}>
						<Text style={styles.initials}>{getInitials(message.user.name)}</Text>
					</View>
				)}
				<View style={[styles.statusDot, { backgroundColor: message.user.isOnline ? "#00E676" : "#D3D3D3" }]} />
			</View>
			<View style={styles.textContainer}>
				<View style={styles.headerRow}>
					<Text style={styles.name}>{message.user.name}</Text>
					<Text style={styles.time}>{message.time}</Text>
				</View>
				<View style={styles.messageRow}>
					<Text style={[styles.message, message.isUnread && styles.unreadMessage]} numberOfLines={1}>
						{message.message}
					</Text>
					{message.isUnread && <View style={styles.unreadDot} />}
				</View>
			</View>
		</View>
	);
}

const AVATAR_SIZE = 56;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 16,
		paddingHorizontal: 20,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#F2F2F2",
	},
	avatarContainer: {
		marginRight: 16,
		position: "relative",
	},
	avatar: {
		width: AVATAR_SIZE,
		height: AVATAR_SIZE,
		borderRadius: AVATAR_SIZE / 2,
		justifyContent: "center",
		alignItems: "center",
	},
	placeholderAvatar: {
		backgroundColor: "#E0E0E0",
	},
	initials: {
		color: "#757B8A",
		fontWeight: "bold",
		fontSize: 22,
	},
	statusDot: {
		position: "absolute",
		bottom: 4,
		right: 4,
		width: 14,
		height: 14,
		borderRadius: 7,
		borderWidth: 2,
		borderColor: "#fff",
	},
	textContainer: {
		flex: 1,
		justifyContent: "center",
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 2,
	},
	name: {
		fontWeight: "bold",
		fontSize: 20,
		color: "#222",
	},
	time: {
		fontSize: 15,
		color: "#757B8A",
		fontWeight: "500",
	},
	messageRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	message: {
		fontSize: 17,
		color: "#757B8A",
		flex: 1,
	},
	unreadMessage: {
		color: "#FF2D8B",
		fontWeight: "500",
	},
	unreadDot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: "#FF2D8B",
		marginLeft: 8,
	},
});
//
