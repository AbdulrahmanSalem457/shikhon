/**
 * Shikhon Desktop Admin - Storage REST API Service
 * Handles file uploads and asset management via Supabase Storage HTTP REST API
 */

import { DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY } from './productsApi';

function getAuthToken() {
  try {
    const sessionStr = localStorage.getItem('shikhon_admin_session');
    if (sessionStr) {
      const parsed = JSON.parse(sessionStr);
      if (parsed?.access_token) return parsed.access_token;
    }
  } catch (e) {}
  return null;
}

function getStorageConfig() {
  const url = localStorage.getItem('VITE_SUPABASE_URL') || DEFAULT_SUPABASE_URL;
  const key = localStorage.getItem('VITE_SUPABASE_ANON_KEY') || DEFAULT_SUPABASE_KEY;
  const token = getAuthToken() || key;
  return {
    rawUrl: url.replace(/\/+$/, ''),
    storageBase: `${url.replace(/\/+$/, '')}/storage/v1`,
    key,
    token,
  };
}

/**
 * Utility: Normalize Image URL
 * Safely extracts clean URL if it's stored as raw string or serialized JSON
 */
export function normalizeImageUrl(url) {
  if (!url) return '';
  if (typeof url === 'string') {
    const trimmed = url.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        return parsed.publicUrl || parsed.url || parsed.fileName || trimmed;
      } catch (e) {
        return trimmed;
      }
    }
    return trimmed;
  }
  if (typeof url === 'object' && url !== null) {
    return url.publicUrl || url.url || '';
  }
  return String(url);
}

/**
 * API: Upload Product Image
 * Method: POST /storage/v1/object/product-images/{fileName}
 * Returns the permanent public CDN URL string
 */
export async function uploadImageApi(file) {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  const { storageBase, key, token } = getStorageConfig();

  const fileExt = (file.name || 'image.jpg').split('.').pop().toLowerCase();
  const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  
  const mimeType = file.type || (
    fileExt === 'png' ? 'image/png' :
    fileExt === 'webp' ? 'image/webp' :
    fileExt === 'avif' ? 'image/avif' :
    'image/jpeg'
  );

  const uploadEndpoint = `${storageBase}/object/product-images/${cleanFileName}`;

  const response = await fetch(uploadEndpoint, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${token}`,
      'Content-Type': mimeType,
      'x-upsert': 'true',
    },
    body: file,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`[Storage API ${response.status}] Failed to upload image: ${errorText}`);
  }

  // Build direct permanent public image URL
  const publicUrl = `${storageBase}/object/public/product-images/${cleanFileName}`;
  
  return publicUrl;
}

/**
 * API: Delete Product Image from Storage
 * Method: DELETE /storage/v1/object/product-images/{fileName}
 */
export async function deleteImageApi(imageUrl) {
  if (!imageUrl) return;

  try {
    const normalized = normalizeImageUrl(imageUrl);
    const { storageBase, key, token } = getStorageConfig();
    const marker = '/product-images/';
    if (!normalized.includes(marker)) return;

    const fileName = normalized.split(marker)[1];
    if (!fileName) return;

    const deleteEndpoint = `${storageBase}/object/product-images/${fileName}`;

    await fetch(deleteEndpoint, {
      method: 'DELETE',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.warn('[Storage API] Could not delete image:', err);
  }
}
