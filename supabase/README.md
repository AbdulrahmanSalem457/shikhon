# Shikhon (شيخون) - Supabase Setup Guide

This folder contains the complete database migration and storage security configuration for the **Shikhon (شيخون)** car spare parts platform.

---

## 🚀 1-Click Setup in Supabase Dashboard

1. **Log in** to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project (e.g. `shikhon-db`) or select your existing project.
3. Open the **SQL Editor** from the left navigation sidebar.
4. Copy the entire contents of [`schema.sql`](./schema.sql) and paste it into the SQL Editor.
5. Click **Run**.
   - This creates the `products` table with all indexes.
   - Enables Row-Level Security (RLS) with public read and authenticated write rules.
   - Creates the `product-images` storage bucket and configures storage RLS.
6. (Optional) Run [`seed.sql`](./seed.sql) to populate 8 high-performance car spare parts with high-resolution imagery.

---

## 🔐 Row-Level Security (RLS) Summary

| Resource | Operation | Allowed Roles | Rule Condition |
| :--- | :--- | :--- | :--- |
| `public.products` | `SELECT` | `anon`, `authenticated` | `true` (Anyone can view catalog) |
| `public.products` | `INSERT` | `authenticated` | Logged-in Admin only |
| `public.products` | `UPDATE` | `authenticated` | Logged-in Admin only |
| `public.products` | `DELETE` | `authenticated` | Logged-in Admin only |
| `storage.objects (product-images)` | `SELECT` | `anon`, `authenticated` | `bucket_id = 'product-images'` |
| `storage.objects (product-images)` | `INSERT` | `authenticated` | `bucket_id = 'product-images'` |
| `storage.objects (product-images)` | `UPDATE` | `authenticated` | `bucket_id = 'product-images'` |
| `storage.objects (product-images)` | `DELETE` | `authenticated` | `bucket_id = 'product-images'` |

---

## 🔑 Environment Variables

Copy `.env.example` in both `web-showcase` and `desktop-admin` and fill in:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key
```

### To create your first Admin user:
Go to **Supabase Dashboard > Authentication > Users > Add User** and enter your desired Admin email and password.
Then use these credentials to log in to the **Desktop Admin App**.
