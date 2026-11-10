/**
 * Shikhon Desktop Admin - Auth REST API Service
 * Handles admin authentication via Supabase Auth REST endpoints
 */

import { DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY } from './productsApi';

function getAuthConfig() {
  const url = localStorage.getItem('VITE_SUPABASE_URL') || DEFAULT_SUPABASE_URL;
  const key = localStorage.getItem('VITE_SUPABASE_ANON_KEY') || DEFAULT_SUPABASE_KEY;
  return {
    authBase: `${url.replace(/\/+$/, '')}/auth/v1`,
    key,
  };
}

/**
 * API: Admin Sign In
 * Method: POST /auth/v1/token?grant_type=password
 */
export async function loginAdminApi(email, password) {
  const { authBase, key } = getAuthConfig();
  
  const response = await fetch(`${authBase}/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || data.msg || data.message || 'Login failed');
  }

  // Save session tokens to localStorage
  localStorage.setItem('shikhon_admin_session', JSON.stringify(data));
  return data;
}

/**
 * API: Admin Sign Up (Register)
 * Method: POST /auth/v1/signup
 */
export async function signupAdminApi(email, password) {
  const { authBase, key } = getAuthConfig();
  
  const response = await fetch(`${authBase}/signup`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || data.msg || data.message || 'Registration failed');
  }

  return data;
}

/**
 * API: Get Current Authenticated User Session
 */
export function getCurrentSessionApi() {
  const sessionStr = localStorage.getItem('shikhon_admin_session');
  if (!sessionStr) return null;
  try {
    return JSON.parse(sessionStr);
  } catch (e) {
    return null;
  }
}

/**
 * API: Sign Out
 */
export function logoutAdminApi() {
  localStorage.removeItem('shikhon_admin_session');
}
