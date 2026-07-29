import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getToken = () => localStorage.getItem('token');

// Create axios instance with auth header
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Ticket Service
const ticketService = {
    // Create a new ticket
    createTicket: async (ticketData) => {
        try {
            const response = await api.post('/tickets', ticketData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to create ticket'
            };
        }
    },

    // Get user's tickets
    getUserTickets: async () => {
        try {
            const response = await api.get('/tickets/my');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to get tickets'
            };
        }
    },

    // Get ticket by ID
    getTicketById: async (id) => {
        try {
            const response = await api.get(`/tickets/${id}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to get ticket'
            };
        }
    },

    // Update ticket status
    updateStatus: async (id, status) => {
        try {
            const response = await api.patch(`/tickets/${id}/status`, { status });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update status'
            };
        }
    },

    // Update ticket priority
    updatePriority: async (id, priority) => {
        try {
            const response = await api.patch(`/tickets/${id}/priority`, { priority });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update priority'
            };
        }
    },

    // Add comment to ticket
    addComment: async (id, message) => {
        try {
            const response = await api.post(`/tickets/${id}/comments`, { message });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to add comment'
            };
        }
    },

    // Admin: Get all tickets
    getAllTickets: async () => {
        try {
            const response = await api.get('/tickets/admin/all');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to get all tickets'
            };
        }
    },

    // Admin: Assign ticket
    assignTicket: async (id, assignedTo) => {
        try {
            const response = await api.patch(`/tickets/admin/${id}/assign`, { assignedTo });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to assign ticket'
            };
        }
    }
};

export default ticketService;