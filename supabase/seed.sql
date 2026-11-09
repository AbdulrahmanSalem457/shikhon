-- ========================================================================
-- SHIKHON (شيخون) - Car Spare Parts Initial Seed Data
-- ========================================================================

INSERT INTO public.products (name_ar, name_en, image_url, category, part_number, price, in_stock)
VALUES
(
    'طقم أقراص فرامل سيراميك بريمبو عالي الأداء',
    'Brembo High-Performance Ceramic Brake Discs Kit',
    'https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=800&q=80',
    'Brakes',
    'BRM-9942-X',
    249.99,
    true
),
(
    'شاحن توربيني مزدوج Garrett GT3582R معدل',
    'Garrett GT3582R Twin-Scroll Performance Turbocharger',
    'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=800&q=80',
    'Engine',
    'GRT-3582-R',
    899.50,
    true
),
(
    'طقم شمعات إشعال إيريديوم بوش بلاتينيوم (4 قطع)',
    'Bosch Platinum Iridium Spark Plugs Set of 4',
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    'Electrical',
    'BSH-7491-IR',
    48.00,
    true
),
(
    'مساعدين ممتص صدمات هيدروليكي بيلشتاين B6 سبورت',
    'Bilstein B6 Sport Hydraulic Front Shock Absorber',
    'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    'Suspension',
    'BIL-B6-8802',
    185.00,
    true
),
(
    'مصباح أمامي ذكي تفاعلي Matrix LED كامل الوظائف',
    'Full Adaptive Matrix LED Headlight Assembly',
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
    'Lighting',
    'LED-MTX-770',
    420.00,
    true
),
(
    'فلتر هواء رياضي عالي التدفق K&N قابل للغسيل',
    'K&N High-Flow Washable Cold Air Intake Filter',
    'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=800&q=80',
    'Engine',
    'KN-57-0480',
    75.00,
    true
),
(
    'دينامو شحن تيار متردد عالي القدرة 140 أمبير',
    'High-Output 140A Automotive Alternator Generator',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    'Electrical',
    'ALT-140-DEN',
    160.00,
    true
),
(
    'رادياتير تبريد محرك ألومنيوم ثلاثي الطبقات',
    'All-Aluminum Triple-Core Engine Cooling Radiator',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    'Cooling',
    'RAD-3C-ALUM',
    195.00,
    true
)
ON CONFLICT DO NOTHING;
