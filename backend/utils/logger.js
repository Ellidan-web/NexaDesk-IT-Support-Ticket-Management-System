// Simple logger for development
const logger = {
    info: (...args) => console.log('ℹ️', ...args),
    error: (...args) => console.error('❌', ...args),
    warn: (...args) => console.warn('⚠️', ...args),
    success: (...args) => console.log('✅', ...args),
    debug: (...args) => process.env.NODE_ENV === 'development' && console.log('🔍', ...args)
};

module.exports = logger;