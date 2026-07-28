require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const Database = require('./config/database');
const logger = require('./utils/logger');

// Import routes
const routes = require('./routes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Test database connection on startup
Database.testConnection();

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
app.use('/api', routes);
app.use('/api/auth', authRoutes);

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
        error: 'Route not found',
        path: req.originalUrl
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 NexaDesk Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Auth routes: http://localhost:${PORT}/api/auth`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});