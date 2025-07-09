const axios = require("axios");

const API_BASE_URL = "http://localhost:3000/api/v1";

async function testBackendConnection() {
    console.log("🧪 Testing FeeShay Backend Connection...\n");

    try {
        // Test health check
        console.log("1. Testing health check...");
        const healthResponse = await axios.get(`${API_BASE_URL}/health`);
        console.log("✅ Health check passed:", healthResponse.data);

        // Test registration
        console.log("\n2. Testing user registration...");
        const registerData = {
            email: "test@example.com",
            password: "testpassword123",
            name: "Test User",
            role: "freelancer",
        };

        const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, registerData);
        console.log("✅ Registration successful:", registerResponse.data.message);

        // Test login
        console.log("\n3. Testing user login...");
        const loginData = {
            email: "test@example.com",
            password: "testpassword123",
        };

        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
        console.log("✅ Login successful:", loginResponse.data.message);

        // Test profile with token
        console.log("\n4. Testing profile retrieval...");
        const token = loginResponse.data.data.token;
        const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("✅ Profile retrieval successful:", profileResponse.data.message);

        console.log("\n🎉 All tests passed! Backend is working correctly.");
        console.log("\n📝 Next steps:");
        console.log("1. Start the frontend: npm start");
        console.log("2. The frontend should now connect to the backend successfully");
    } catch (error) {
        console.error("❌ Test failed:", error.response?.data || error.message);
        console.log("\n🔧 Troubleshooting:");
        console.log("1. Make sure the backend is running: cd ../Backend && npm start");
        console.log("2. Check if the backend is on port 3000");
        console.log("3. Verify the API endpoints are correct");
    }
}

testBackendConnection();
