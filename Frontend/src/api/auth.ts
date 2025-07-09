import { mainAPI } from "./index";
import { storeToken } from "./storage";

const signup = async (email: string, password: string, name: string, role: "freelancer" | "client", image?: string) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("role", role);

    if (image) {
        formData.append("image", {
            name: "image.jpg",
            uri: image,
            type: "image/*",
        } as any);
    }

    const { data } = await mainAPI.post("/auth/register", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    if (data.data?.token) {
        await storeToken(data.data.token);
    }

    return data;
};

const signin = async (email: string, password: string) => {
    const loginUser = {
        email: email,
        password: password,
    };

    const { data } = await mainAPI.post("/auth/login", loginUser);

    if (data.data?.token) {
        await storeToken(data.data.token);
    }

    return data;
};

const me = async () => {
    const { data } = await mainAPI.get("/auth/profile");
    return data;
};

const updateProfile = async (profileData: any) => {
    const { data } = await mainAPI.put("/auth/profile", profileData);
    return data;
};

const changePassword = async (currentPassword: string, newPassword: string) => {
    const { data } = await mainAPI.put("/auth/change-password", {
        currentPassword,
        newPassword,
    });
    return data;
};

export { signin, signup, me, updateProfile, changePassword };
