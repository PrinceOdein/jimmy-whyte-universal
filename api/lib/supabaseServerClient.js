// api/lib/supabaseServerClient.js
// This file is specifically for backend/serverless functions
// It uses the Supabase Service Role Key for full database access

import { createClient } from '@supabase/supabase-js';

// --- IMPORTANT: GET VALUES FROM VERCEL ENVIRONMENT VARIABLES ---
// These MUST be set in your Vercel project settings for the function to work
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use the SERVICE ROLE key, NOT the anon key

console.log("Initializing Supabase client for backend function with URL:", supabaseUrl); // Debug log

// --- VALIDATE ENVIRONMENT VARIABLES ---
if (!supabaseUrl) {
    console.error("❌ CRITICAL: SUPABASE_URL is not set in Vercel environment variables for api/calcom-webhook.js.");
    // Throwing an error here will cause the function deployment to fail or runtime to crash
    // which is good for catching config issues early.
    throw new Error("Missing SUPABASE_URL environment variable");
}

if (!supabaseServiceRoleKey) {
    console.error("❌ CRITICAL: SUPABASE_SERVICE_ROLE_KEY is not set in Vercel environment variables for api/calcom-webhook.js.");
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
}
// --- ---

// --- CREATE THE SUPABASE CLIENT FOR BACKEND ---
// The service role key bypasses Row Level Security (RLS) and gives full access
// This is necessary and safe for server-side operations like writing to the database.
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  // Optional: Configure auth for service role usage
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});
// --- ---

export default supabase;
