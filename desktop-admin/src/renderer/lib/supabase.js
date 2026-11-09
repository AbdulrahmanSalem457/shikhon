import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://ugmtruurtlyieptuzhar.supabase.co';
const DEFAULT_KEY = 'sb_publishable_xSR0yiIJFDYy47qtibxLNA_EQlfuLdv';

export const getSupabaseConfig = () => {
  const url = localStorage.getItem('VITE_SUPABASE_URL') || import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
  const anonKey = localStorage.getItem('VITE_SUPABASE_ANON_KEY') || import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;
  const isConfigured = Boolean(url && anonKey && !url.includes('your-project-ref'));
  return { url, anonKey, isConfigured };
};

export const saveSupabaseConfig = (url, anonKey) => {
  localStorage.setItem('VITE_SUPABASE_URL', url.trim());
  localStorage.setItem('VITE_SUPABASE_ANON_KEY', anonKey.trim());
};

const initialConfig = getSupabaseConfig();

export let supabase = createClient(initialConfig.url, initialConfig.anonKey);

export const reinitializeSupabase = (url, anonKey) => {
  saveSupabaseConfig(url, anonKey);
  supabase = createClient(url, anonKey);
  return supabase;
};

// Storage upload helper for product-images bucket
export const uploadImageToStorage = async (file) => {
  if (!supabase) {
    throw new Error('Supabase client is not configured.');
  }

  // Generate clean unique filename: timestamp-random-filename
  const fileExt = file.name.split('.').pop();
  const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `parts/${cleanFileName}`;

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw error;
  }

  // Retrieve public URL
  const { data: publicUrlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return {
    path: filePath,
    publicUrl: publicUrlData.publicUrl
  };
};

// Storage delete helper
export const deleteImageFromStorage = async (imageUrl) => {
  if (!supabase || !imageUrl) return;

  try {
    const bucketMarker = '/product-images/';
    if (imageUrl.includes(bucketMarker)) {
      const path = imageUrl.split(bucketMarker)[1];
      if (path) {
        await supabase.storage.from('product-images').remove([path]);
      }
    }
  } catch (err) {
    console.warn('Could not delete image from storage:', err);
  }
};
