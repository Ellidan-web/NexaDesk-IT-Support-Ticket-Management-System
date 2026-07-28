const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAuth() {
    console.log('🧪 Testing Authentication...\n');

    try {
        // Test Registration
        console.log('📝 Testing Registration...');
        const registerData = {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123'
        };
        
        const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
        console.log('✅ Registration successful!');
        console.log('User:', registerResponse.data.user);
        console.log('Token:', registerResponse.data.token.substring(0, 50) + '...\n');

        // Test Login
        console.log('🔑 Testing Login...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: registerData.email,
            password: registerData.password
        });
        console.log('✅ Login successful!');
        console.log('User:', loginResponse.data.user);
        console.log('Token:', loginResponse.data.token.substring(0, 50) + '...\n');

        // Test Protected Route
        console.log('🛡️ Testing Protected Route...');
        const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
            headers: {
                Authorization: `Bearer ${loginResponse.data.token}`
            }
        });
        console.log('✅ Profile access successful!');
        console.log('Profile:', profileResponse.data.user);

        console.log('\n🎉 All tests passed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testAuth();