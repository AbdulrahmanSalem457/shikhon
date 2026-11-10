/**
 * Shikhon Web Showcase - Products REST API Client
 * Connects directly to Supabase PostgREST endpoints via standard HTTP fetch
 */

export const SUPABASE_URL = 'https://ugmtruurtlyieptuzhar.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_xSR0yiIJFDYy47qtibxLNA_EQlfuLdv';

const REST_ENDPOINT = `${SUPABASE_URL}/rest/v1`;

const defaultHeaders = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

/**
 * API: Get All Products
 * Method: GET /rest/v1/products?select=*&order=created_at.desc
 * Fetches all spare parts from the PostgreSQL products table via PostgREST API
 */
export async function getProductsApi() {
  const url = `${REST_ENDPOINT}/products?select=*&order=created_at.desc`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: defaultHeaders,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`[API Error ${response.status}] Failed to fetch products: ${errorText}`);
  }

  const products = await response.json();
  return products;
}

/**
 * API: Get Single Product by ID
 * Method: GET /rest/v1/products?id=eq.{id}&select=*
 */
export async function getProductByIdApi(id) {
  const url = `${REST_ENDPOINT}/products?id=eq.${id}&select=*`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: defaultHeaders,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product ${id}`);
  }

  const data = await response.json();
  return data?.[0] || null;
}
