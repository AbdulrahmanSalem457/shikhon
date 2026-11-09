import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ugmtruurtlyieptuzhar.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_xSR0yiIJFDYy47qtibxLNA_EQlfuLdv';

export const isSupabaseConfigured = true;

// Clean empty products array - no seed data
export const FALLBACK_PRODUCTS = [];

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
