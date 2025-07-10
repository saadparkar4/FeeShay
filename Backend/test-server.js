// Quick test to verify server and database connection
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testServer() {
    console.log('🔍 Testing FeeShay Backend...\n');
    
    // Test 1: Health Check
    try {
        console.log('1. Testing health endpoint...');
        const health = await axios.get(`${BASE_URL}/health`);
        console.log('✅ Health check passed:', health.data);
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
        console.log('Make sure the server is running: npm run dev');
        return;
    }
    
    // Test 2: API Health Check
    try {
        console.log('\n2. Testing API health endpoint...');
        const apiHealth = await axios.get(`${BASE_URL}/api/v1/health`);
        console.log('✅ API health check passed:', apiHealth.data);
    } catch (error) {
        console.error('❌ API health check failed:', error.message);
    }
    
    // Test 3: Register Endpoint
    try {
        console.log('\n3. Testing register endpoint...');
        const testUser = {
            email: `test${Date.now()}@example.com`,
            password: 'Test1234!',
            role: 'client',
            name: 'Test User'
        };
        
        const register = await axios.post(`${BASE_URL}/api/v1/auth/register`, testUser);
        console.log('✅ Register endpoint working:', {
            success: register.data.success,
            user: register.data.data.user.email
        });
    } catch (error) {
        console.error('❌ Register test failed:', error.response?.data || error.message);
    }
    
    console.log('\n✨ Test complete!');
}

testServer();