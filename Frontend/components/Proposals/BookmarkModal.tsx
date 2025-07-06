import React, { useState } from "react";
import { Modal, View, Text, FlatList, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Freelancer } from "../FreelancerCard";
import { bookmarkModalStyles } from "../../assets/AppStyles";

const bookmarkedFreelancers: Freelancer[] = [
	{ id: "1", name: "Sarah Johnson", skill: "UI/UX Designer", rating: 4.9 },
	{ id: "2", name: "Michael Chen", skill: "Full Stack Developer", rating: 4.7 },
	{ id: "3", name: "Emma Rodriguez", skill: "Content Writer", rating: 4.8 },
	{ id: "4", name: "David Kim", skill: "Mobile Developer", rating: 4.6 },
];

interface BookmarkModalProps {
	visible: boolean;
	onClose: () => void;
	onAssign: (selected: Freelancer[]) => void;
	onSave: (selected: Freelancer[]) => void;
}

export function BookmarkModal({ visible, onClose, onAssign, onSave }: BookmarkModalProps) {
	const [selectedIds, setSelectedIds] = useState<string[]>([]);

	function toggleSelect(id: string) {
		setSelectedIds((prev) => (prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]));
	}

	function handleAssign() {
		const selected = bookmarkedFreelancers.filter((f) => selectedIds.includes(f.id));
		onAssign(selected);
		setSelectedIds([]);
		onClose();
	}

	function handleSave() {
		const selected = bookmarkedFreelancers.filter((f) => selectedIds.includes(f.id));
		onSave(selected);
		setSelectedIds([]);
		onClose();
	}

	return (
		<Modal visible={visible} animationType="slide" transparent onRequestClose={onClose} accessible accessibilityViewIsModal>
			<View style={bookmarkModalStyles.overlay}>
				<View style={bookmarkModalStyles.modal}>
					<View style={bookmarkModalStyles.header}>
						<Text style={bookmarkModalStyles.title}>Bookmarked Freelancers</Text>
						<Pressable onPress={onClose} accessibilityLabel="Close modal">
							<Ionicons name="close" size={24} color="#222" />
						</Pressable>
					</View>
					<FlatList
						data={bookmarkedFreelancers}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => {
							const checked = selectedIds.includes(item.id);
							return (
								<TouchableOpacity
									style={bookmarkModalStyles.row}
									onPress={() => toggleSelect(item.id)}
									accessibilityRole="checkbox"
									accessibilityState={{ checked }}>
									<Ionicons name={checked ? "checkbox" : "square-outline"} size={22} color={checked ? "#FF2D8B" : "#AAA"} />
									<View style={bookmarkModalStyles.info}>
										<Text style={bookmarkModalStyles.name}>{item.name}</Text>
										<Text style={bookmarkModalStyles.skill}>{item.skill}</Text>
									</View>
								</TouchableOpacity>
							);
						}}
						contentContainerStyle={{ paddingBottom: 16 }}
					/>
					<View style={bookmarkModalStyles.actions}>
						<TouchableOpacity
							style={[bookmarkModalStyles.actionBtn, selectedIds.length === 0 && bookmarkModalStyles.disabledBtn]}
							onPress={handleAssign}
							disabled={selectedIds.length === 0}
							accessibilityLabel="Assign to project">
							<Text style={bookmarkModalStyles.actionText}>Assign to Project</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[bookmarkModalStyles.actionBtn, bookmarkModalStyles.saveBtn, selectedIds.length === 0 && bookmarkModalStyles.disabledBtn]}
							onPress={handleSave}
							disabled={selectedIds.length === 0}
							accessibilityLabel="Save to Bookmarks">
							<Text style={bookmarkModalStyles.actionText}>Save for Later</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
