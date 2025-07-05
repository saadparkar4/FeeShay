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
