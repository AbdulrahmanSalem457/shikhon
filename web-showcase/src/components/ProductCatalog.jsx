import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ProductModal } from './ProductModal';
import { 
  Eye, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  ExternalLink 
} from 'lucide-react';
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
  const { language, t, isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalProduct, setActiveModalProduct] = useState(null);

  // Filter products by category and bilingual search query
  const filteredProducts = products.filter(product => {
    // 1. Category check
    const matchesCategory = selectedCategory === 'All' || 
      (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase());

    // 2. Bilingual Search check across name_ar, name_en, and part_number
    if (!searchQuery.trim()) return matchesCategory;

    const query = searchQuery.toLowerCase().trim();
    const matchAr = product.name_ar ? product.name_ar.toLowerCase().includes(query) : false;
    const matchEn = product.name_en ? product.name_en.toLowerCase().includes(query) : false;
    const matchCategory = product.category ? product.category.toLowerCase().includes(query) : false;
    const matchPartNo = product.part_number ? product.part_number.toLowerCase().includes(query) : false;

    return matchesCategory && (matchAr || matchEn || matchCategory || matchPartNo);
  });

  return (
    <section id="catalog" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              {t('catalog.title')}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {t('catalog.subtitle')}
          </h2>
        </div>

        {/* Counter Badge */}
        <div className="liquid-pill px-4 py-2 rounded-2xl text-xs font-bold text-slate-300 self-start md:self-auto border border-white/10">
          {t('catalog.resultsCount', { count: filteredProducts.length })}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div id="categories" className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat;
          const label = t(`categories.${cat}`);

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/40 scale-105'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/10'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="h-80 rounded-3xl liquid-glass animate-pulse border border-white/10 p-5 flex flex-col justify-between">
              <div className="w-full h-44 rounded-2xl bg-white/5" />
              <div className="space-y-2.5">
                <div className="h-4 bg-white/10 rounded-full w-3/4" />
                <div className="h-3 bg-white/5 rounded-full w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-3xl liquid-glass border border-white/15 max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4 opacity-60" />
          <h3 className="text-lg font-bold text-white mb-1">
            {t('catalog.noProductsFound')}
          </h3>
          <p className="text-sm text-slate-400">
            {t('catalog.tryDifferentSearch')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="liquid-glass-card rounded-3xl overflow-hidden flex flex-col justify-between group"
              >
                {/* Specular glare reflection */}
                <div className="specular-glare" />

                {/* Top Image Container */}
                <div className="relative p-5 pb-0 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-48 rounded-2xl bg-slate-950/60 p-4 flex items-center justify-center relative overflow-hidden border border-white/10 group-hover:border-cyan-500/30 transition-all duration-300">
                    
                    {/* Backlight halo on hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <img
                      src={product.image_url}
                      alt={displayName}
                      loading="lazy"
                      className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] transform transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Category Floating Pill */}
                    <span className="absolute top-2.5 start-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-black/60 backdrop-blur-md border border-white/15 text-cyan-300">
                      {product.category || 'General'}
                    </span>

                    {/* Stock Indicator */}
                    <span className="absolute top-2.5 end-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md border border-white/15 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {t('catalog.inStock')}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Part Number Tag */}
                    <div className="text-[11px] font-mono font-semibold text-slate-400 tracking-wider mb-1.5">
                      {partNo}
                    </div>

                    {/* Primary Name according to active language */}
                    <h3 className="text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-cyan-200 transition-colors">
                      {displayName}
                    </h3>

                    {/* Secondary name in small font */}
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-medium">
                      {secondaryName}
                    </p>
                  </div>

                  {/* Actions & Price */}
                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    
                    {/* Inspect Details Button */}
                    <button
                      onClick={() => setActiveModalProduct(product)}
                      className="flex-1 py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{t('catalog.detailsButton')}</span>
                    </button>

                    {/* Direct WhatsApp Quick Inquiry */}
                    <a
                      href={`https://wa.me/201000000000?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 transition-colors"
                      title={t('catalog.whatsappInquire')}
                    >
                      <MessageCircle className="w-4 h-4" />
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
