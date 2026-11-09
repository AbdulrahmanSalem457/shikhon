# Shikhon (شيخون) - Swagger / OpenAPI 3.0 Documentation & Testing

This directory contains the complete OpenAPI 3.0 specification (`swagger.json`) and an interactive **Swagger UI** testing suite designed specifically for Supabase PostgREST, Supabase Auth, and Storage.

---

## 🚀 How to Run and Test Swagger UI

### Option 1: Direct Browser Launch
Open [`index.html`](./index.html) directly in any modern browser (Chrome, Edge, Safari, Firefox).
Or use any local static file server:
```bash
npx serve swagger-ui
```
Then visit `http://localhost:3000`.

---

## 🔑 Step-by-Step API Testing with JSON

### 1. Configure Your Supabase Project
At the top header bar of Swagger UI:
- Enter your Supabase Project URL: `https://your-project-ref.supabase.co`
- Enter your Supabase Public Anon Key: `eyJhbGciOi...`
- Click **"Apply to Swagger"**

---

### 2. Admin Authentication (`POST /auth/v1/token?grant_type=password`)
1. Expand the endpoint `POST /auth/v1/token?grant_type=password`.
2. Click **"Try it out"**.
3. In the JSON request body, enter your admin user credentials:
```json
{
  "email": "admin@shikhon-parts.com",
  "password": "YourSecurePassword2026!"
}
```
4. Click **"Execute"**.
5. Copy the returned `access_token` from the JSON response:
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": { ... }
}
```

---

### 3. Authorize in Swagger UI
1. Click the green **"Authorize"** button at the top-right of the Swagger page.
2. Under **ApiKeyAuth**: enter your Supabase `apikey` (Anon Key).
3. Under **BearerAuth**: enter `Bearer <your_access_token>`.
4. Click **Authorize** and then **Close**.

---

### 4. Fetch Products Catalog (`GET /rest/v1/products?select=*`)
- Publicly accessible by anyone (`anon` and `authenticated`).
- Click **"Try it out"** -> **"Execute"**.
- Returns JSON array of all spare parts:
```json
[
  {
    "id": "e7b0a7cb-77b3-4f9e-a0bf-650e41bf10d1",
    "name_ar": "طقم أقراص فرامل سيراميك بريمبو عالي الأداء",
    "name_en": "Brembo High-Performance Ceramic Brake Discs Kit",
    "image_url": "https://your-project-ref.supabase.co/storage/v1/object/public/product-images/parts/brembo.jpg",
    "category": "Brakes",
    "part_number": "BRM-9942-X",
    "price": 249.99,
    "in_stock": true,
    "created_at": "2026-11-09T14:30:00Z"
  }
]
```

---

### 5. Create a Product via JSON (`POST /rest/v1/products`)
- Header: `Prefer: return=representation`
- JSON Body:
```json
{
  "name_ar": "شاحن توربيني مزدوج Garrett GT3582R معدل",
  "name_en": "Garrett GT3582R Twin-Scroll Performance Turbocharger",
  "image_url": "https://your-project-ref.supabase.co/storage/v1/object/public/product-images/parts/garrett.jpg",
  "category": "Engine",
  "part_number": "GRT-3582-R",
  "price": 899.50,
  "in_stock": true
}
```

---

### 6. Update Product via JSON (`PATCH /rest/v1/products?id=eq.{id}`)
- Path parameter: `id`: `e7b0a7cb-77b3-4f9e-a0bf-650e41bf10d1`
- JSON Body:
```json
{
  "name_ar": "طقم أقراص فرامل سيراميك بريمبو (إصدار معدل)",
  "price": 279.00
}
```

---

### 7. Delete Product (`DELETE /rest/v1/products?id=eq.{id}`)
- Path parameter: `id`: `e7b0a7cb-77b3-4f9e-a0bf-650e41bf10d1`
- Response: `204 No Content`
