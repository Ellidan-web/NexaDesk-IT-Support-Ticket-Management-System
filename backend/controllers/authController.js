const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase');

// Register new user
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ 
                error: 'Please provide name, email, and password' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters' 
            });
        }

        // Check if user exists
        const { data: existingUser, error: checkError } = await supabaseAdmin
            .from('users')
            .select('email')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user in database
        const { data: newUser, error: createError } = await supabaseAdmin
            .from('users')
            .insert([
                {
                    name,
                    email,
                    password: hashedPassword,
                    role: 'user'
                }
            ])
            .select('id, name, email, role, created_at')
            .single();

        if (createError) {
            console.error('Create user error:', createError);
            return res.status(500).json({ error: 'Failed to create user' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Return user data and token
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
            token
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Please provide email and password' 
            });
        }

        // Find user by email
        const { data: user, error: findError } = await supabaseAdmin
            .from('users')
            .select('id, name, email, password, role')
            .eq('email', email)
            .single();

        if (findError || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Generate refresh token
        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET + '_refresh',
            { expiresIn: '30d' }
        );

        // Set refresh token as httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        // Remove password from user object
        const { password: _, ...userWithoutPassword } = user;

        // Return user data and token
        res.json({
            message: 'Login successful',
            user: userWithoutPassword,
            token: token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};


// Get current user profile
const getProfile = async (req, res) => {
    try {
        // User is already attached to req by auth middleware
        const user = req.user;
        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
};

// Logout - clear refresh token cookie
const logout = async (req, res) => {
    try {
        // Clear refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.json({ 
            success: true,
            data: {
                message: 'Logout successful'
            }
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ 
            success: false,
            error: {
                code: 'LOGOUT_FAILED',
                message: 'Logout failed'
            }
        });
    }
};

// Admin: Get all users
const getAllUsers = async (req, res) => {
    try {
        const { data: users, error } = await supabaseAdmin
            .from('users')
            .select('id, name, email, role')
            .order('name');

        if (error) {
            console.error('Get users error:', error);
            return res.status(500).json({ error: 'Failed to get users' });
        }

        res.json({ users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
};
// Refresh token - get new access token from refresh token cookie
const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'NO_REFRESH_TOKEN',
                    message: 'No refresh token provided'
                }
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET + '_refresh');

        // Get user
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('id, name, email, role')
            .eq('id', decoded.userId)
            .single();

        if (error || !user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_REFRESH_TOKEN',
                    message: 'Invalid refresh token'
                }
            });
        }

        // Generate new token
        const newToken = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            success: true,
            data: {
                token: newToken
            }
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({
            success: false,
            error: {
                code: 'INVALID_REFRESH_TOKEN',
                message: 'Invalid refresh token'
            }
        });
    }
};
module.exports = {
    register,
    login,
    getProfile,
    logout,
    getAllUsers,
    refreshToken 
};