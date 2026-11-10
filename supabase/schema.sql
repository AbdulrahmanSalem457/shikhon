-- ========================================================================
-- SHIKHON (شيخون) - Car Spare Parts Platform
-- Production-Ready Supabase PostgreSQL Schema & Storage Setup
-- ========================================================================

-- 1. Enable UUID Extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create the Products Table
-- Required fields: id, name_ar, name_en, image_url, created_at
-- Plus category, part_number, price, in_stock for a rich showcase experience
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    part_number TEXT DEFAULT NULL,
    price NUMERIC(10, 2) DEFAULT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comment on table and columns
COMMENT ON TABLE public.products IS 'Car spare parts catalog for Shikhon (شيخون) bilingual platform';
COMMENT ON COLUMN public.products.id IS 'Unique identifier for each spare part';
COMMENT ON COLUMN public.products.name_ar IS 'Product name in Arabic';
COMMENT ON COLUMN public.products.name_en IS 'Product name in English';
COMMENT ON COLUMN public.products.image_url IS 'Public URL of the product image from Supabase Storage';
COMMENT ON COLUMN public.products.created_at IS 'Record creation timestamp';

-- 3. Indexes for High Performance Querying & Search
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_name_ar ON public.products (name_ar);
CREATE INDEX IF NOT EXISTS idx_products_name_en ON public.products (name_en);

-- 4. Enable Row-Level Security (RLS) on Products Table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Products Table
-- Policy 1: Public Read Access (Anyone / anon & authenticated can SELECT)
DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
CREATE POLICY "Allow public read access on products"
ON public.products
FOR SELECT
TO anon, authenticated
USING (true);

-- Policy 2: Admin Write Access - INSERT (Only authenticated users)
DROP POLICY IF EXISTS "Allow authenticated insert on products" ON public.products;
CREATE POLICY "Allow authenticated insert on products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 3: Admin Write Access - UPDATE (Only authenticated users)
DROP POLICY IF EXISTS "Allow authenticated update on products" ON public.products;
CREATE POLICY "Allow authenticated update on products"
ON public.products
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 4: Admin Write Access - DELETE (Only authenticated users)
DROP POLICY IF EXISTS "Allow authenticated delete on products" ON public.products;
CREATE POLICY "Allow authenticated delete on products"
ON public.products
FOR DELETE
TO authenticated
USING (true);

-- ========================================================================
-- 6. Supabase Storage Setup: 'product-images' Bucket
-- ========================================================================

-- Create the public bucket if it does not already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    10485760, -- 10MB limit per image
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];

-- Note: storage.objects already has RLS enabled by Supabase by default

-- Storage Policy 1: Public Read Access (Anyone can view car spare parts photos)
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'product-images');

-- Storage Policy 2: Authenticated Upload (Only logged-in admin can upload images)
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Storage Policy 3: Authenticated Update (Only logged-in admin can replace images)
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
CREATE POLICY "Authenticated users can update product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- Storage Policy 4: Authenticated Delete (Only logged-in admin can delete images)
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- ========================================================================
-- 7. Supabase Realtime Replication Setup
-- ========================================================================
-- Add products table to Supabase Realtime publication so Postgres changes
-- are broadcasted automatically over WebSocket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;
END $$;

-- Set Replica Identity to FULL so DELETE payloads include all old columns
ALTER TABLE public.products REPLICA IDENTITY FULL;
