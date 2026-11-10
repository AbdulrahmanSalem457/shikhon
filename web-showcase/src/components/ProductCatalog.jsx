import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { normalizeImageUrl } from '../lib/imageUtils';
import { ProductModal } from './ProductModal';
import { Eye, MessageCircle, AlertCircle, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  'All',
  'Brakes',
  'Engine',
  'Suspension',
  'Electrical',
  'Lighting',
  'Cooling'
];

export const ProductCatalog = ({ products, loading, error, searchQuery }) => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalProduct, setActiveModalProduct] = useState(null);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || 
      (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase());

    if (!searchQuery.trim()) return matchesCategory;

    const query = searchQuery.toLowerCase().trim();
    const matchAr = product.name_ar ? product.name_ar.toLowerCase().includes(query) : false;
    const matchEn = product.name_en ? product.name_en.toLowerCase().includes(query) : false;
    const matchCategory = product.category ? product.category.toLowerCase().includes(query) : false;
    const matchPartNo = product.part_number ? product.part_number.toLowerCase().includes(query) : false;

    return matchesCategory && (matchAr || matchEn || matchCategory || matchPartNo);
  });

  return (
    <section id="catalog" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full max-w-full overflow-hidden">
      
      {/* Header (Midnight Navy #0F172A in light, Soft Ice White #F8FAFC in dark) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6 w-full">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] animate-pulse shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F97316]">
              {t('catalog.title')}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC]">
            {t('catalog.subtitle')}
          </h2>
        </div>

        {/* Counter Badge */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] shadow-sm self-start md:self-auto shrink-0 transition-colors">
          {t('catalog.resultsCount', { count: filteredProducts.length })}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div id="categories" className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar w-full max-w-full touch-pan-x">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat;
          const label = t(`categories.${cat}`);

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-md shadow-orange-500/20'
                  : 'bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:border-orange-300 dark:hover:border-orange-500/40 shadow-sm'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-72 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] animate-pulse p-4 flex flex-col justify-between shadow-sm w-full">
              <div className="w-full h-36 rounded-xl bg-slate-100 dark:bg-slate-800" />
              <div className="space-y-2">
                <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4" />
                <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] shadow-sm max-w-md mx-auto w-full transition-colors">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
            {t('catalog.noProductsFound')}
          </h3>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            {t('catalog.tryDifferentSearch')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
          {filteredProducts.map((product, idx) => {
            const displayName = language === 'ar' ? product.name_ar : product.name_en;
            const secondaryName = language === 'ar' ? product.name_en : product.name_ar;
            const partNo = product.part_number || 'SHK-' + (product.id ? product.id.slice(0, 6).toUpperCase() : idx);

            const whatsappMessage = encodeURIComponent(
              language === 'ar'
                ? `مرحباً شيخون، أرغب في الاستفسار عن: ${product.name_ar} (رقم: ${partNo})`
                : `Hello Shikhon, inquiring about: ${product.name_en} (Part #: ${partNo})`
            );

            return (
              <motion.div
                key={product.id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="liquid-glass-card rounded-2xl overflow-hidden flex flex-col justify-between group w-full"
              >
                {/* Top Image Container */}
                <div className="p-3.5 pb-0 flex items-center justify-center w-full">
                  <div className="w-full h-44 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-100 dark:border-[#1E293B] p-3 flex items-center justify-center relative overflow-hidden transition-all duration-300">
                    <img
                      src={normalizeImageUrl(product.image_url)}
                      alt={displayName}
                      loading="lazy"
                      className="w-full h-full object-contain filter drop-shadow-sm transform transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Category Tag */}
                    <span className="absolute top-2.5 start-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md text-[#0F172A] dark:text-[#F8FAFC] border border-slate-200 dark:border-[#1E293B] shadow-xs">
                      {product.category || 'General'}
                    </span>

                    {/* In Stock Badge */}
                    <span className="absolute top-2.5 end-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {t('catalog.inStock')}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Metallic Slate OEM Number (#64748B in light, #94A3B8 in dark) */}
                    <div className="text-[10px] font-mono font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1">
                      {partNo}
                    </div>

                    {/* Product Title (#0F172A in light, Soft Ice White #F8FAFC in dark) */}
                    <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] leading-snug line-clamp-2 group-hover:text-[#F97316] dark:group-hover:text-[#FB923C] transition-colors">
                      {displayName}
                    </h3>

                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] line-clamp-1 mt-0.5 font-medium">
                      {secondaryName}
                    </p>
                  </div>

                  {/* Actions & Price */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1E293B] flex items-center justify-between gap-2">
                    
                    {/* Inspect Details Button */}
                    <button
                      onClick={() => setActiveModalProduct(product)}
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#F97316]" />
                      <span>{t('catalog.detailsButton')}</span>
                    </button>

                    {/* WhatsApp Quick Order Button (Vibrant Orange Accent #F97316) */}
                    <a
                      href={`https://wa.me/201000000000?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/40 border border-orange-200 dark:border-orange-800/40 text-[#F97316] dark:text-[#FB923C] transition-colors"
                      title={t('catalog.whatsappInquire')}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>

                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductModal
        product={activeModalProduct}
        isOpen={Boolean(activeModalProduct)}
        onClose={() => setActiveModalProduct(null)}
      />

    </section>
  );
};
