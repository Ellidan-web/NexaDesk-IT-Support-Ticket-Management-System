import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create Auth Context
const AuthContext = createContext();

// Base URL for API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with credentials
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for cookies
    headers: {
        'Content-Type': 'application/json'
    }
});

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Set up axios default headers
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Load user on mount
    useEffect(() => {
        const loadUser = async () => {
            const storedToken = localStorage.getItem('token');
            
            if (!storedToken) {
                setLoading(false);
                return;
            }

            try {
                // Set token in axios headers
                api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                setToken(storedToken);

                // Get user profile
                const response = await api.get('/auth/profile');
                setUser(response.data.user);
            } catch (error) {
                console.error('Error loading user:', error);
                // If token is invalid, try to refresh
                try {
                    const refreshResponse = await api.post('/auth/refresh-token');
                    if (refreshResponse.data.success) {
                        const newToken = refreshResponse.data.data.token;
                        localStorage.setItem('token', newToken);
                        setToken(newToken);
                        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                        
                        // Retry loading user
                        const profileResponse = await api.get('/auth/profile');
                        setUser(profileResponse.data.user);
                    } else {
                        throw new Error('Refresh failed');
                    }
                } catch (refreshError) {
                    // If refresh fails, clear everything
                    localStorage.removeItem('token');
                    setToken(null);
                    delete api.defaults.headers.common['Authorization'];
                    delete axios.defaults.headers.common['Authorization'];
                    setUser(null);
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    // Register user
    const register = async (name, email, password) => {
        try {
            const response = await api.post('/auth/register', {
                name,
                email,
                password
            });

            const { token, user } = response.data;
            
            // Store token in localStorage
            localStorage.setItem('token', token);
            setToken(token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);

            return { success: true, user };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.error || 'Registration failed' 
            };
        }
    };

    // Login user
    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });

            const { token, user } = response.data;
            
            // Store token in localStorage
            localStorage.setItem('token', token);
            setToken(token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);

            return { success: true, user };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.error || 'Login failed' 
            };
        }
    };

    // Logout user
    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        }
        
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
        delete axios.defaults.headers.common['Authorization'];
    };

    // Check if user is authenticated
    const isAuthenticated = !!user && !!token;

    // Context values
    const value = {
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;