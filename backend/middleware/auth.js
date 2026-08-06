const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase');

const authMiddleware = async (req, res, next) => {
    try {
        // Try to get token from Authorization header first
        let token = null;
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        // If no token in header, try to get from cookie
        if (!token && req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            return res.status(401).json({ 
                success: false,
                error: {
                    code: 'NO_TOKEN',
                    message: 'No token provided'
                }
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('id, name, email, role')
            .eq('id', decoded.userId)
            .single();

        if (error || !user) {
            return res.status(401).json({ 
                success: false,
                error: {
                    code: 'USER_NOT_FOUND',
                    message: 'User not found'
                }
            });
        }

        // Attach user to request
        req.user = user;
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Invalid token'
                }
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                error: {
                    code: 'TOKEN_EXPIRED',
                    message: 'Token expired'
                }
            });
        }
        console.error('Auth middleware error:', error);
        res.status(500).json({ 
            success: false,
            error: {
                code: 'AUTH_FAILED',
                message: 'Authentication failed'
            }
        });
    }
};

module.exports = authMiddleware;