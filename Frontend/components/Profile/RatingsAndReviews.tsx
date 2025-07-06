import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Model for a single review
interface Review {
	name: string; // Reviewer's name
	date: string; // Date of review
	rating: number; // Star rating
	comment: string; // Review comment
}
//
// Dummy data for reviews
const dummyReviews: Review[] = [
	{
		name: "Sarah Johnson",
		date: "2 weeks ago",
		rating: 5,
		comment: "Great client to work with! Clear instructions and prompt payment. Would definitely work with again.",
	},
	{
		name: "Michael Chen",
		date: "1 month ago",
		rating: 4,
		comment: "Alex was very professional and provided detailed feedback throughout the project. Communication was excellent.",
	},
];

// Reusable component for a single review item
const ReviewItem: React.FC<{ review: Review }> = ({ review }) => (
	<View style={styles.reviewItem}>
		<Text style={styles.reviewName}>{review.name}</Text>
		<Text style={styles.reviewDate}>{review.date}</Text>
		<Text style={styles.reviewComment}>{review.comment}</Text>
	</View>
);

const RatingsAndReviews: React.FC = () => {
	// State for reviews
	const [reviews, setReviews] = useState<Review[]>(dummyReviews);

	// --- Uncomment below to fetch from a Mongoose/MongoDB backend ---
	/*
	useEffect(() => {
		fetch("http://localhost:5000/api/reviews")
			.then((res) => res.json())
			.then((data) => setReviews(data))
			.catch((err) => console.error("Failed to fetch reviews:", err));
	}, []);
	*/

	// Calculate average rating
	const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "-";

	return (
		<View style={styles.container}>
			{/* Ratings & Reviews header */}
			<Text style={styles.header}>Ratings & Reviews</Text>
			<View style={styles.ratingRow}>
				<Text style={styles.averageRating}>{averageRating}</Text>
				<Ionicons name="star" color="gold" size={20} />
				<Text style={styles.reviewCount}>
					Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
				</Text>
			</View>
			{/* Render each review dynamically */}
			{reviews.map((review, i) => (
				<ReviewItem key={i} review={review} />
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 24,
	},
	header: {
		fontWeight: "bold",
		fontSize: 16,
		marginBottom: 8,
	},
	ratingRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	averageRating: {
		fontSize: 20,
		fontWeight: "bold",
	},
	reviewCount: {
		marginLeft: 6,
		color: "gray",
	},
	reviewItem: {
		marginBottom: 12,
	},
	reviewName: {
		fontWeight: "600",
	},
	reviewDate: {
		color: "gray",
		marginBottom: 4,
	},
	reviewComment: {
		fontSize: 14,
		lineHeight: 20,
	},
});

export default RatingsAndReviews;
