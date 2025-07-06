import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { freelancerCardStyles } from "../assets/AppStyles";

export interface Freelancer {
  id: string;
  name: string;
  skill: string;
  rating: number;
}

interface FreelancerCardProps {
  freelancer: Freelancer;
}

export function FreelancerCard({ freelancer }: FreelancerCardProps) {
  return (
    <View style={freelancerCardStyles.card}>
      <View style={freelancerCardStyles.row}>
        <Text style={freelancerCardStyles.name}>{freelancer.name}</Text>
        <View style={freelancerCardStyles.ratingRow}>
          <Ionicons name="star" size={16} color="#FFB800" />
          <Text style={freelancerCardStyles.rating}>{freelancer.rating.toFixed(1)}</Text>
        </View>
      </View>
      <Text style={freelancerCardStyles.skill}>{freelancer.skill}</Text>
    </View>
  );
} 