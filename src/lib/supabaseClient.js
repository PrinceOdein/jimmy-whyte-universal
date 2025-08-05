// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// These should ideally come from environment variables for security
// For local development, you can put them directly, but for production, use .env files
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // e.g., 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // e.g., 'public-anon-key-from-settings'

console.log('Initializing Supabase client with URL:', supabaseUrl); // Debug log

export const supabase = createClient(supabaseUrl, supabaseAnonKey);