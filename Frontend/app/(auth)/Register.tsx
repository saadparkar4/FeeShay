import { useAuth } from "../../src/contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const PRIMARY_COLOR = "#000042";
const BG_COLOR = "#f5f6fa";
const BORDER_COLOR = "#c5cae9";
const INPUT_HEIGHT = 48;
const CONTENT_WIDTH = "85%";
const BORDER_RADIUS = 16;
const FONT_SIZE_LABEL = 16;
const FONT_SIZE_INPUT = 16;
const FONT_SIZE_TITLE = 28;
const BUTTON_HEIGHT = 48;

const Register = () => {
    const { register, isAuthenticated } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState<"freelancer" | "client">("freelancer");
    const [image, setImage] = useState<string | null>(null);
    const [mistakes, setMistakes] = useState("");
    const [checking, setChecking] = useState(false);

    const { mutateAsync } = useMutation({
        mutationKey: ["Register"],
        mutationFn: () => register(email, password, name, role),
        onSuccess: () => {
            alert("Ahlan hab!b!...");
            router.replace("/");
            console.log("this was success");
        },
        onError: () => {
            setMistakes("Registration failed. Please try again.");
        },
    });

    if (isAuthenticated) {
        router.replace("/");
        return null;
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            aspect: [1, 1],
            quality: 1,
        });
        console.log(result);
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // Layman zod schema for register
    const checkForm = z.object({
        email: z.string().email({ message: "Please enter a valid email address." }).min(1, { message: "Please type your email." }),
        pass: z.string().min(6, { message: "Password must be at least 6 characters." }).max(20, { message: "Password must be 20 characters or less." }),
        name: z.string().min(1, { message: "Please enter your name." }).max(50, { message: "Name must be 50 characters or less." }),
        img: z.string().optional(),
    });

    const tryRegister = async () => {
        setMistakes("");
        setChecking(true);
        const lookFor = checkForm.safeParse({ email, pass: password, name, img: image || undefined });
        if (!lookFor.success) {
            setMistakes(lookFor.error.errors[0].message);
            setChecking(false);
            return;
        }
        try {
            await mutateAsync();
        } catch (error: any) {
            setMistakes("Registration failed. Please try again.");
            setChecking(false);
            return;
        }
        setChecking(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.viewCenter}>
                <TouchableOpacity onPress={pickImage}>
                    <View style={styles.image}>{image && <Image style={styles.image} source={{ uri: image }} />}</View>
                </TouchableOpacity>
                <Text style={{ color: "#d32f2f", marginBottom: mistakes ? 8 : 0 }}>{mistakes}</Text>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput placeholder="Full Name" style={styles.input} autoCapitalize="words" autoCorrect={false} onChangeText={(text) => setName(text)} value={name} />
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    keyboardType="email-address"
                />
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                />
                <Text style={styles.inputLabel}>Role</Text>
                <View style={styles.roleContainer}>
                    <TouchableOpacity style={[styles.roleButton, role === "freelancer" && styles.roleButtonActive]} onPress={() => setRole("freelancer")}>
                        <Text style={[styles.roleText, role === "freelancer" && styles.roleTextActive]}>Freelancer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.roleButton, role === "client" && styles.roleButtonActive]} onPress={() => setRole("client")}>
                        <Text style={[styles.roleText, role === "client" && styles.roleTextActive]}>Client</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={tryRegister} style={styles.submitButton} disabled={checking}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>{checking ? "Checking..." : "Register Hab!b!"}</Text>
                </TouchableOpacity>
                <Text style={styles.footerText}>
                    Got account,{" "}
                    <Text style={{ color: PRIMARY_COLOR, fontWeight: "600" }} onPress={() => router.push("/Login" as any)}>
                        {" "}
                        Login Hab!b!{" "}
                    </Text>
                </Text>
            </View>
        </View>
    );
};

export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BG_COLOR,
        paddingHorizontal: 16,
    },
    viewCenter: {
        alignItems: "center",
        width: CONTENT_WIDTH,
    },
    title: {
        fontSize: FONT_SIZE_TITLE,
        fontWeight: "bold",
        color: PRIMARY_COLOR,
        marginBottom: 24,
        textAlign: "center",
    },
    inputLabel: {
        alignSelf: "flex-start",
        fontWeight: "600",
        fontSize: FONT_SIZE_LABEL,
        color: PRIMARY_COLOR,
        marginBottom: 6,
        marginTop: 12,
    },
    input: {
        borderWidth: 1.5,
        borderColor: BORDER_COLOR,
        borderRadius: BORDER_RADIUS,
        height: INPUT_HEIGHT,
        width: "100%",
        paddingHorizontal: 14,
        fontSize: FONT_SIZE_INPUT,
        backgroundColor: "#fff",
        marginBottom: 8,
    },
    image: {
        height: 120,
        width: 120,
        borderRadius: 60,
        marginBottom: 24,
        alignSelf: "center",
        backgroundColor: "#e8eaf6",
        borderWidth: 2,
        borderColor: BORDER_COLOR,
    },
    roleContainer: {
        flexDirection: "row",
        width: "100%",
        marginBottom: 8,
    },
    roleButton: {
        flex: 1,
        height: INPUT_HEIGHT,
        borderWidth: 1.5,
        borderColor: BORDER_COLOR,
        borderRadius: BORDER_RADIUS,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        marginHorizontal: 4,
    },
    roleButtonActive: {
        backgroundColor: PRIMARY_COLOR,
        borderColor: PRIMARY_COLOR,
    },
    roleText: {
        fontSize: FONT_SIZE_INPUT,
        color: PRIMARY_COLOR,
        fontWeight: "600",
    },
    roleTextActive: {
        color: "#fff",
    },
    submitButton: {
        backgroundColor: PRIMARY_COLOR,
        width: "100%",
        height: BUTTON_HEIGHT,
        borderRadius: BORDER_RADIUS,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 18,
        marginBottom: 10,
        elevation: 2,
    },
    linkText: {
        color: PRIMARY_COLOR,
        fontWeight: "600",
        fontSize: 15,
    },
    footerText: {
        marginTop: 8,
        fontSize: 15,
        color: "#333",
        textAlign: "center",
    },
});
