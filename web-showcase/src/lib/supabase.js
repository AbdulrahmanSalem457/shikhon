import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-ref')
);

// Fallback seed catalog when Supabase credentials are not configured yet
export const FALLBACK_PRODUCTS = [
  {
    id: '1',
    name_ar: 'طقم أقراص فرامل سيراميك بريمبو عالي الأداء',
    name_en: 'Brembo High-Performance Ceramic Brake Discs Kit',
    image_url: 'https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=800&q=80',
    category: 'Brakes',
    part_number: 'BRM-9942-X',
    price: 249.99,
    in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name_ar: 'شاحن توربيني مزدوج Garrett GT3582R معدل',
    name_en: 'Garrett GT3582R Twin-Scroll Performance Turbocharger',
    image_url: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=800&q=80',
    category: 'Engine',
    part_number: 'GRT-3582-R',
    price: 899.50,
    in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name_ar: 'طقم شمعات إشعال إيريديوم بوش بلاتينيوم (4 قطع)',
    name_en: 'Bosch Platinum Iridium Spark Plugs Set of 4',
    image_url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    category: 'Electrical',
    part_number: 'BSH-7491-IR',
    price: 48.00,
    in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name_ar: 'مساعدين ممتص صدمات هيدروليكي بيلشتاين B6 سبورت',
    name_en: 'Bilstein B6 Sport Hydraulic Front Shock Absorber',
    image_url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    category: 'Suspension',
    part_number: 'BIL-B6-8802',
    price: 185.00,
    in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name_ar: 'مصباح أمامي ذكي تفاعلي Matrix LED كامل الوظائف',
    name_en: 'Full Adaptive Matrix LED Headlight Assembly',
    image_url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
    category: 'Lighting',
    part_number: 'LED-MTX-770',
    price: 420.00,
    in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    name_ar: 'فلتر هواء رياضي عالي التدفق K&N قابل للغسيل',
    name_en: 'K&N High-Flow Washable Cold Air Intake Filter',
    image_url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=800&q=80',
    category: 'Engine',
    part_number: 'KN-57-0480',
    price: 75.00,
    in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: '7',
    name_ar: 'دينامو شحن تيار متردد عالي القدرة 140 أمبير',
    name_en: 'High-Output 140A Automotive Alternator Generator',
    image_url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    category: 'Electrical',
    part_number: 'ALT-140-DEN',
    price: 160.00,
    in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: '8',
    name_ar: 'رادياتير تبريد محرك ألومنيوم ثلاثي الطبقات',
    name_en: 'All-Aluminum Triple-Core Engine Cooling Radiator',
    image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    category: 'Cooling',
    part_number: 'RAD-3C-ALUM',
    price: 195.00,
    in_stock: true,
    created_at: new Date().toISOString()
  }
];

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
