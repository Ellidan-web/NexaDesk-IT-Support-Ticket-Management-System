const { supabaseAdmin } = require('./supabase');

class Database {
    // Test connection
    static async testConnection() {
        try {
            const { data, error } = await supabaseAdmin
                .from('users')
                .select('count')
                .limit(1);
            
            if (error) throw error;
            console.log('✅ Supabase connection successful');
            return true;
        } catch (error) {
            console.error('❌ Supabase connection failed:', error.message);
            return false;
        }
    }

    // Generic query wrapper with error handling
    static async query(table, operation, params = {}) {
        try {
            let query = supabaseAdmin.from(table);
            
            switch(operation) {
                case 'select':
                    query = query.select(params.columns || '*');
                    if (params.where) query = query.match(params.where);
                    if (params.order) query = query.order(params.order.column, { ascending: params.order.ascending });
                    if (params.limit) query = query.limit(params.limit);
                    break;
                case 'insert':
                    query = query.insert(params.data);
                    break;
                case 'update':
                    query = query.update(params.data);
                    if (params.where) query = query.match(params.where);
                    break;
                case 'delete':
                    query = query.delete();
                    if (params.where) query = query.match(params.where);
                    break;
                default:
                    throw new Error(`Unsupported operation: ${operation}`);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error(`Database error (${operation} on ${table}):`, error.message);
            return { data: null, error };
        }
    }
}

module.exports = Database;