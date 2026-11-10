/**
 * Shikhon Desktop Admin - Products REST API Service
 * Makes explicit HTTP calls to Supabase PostgREST endpoints
 */

export const DEFAULT_SUPABASE_URL = 'https://ugmtruurtlyieptuzhar.supabase.co';
export const DEFAULT_SUPABASE_KEY = 'sb_publishable_xSR0yiIJFDYy47qtibxLNA_EQlfuLdv';

function getApiConfig() {
  const url = localStorage.getItem('VITE_SUPABASE_URL') || DEFAULT_SUPABASE_URL;
  const key = localStorage.getItem('VITE_SUPABASE_ANON_KEY') || DEFAULT_SUPABASE_KEY;
  return {
    baseUrl: `${url.replace(/\/+$/, '')}/rest/v1`,
    key,
  };
}

function getHeaders(token = null) {
  const { key } = getApiConfig();
  const bearerToken = token || key;
  return {
    'apikey': key,
    'Authorization': `Bearer ${bearerToken}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  };
}

/**
 * API: Get All Products
 * Method: GET /rest/v1/products?select=*&order=created_at.desc
 */
export async function getProductsApi() {
  const { baseUrl } = getApiConfig();
  const response = await fetch(`${baseUrl}/products?select=*&order=created_at.desc`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`[API Error ${response.status}] ${errorText}`);
  }

  return await response.json();
}

/**
 * API: Create New Product
 * Method: POST /rest/v1/products
 */
export async function createProductApi(productData, token = null) {
  const { baseUrl } = getApiConfig();
  const response = await fetch(`${baseUrl}/products`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`[API Error ${response.status}] Failed to create product: ${errorText}`);
  }

  const createdItems = await response.json();
  return createdItems?.[0] || createdItems;
}

/**
 * API: Update Product
 * Method: PATCH /rest/v1/products?id=eq.{id}
 */
export async function updateProductApi(id, updatedFields, token = null) {
  const { baseUrl } = getApiConfig();
  const response = await fetch(`${baseUrl}/products?id=eq.${id}`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(updatedFields),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`[API Error ${response.status}] Failed to update product: ${errorText}`);
  }

  const updatedItems = await response.json();
  return updatedItems?.[0] || updatedItems;
}

/**
 * API: Delete Product
 * Method: DELETE /rest/v1/products?id=eq.{id}
 */
export async function deleteProductApi(id, token = null) {
  const { baseUrl } = getApiConfig();
  const response = await fetch(`${baseUrl}/products?id=eq.${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`[API Error ${response.status}] Failed to delete product: ${errorText}`);
  }

  const deletedItems = await response.json();
  return deletedItems?.[0] || deletedItems;
}
