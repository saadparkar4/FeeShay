import React, { useState, useMemo } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { FreelancerCard, Freelancer } from "../../../components/FreelancerCard";
import { FilterBar, ProposalFilter } from "../../../components/FilterBar";
import { FloatingButton } from "../../../components/FloatingButton";
import { BookmarkModal } from "../../../components/BookmarkModal";

const mockProposals: Array<Freelancer & { status: ProposalFilter }> = [
  { id: "1", name: "Sarah Johnson", skill: "UI/UX Designer", rating: 4.9, status: "Active" },
  { id: "2", name: "Michael Chen", skill: "Full Stack Developer", rating: 4.7, status: "Completed" },
  { id: "3", name: "Emma Rodriguez", skill: "Content Writer", rating: 4.8, status: "Cancelled" },
  { id: "4", name: "David Kim", skill: "Mobile Developer", rating: 4.6, status: "Active" },
  { id: "5", name: "Jessica Parker", skill: "SEO Specialist", rating: 4.5, status: "Completed" },
];

function ProposalsTab() {
  const [filter, setFilter] = useState<ProposalFilter>("Active");
  const [modalVisible, setModalVisible] = useState(false);

  const filteredProposals = useMemo(
    () => mockProposals.filter((f) => f.status === filter),
    [filter]
  );

  function handleAssign(selected: Freelancer[]) {
    if (selected.length === 1) {
      Alert.alert("Assigned", `Assigned ${selected[0].name} to a new project.`);
    } else if (selected.length > 1) {
      Alert.alert("Group Project", `Grouped ${selected.length} freelancers into a collaborative project.`);
    }
  }

  function handleSave(selected: Freelancer[]) {
    Alert.alert("Bookmarked", `Saved ${selected.length} freelancer(s) to bookmarks for later use.`);
  }

  return (
    <View style={styles.container}>
      <FilterBar selected={filter} onSelect={setFilter} />
      <FlatList
        data={filteredProposals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FreelancerCard freelancer={item} />}
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      />
      <FloatingButton onPress={() => setModalVisible(true)} />
      <BookmarkModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAssign={handleAssign}
        onSave={handleSave}
      />
    </View>
  );
}

export default ProposalsTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
});

import React from "react";
import { View, Text } from "react-native";

export default function ProposalsTab() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Proposals Tab</Text>
        </View>
    );
}
