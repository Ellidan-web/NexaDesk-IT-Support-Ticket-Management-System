const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let token = '';
let ticketId = '';
const testEmail = `test${Date.now()}@example.com`;

async function testTickets() {
    console.log('🧪 Testing Ticket API...\n');

    try {
        // 1. Register a new user
        console.log('📝 Registering test user...');
        const registerData = {
            name: 'Test User',
            email: testEmail,
            password: 'password123'
        };
        
        try {
            await axios.post(`${BASE_URL}/auth/register`, registerData);
            console.log('✅ User registered\n');
        } catch (registerError) {
            // User might already exist, continue to login
            console.log('ℹ️ User may already exist, trying login...\n');
        }

        // 2. Login
        console.log('🔑 Getting auth token...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: testEmail,
            password: 'password123'
        });
        token = loginResponse.data.token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('✅ Authentication successful\n');

        // 3. Create a ticket
        console.log('📝 Creating ticket...');
        const ticketData = {
            title: 'Cannot access email account',
            description: 'I cannot access my company email since this morning. Please help!',
            category: 'Email',
            priority: 'HIGH'
        };
        const createResponse = await axios.post(`${BASE_URL}/tickets`, ticketData);
        ticketId = createResponse.data.ticket.id;
        console.log('✅ Ticket created:', ticketId);
        console.log('   Title:', createResponse.data.ticket.title);
        console.log('   Status:', createResponse.data.ticket.status);
        console.log('   Priority:', createResponse.data.ticket.priority, '\n');

        // 4. Get user's tickets
        console.log('📋 Getting user tickets...');
        const ticketsResponse = await axios.get(`${BASE_URL}/tickets/my`);
        console.log('✅ Found', ticketsResponse.data.tickets.length, 'tickets\n');

        // 5. Get ticket details
        console.log('🔍 Getting ticket details...');
        const detailResponse = await axios.get(`${BASE_URL}/tickets/${ticketId}`);
        console.log('✅ Ticket details:');
        console.log('   Title:', detailResponse.data.ticket.title);
        console.log('   Status:', detailResponse.data.ticket.status);
        console.log('   Comments:', detailResponse.data.comments.length, '\n');

        // 6. Add comment
        console.log('💬 Adding comment...');
        const commentResponse = await axios.post(`${BASE_URL}/tickets/${ticketId}/comments`, {
            message: 'I have tried restarting my computer but still cannot access email.'
        });
        console.log('✅ Comment added:', commentResponse.data.comment.message, '\n');

        // 7. Update status
        console.log('🔄 Updating ticket status...');
        const statusResponse = await axios.patch(`${BASE_URL}/tickets/${ticketId}/status`, {
            status: 'IN_PROGRESS'
        });
        console.log('✅ Status updated to:', statusResponse.data.ticket.status, '\n');

        // 8. Update priority
        console.log('🔄 Updating ticket priority...');
        const priorityResponse = await axios.patch(`${BASE_URL}/tickets/${ticketId}/priority`, {
            priority: 'CRITICAL'
        });
        console.log('✅ Priority updated to:', priorityResponse.data.ticket.priority, '\n');

        console.log('🎉 All ticket tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testTickets();