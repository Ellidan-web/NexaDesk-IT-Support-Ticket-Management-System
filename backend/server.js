require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const xss = require('xss');
const Database = require('./config/database');
const logger = require('./utils/logger');

// Import routes
const routes = require('./routes');
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// ⚠️ CRITICAL FIX: TRUST PROXY (I-set BAGO ANG LAHAT)
// ==========================================
app.set('trust proxy', 1); 

// ==========================================
// RATE LIMITING
// ==========================================
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20, // <--- TAASAN MO TO PARA HINDI KA MA-BLOCK AGAD
    message: 'Too many login attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Test database connection on startup
Database.testConnection();

// ==========================================
// SECURITY HEADERS (HELMET)
// ==========================================
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https:"],
            styleSrc: ["'self'", "'unsafe-inline'", "https:"],
            fontSrc: ["'self'", "https:"],
            connectSrc: ["'self'", "https://nexadesk-it-support-ticket-management.onrender.com", "https://*.supabase.co", "https:"],
            frameAncestors: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
        },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // <--- ITO ANG TAMANG SETTING
}));

app.use(cookieParser());

// ==========================================
// CORS CONFIGURATION
// ==========================================
const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'https://nexadesk-it-support-ticket-management.onrender.com', // <--- IDAGDAG MO ITO
    'https://nexa-desk-it-support-ticket-managem-alpha.vercel.app',
    'https://nexa-desk-it-support-ticket-managem.vercel.app',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

// ==========================================
// INPUT SANITIZATION (Excluding Password)
// ==========================================
// IMPORTANTE: Hindi dapat i-sanitize ang password dahil binabago nito ang string structure!
app.use((req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            // Huwag i-sanitize ang password at confirmPassword
            if (key !== 'password' && key !== 'confirmPassword' && typeof req.body[key] === 'string') {
                req.body[key] = xss(req.body[key]);
            }
        });
    }
    next();
});

// ==========================================
// BODY PARSING & LOGGING
// ==========================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// ==========================================
// API ROUTES
// ==========================================
// Apply rate limiting to all requests
app.use('/api', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use('/api', routes);
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        name: 'NexaDesk API',
        version: '1.0.0',
        status: 'running'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'Route not found',
            path: req.originalUrl
        }
    });
});

// Global error handler
app.use((err, req, res, next) => {
    logger.error(err.stack);

    const statusCode = err.statusCode || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';

    res.status(statusCode).json({
        success: false,
        error: {
            code: errorCode,
            message: err.message || 'Internal Server Error',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 NexaDesk Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔐 Auth routes: http://localhost:${PORT}/api/auth`);
    console.log(`🎫 Ticket routes: http://localhost:${PORT}/api/tickets`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});