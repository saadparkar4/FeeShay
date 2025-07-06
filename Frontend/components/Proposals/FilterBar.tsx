import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { filterBarStyles } from "../../assets/AppStyles";

export type ProposalFilter = "Active" | "Completed" | "Cancelled";

interface FilterBarProps {
	selected: ProposalFilter;
	onSelect: (filter: ProposalFilter) => void;
}

const FILTERS: ProposalFilter[] = ["Active", "Completed", "Cancelled"];

export function FilterBar({ selected, onSelect }: FilterBarProps) {
	return (
		<View style={filterBarStyles.container}>
			{FILTERS.map((filter) => (
				<TouchableOpacity
					key={filter}
					style={[filterBarStyles.button, selected === filter && filterBarStyles.selectedButton]}
					onPress={() => onSelect(filter)}
					accessibilityRole="button"
					accessibilityState={{ selected: selected === filter }}>
					<Text style={[filterBarStyles.text, selected === filter && filterBarStyles.selectedText]}>{filter}</Text>
				</TouchableOpacity>
			))}
		</View>
	);
}
