import { ImageSourcePropType } from "react-native";

export interface Message {
    id: string;
    user: {
        name: string;
        avatar: ImageSourcePropType | undefined;
        isOnline: boolean;
    };
    message: string;
    time: string;
    isUnread: boolean;
}

export const messages: Message[] = [
    {
        id: "1",
        user: {
            name: "Sarah Johnson",
            avatar: undefined,
            isOnline: true,
        },
        message: "I can start working on your project tomorrow...",
        time: "10:42 AM",
        isUnread: true,
    },
    {
        id: "2",
        user: {
            name: "Michael Chen",
            avatar: undefined,
            isOnline: false,
        },
        message: "Thank you for your feedback on the design...",
        time: "Yesterday",
        isUnread: false,
    },
    {
        id: "3",
        user: {
            name: "Emma Rodriguez",
            avatar: undefined,
            isOnline: false,
        },
        message: "Received the first draft of your content...",
        time: "Tuesday",
        isUnread: false,
    },
    {
        id: "4",
        user: {
            name: "David Kim",
            avatar: undefined,
            isOnline: false,
        },
        message: "Can we schedule a call to discuss the project...",
        time: "Monday",
        isUnread: false,
    },
    {
        id: "5",
        user: {
            name: "Jessica Parker",
            avatar: undefined,
            isOnline: false,
        },
        message: "I'll send you the updated mockups by tomorrow...",
        time: "Last week",
        isUnread: false,
    },
];

export type JobStatus = "Active" | "Completed" | "In Progress";

export interface JobPost {
    id: string;
    title: string;
    description: string;
    status: JobStatus;
    dateLabel: string;
    dateValue: string;
    actions: { label: string; icon: string; onPress?: () => void }[];
}

export const jobPosts: JobPost[] = [
    {
        id: "1",
        title: "Social Media Campaign",
        description: "Looking for a social media expert to manage our platforms...",
        status: "Active",
        dateLabel: "Posted",
        dateValue: "3 days ago",
        actions: [
            { label: "Edit", icon: "edit-2" },
            { label: "Delete", icon: "trash-2" },
        ],
    },
    {
        id: "2",
        title: "Website Content Writer",
        description: "Hired a content writer to create engaging articles for our blog...",
        status: "Completed",
        dateLabel: "Completed",
        dateValue: "2 weeks ago",
        actions: [{ label: "View", icon: "eye" }],
    },
    {
        id: "3",
        title: "Logo Redesign Project",
        description: "Working with a designer to refresh our company logo...",
        status: "In Progress",
        dateLabel: "Started",
        dateValue: "1 week ago",
        actions: [{ label: "Chat", icon: "message-circle" }],
    },
];

export interface Service {
    id: string;
    title: string;
    description: string;
    dateLabel: string;
    dateValue: string;
    actions: { label: string; icon: string; onPress?: () => void }[];
}

export const services: Service[] = [
    {
        id: "1",
        title: "Logo Design",
        description: "Professional logo design for your business or brand.",
        dateLabel: "Added",
        dateValue: "2 days ago",
        actions: [
            { label: "Edit", icon: "edit-2" },
            { label: "Delete", icon: "trash-2" },
        ],
    },
    {
        id: "2",
        title: "SEO Optimization",
        description: "Improve your website ranking with expert SEO services.",
        dateLabel: "Added",
        dateValue: "1 week ago",
        actions: [
            { label: "Edit", icon: "edit-2" },
            { label: "Delete", icon: "trash-2" },
        ],
    },
    {
        id: "3",
        title: "Content Writing",
        description: "High-quality content writing for blogs, websites, and more.",
        dateLabel: "Added",
        dateValue: "3 weeks ago",
        actions: [
            { label: "Edit", icon: "edit-2" },
            { label: "Delete", icon: "trash-2" },
        ],
    },
];
