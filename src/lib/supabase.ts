/**
 * Supabase Client Configuration
 * ─────────────────────────────
 * Initializes the Supabase JS client for auth.
 * 
 * TODO: Replace these with your actual Supabase project credentials.
 * For production, use environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  // TODO: Enable realtime subscriptions when backend is ready
  // realtime: {
  //   params: {
  //     eventsPerSecond: 10,
  //   },
  // },
});
