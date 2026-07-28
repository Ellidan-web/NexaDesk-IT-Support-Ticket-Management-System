const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client for authenticated requests (uses anon key)
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (uses service role key)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

module.exports = {
    supabaseClient,
    supabaseAdmin
};