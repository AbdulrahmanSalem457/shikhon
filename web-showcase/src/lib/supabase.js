import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ugmtruurtlyieptuzhar.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-ref')
);

// Clean empty products array - no seed data
export const FALLBACK_PRODUCTS = [];

export const supabase = createClient(supabaseUrl, supabaseAnonKey || 'dummy');
