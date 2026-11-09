import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
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
    <section id="catalog" className="relative py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-cyan-400">
              {t('catalog.title')}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {t('catalog.subtitle')}
          </h2>
        </div>

        {/* Counter Badge */}
        <div className="liquid-pill px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 self-start md:self-auto">
          {t('catalog.resultsCount', { count: filteredProducts.length })}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div id="categories" className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat;
          const label = t(`categories.${cat}`);

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-sky-500 dark:bg-cyan-500 text-white shadow-sm'
                  : 'liquid-pill text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-72 rounded-2xl liquid-glass animate-pulse p-4 flex flex-col justify-between">
              <div className="w-full h-36 rounded-xl bg-slate-200/50 dark:bg-white/5" />
              <div className="space-y-2">
                <div className="h-3.5 bg-slate-200/60 dark:bg-white/10 rounded-full w-3/4" />
                <div className="h-2.5 bg-slate-200/40 dark:bg-white/5 rounded-full w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl liquid-glass max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">
            {t('catalog.noProductsFound')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('catalog.tryDifferentSearch')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="liquid-glass-card rounded-2xl overflow-hidden flex flex-col justify-between group"
              >
                <div className="specular-glare" />

                {/* Top Image Container */}
                <div className="p-3.5 pb-0 flex items-center justify-center">
                  <div className="w-full h-44 rounded-xl bg-slate-100 dark:bg-slate-950/60 p-3 flex items-center justify-center relative overflow-hidden transition-all duration-300">
                    <img
                      src={product.image_url}
                      alt={displayName}
                      loading="lazy"
                      className="w-full h-full object-contain filter drop-shadow-sm transform transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Category Tag */}
                    <span className="absolute top-2.5 start-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-white/80 dark:bg-black/60 backdrop-blur-md text-sky-700 dark:text-cyan-300 border border-slate-200/50 dark:border-white/10">
                      {product.category || 'General'}
                    </span>

                    {/* In Stock Badge */}
                    <span className="absolute top-2.5 end-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {t('catalog.inStock')}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500 mb-1">
                      {partNo}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-cyan-300 transition-colors">
                      {displayName}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-medium">
                      {secondaryName}
                    </p>
                  </div>

                  {/* Actions & Price */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
                    
                    {/* Inspect Details Button */}
                    <button
                      onClick={() => setActiveModalProduct(product)}
                      className="flex-1 py-1.5 px-2.5 rounded-xl liquid-pill hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                      <span>{t('catalog.detailsButton')}</span>
                    </button>

                    {/* WhatsApp Quick Order */}
                    <a
                      href={`https://wa.me/201000000000?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-300 transition-colors"
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
