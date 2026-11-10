import { createClient } from '@supabase/supabase-js';

export const DEFAULT_URL = 'https://ugmtruurtlyieptuzhar.supabase.co';
export const DEFAULT_KEY = 'sb_publishable_xSR0yiIJFDYy47qtibxLNA_EQlfuLdv';

// Always guarantee project URL and key are stored and synchronized
localStorage.setItem('VITE_SUPABASE_URL', DEFAULT_URL);
localStorage.setItem('VITE_SUPABASE_ANON_KEY', DEFAULT_KEY);

export const getSupabaseConfig = () => {
  return {
    url: DEFAULT_URL,
    anonKey: DEFAULT_KEY,
    isConfigured: true,
  };
};

export const saveSupabaseConfig = (url, anonKey) => {
  const cleanUrl = url.trim().replace(/\/+$/, '');
  const cleanKey = anonKey.trim();
  localStorage.setItem('VITE_SUPABASE_URL', cleanUrl);
  localStorage.setItem('VITE_SUPABASE_ANON_KEY', cleanKey);
};

export let supabase = createClient(DEFAULT_URL, DEFAULT_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Real-Time Cross-Client Synchronization Channel (Broadcast + DB)
export const realtimeSyncChannel = supabase.channel('shikhon-products-sync', {
  config: {
    broadcast: { ack: true }
  }
});

realtimeSyncChannel.subscribe((status) => {
  console.log('[Admin Realtime Sync Channel Status]:', status);
});

export const broadcastProductChange = async (event, payload) => {
  try {
    if (realtimeSyncChannel) {
      await realtimeSyncChannel.send({
        type: 'broadcast',
        event,
        payload,
      });
      console.log(`[Realtime Broadcast] Dispatched ${event}:`, payload);
    }
  } catch (err) {
    console.warn('[Realtime Broadcast Error]:', err);
  }
};

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

  const fileExt = (file.name || 'image.jpg').split('.').pop().toLowerCase();
  const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = cleanFileName;

  const mimeType = file.type || (
    fileExt === 'png' ? 'image/png' :
    fileExt === 'webp' ? 'image/webp' :
    fileExt === 'avif' ? 'image/avif' :
    'image/jpeg'
  );

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      contentType: mimeType,
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Storage upload error:', error);
    throw new Error(error.message || 'Error uploading image to storage');
  }

  // Retrieve public URL
  const { data: publicUrlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  const url = publicUrlData.publicUrl;
  return {
    path: filePath,
    publicUrl: url,
    toString() { return url; },
    valueOf() { return url; }
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
