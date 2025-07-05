import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

// Model for a job post
interface JobPost {
	title: string; // Job title
	status: string; // Job status (Active, Completed, etc.)
	posted: string; // When the job was posted
	description: string; // Short job description
}

// Dummy data for job posts
const dummyJobs: JobPost[] = [
	{
		title: "Social Media Campaign",
		status: "Active",
		posted: "3 days ago",
		description: "Looking for a social media expert to manage our platforms...",
	},
	{
		title: "Website Content Writer",
		status: "Completed",
		posted: "2 weeks ago",
		description: "Hired a content writer to create engaging articles for our blog...",
	},
	{
		title: "Logo Redesign Project",
		status: "In Progress",
		posted: "1 week ago",
		description: "Working with a designer to refresh our company logo...",
	},
];

// Reusable component for a single job card
const JobCard: React.FC<{ job: JobPost }> = ({ job }) => (
	<View style={styles.jobCard}>
		<Text style={styles.jobTitle}>{job.title}</Text>
		<Text style={styles.jobDescription}>{job.description}</Text>
		<View style={styles.statusRow}>
			<Text style={statusTag(job.status)}>{job.status}</Text>
			<Text style={styles.jobPosted}>{job.posted}</Text>
		</View>
	</View>
);

// Helper for status tag styling
const statusTag = (status: string) => ({
	backgroundColor: status === "Active" ? "#d1f7c4" : status === "Completed" ? "#e0e0e0" : "#fce3aa",
	color: "#000",
	paddingHorizontal: 8,
	borderRadius: 8,
	fontSize: 12,
});

const JobPostCard: React.FC = () => {
	// State for job posts
	const [jobs, setJobs] = useState<JobPost[]>(dummyJobs);

	// --- Uncomment below to fetch from a Mongoose/MongoDB backend ---
	/*
  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Failed to fetch jobs:", err));
  }, []);
  */

	return (
		<View style={styles.container}>
			<View style={styles.headerRow}>
				<Text style={styles.header}>My Job Posts</Text>
				<Text style={styles.viewAll}>View All</Text>
			</View>
			{/* Render each job dynamically */}
			{jobs.map((job, index) => (
				<JobCard key={index} job={job} />
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 24,
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	header: {
		fontWeight: "bold",
		fontSize: 16,
	},
	viewAll: {
		color: "blue",
	},
	jobCard: {
		backgroundColor: "#f9f9f9",
		padding: 12,
		borderRadius: 12,
		marginBottom: 12,
	},
	jobTitle: {
		fontWeight: "bold",
	},
	jobDescription: {
		color: "gray",
		marginBottom: 6,
	},
	statusRow: {
		flexDirection: "row",
		gap: 8,
	},
	jobPosted: {
		color: "#888",
	},
});

export default JobPostCard;
