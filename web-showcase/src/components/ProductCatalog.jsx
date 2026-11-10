import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ProductModal } from './ProductModal';
import { Eye, MessageCircle, AlertCircle, Tag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <section id="catalog" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Background Water Ambient Blobs for Catalog */}
      <div className="liquid-blob w-[400px] h-[400px] top-1/3 -left-32 bg-gradient-to-r from-orange-400/10 to-amber-200/10" />
      <div className="liquid-blob w-[350px] h-[350px] bottom-10 -right-24 bg-gradient-to-l from-slate-300/20 to-orange-400/10" />

      {/* Header (Midnight Navy #0F172A) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F97316]" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F97316]">
              {t('catalog.title')}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0F172A] tracking-tight">
            {t('catalog.subtitle')}
          </h2>
        </div>

        {/* Counter Badge with Liquid Pill */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="liquid-pill px-4 py-1.5 rounded-full text-xs font-bold text-[#0F172A] self-start md:self-auto cursor-default flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
          <span>{t('catalog.resultsCount', { count: filteredProducts.length })}</span>
        </motion.div>
      </div>

      {/* Category Pills Bar with Fluid Wave transitions */}
      <div id="categories" className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 no-scrollbar relative z-10">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat;
          const label = t(`categories.${cat}`);

          return (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'liquid-button shadow-lg shadow-orange-500/25'
                  : 'liquid-pill text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {label}
            </motion.button>
          );
        })}
      </div>

      {/* Catalog Grid with Staggered Fluid Water Physics */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-80 rounded-2xl liquid-glass animate-pulse p-4 flex flex-col justify-between">
              <div className="w-full h-44 rounded-xl bg-slate-100/80" />
              <div className="space-y-2 mt-4">
                <div className="h-4 bg-slate-200/80 rounded-full w-3/4" />
                <div className="h-3 bg-slate-100 rounded-full w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 px-6 rounded-3xl liquid-glass max-w-md mx-auto relative z-10"
        >
          <AlertCircle className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0F172A] mb-1">
            {t('catalog.noProductsFound')}
          </h3>
          <p className="text-xs text-[#64748B]">
            {t('catalog.tryDifferentSearch')}
          </p>
        </motion.div>
      ) : (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.06 }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10"
        >
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
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.94 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { type: "spring", stiffness: 260, damping: 20 }
                  }
                }}
                className="liquid-glass-card p-4 flex flex-col justify-between group cursor-default"
              >
                {/* Specular glare reflection on each card */}
                <div className="specular-glare opacity-30 pointer-events-none" />

                {/* Top Image Container */}
                <div>
                  <div className="w-full h-48 rounded-xl bg-gradient-to-b from-[#F8FAFC] to-slate-100/60 border border-slate-100 p-3 flex items-center justify-center relative overflow-hidden transition-all duration-300">
                    <img
                      src={product.image_url}
                      alt={displayName}
                      loading="lazy"
                      className="w-full h-full object-contain filter drop-shadow-sm transform transition-transform duration-500 group-hover:scale-108 group-hover:-translate-y-1"
                    />

                    {/* Category Tag with Liquid Meniscus */}
                    <span className="absolute top-2.5 start-2.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-white/95 backdrop-blur-md text-[#0F172A] border border-slate-200 shadow-xs">
                      {product.category || 'General'}
                    </span>

                    {/* In Stock Badge with Pulse */}
                    <span className="absolute top-2.5 end-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {t('catalog.inStock')}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="mt-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Metallic Slate OEM Number (#64748B) */}
                    <div className="text-[10px] font-mono font-semibold text-[#64748B] mb-1 tracking-wider">
                      {partNo}
                    </div>

                    {/* Midnight Navy Title (#0F172A) */}
                    <h3 className="text-sm font-bold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#F97316] transition-colors duration-200">
                      {displayName}
                    </h3>

                    <p className="text-xs text-[#64748B] line-clamp-1 mt-0.5 font-medium">
                      {secondaryName}
                    </p>
                  </div>

                  {/* Actions & Price with Fluid Animation */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    
                    {/* Inspect Details Button with Liquid Pill Hover */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveModalProduct(product)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-200 text-[#0F172A] hover:text-[#F97316] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#F97316]" />
                      <span>{t('catalog.detailsButton')}</span>
                    </motion.button>

                    {/* WhatsApp Quick Order Button (Liquid Button) */}
                    <motion.a
                      whileHover={{ scale: 1.1, rotate: 3 }}
                      whileTap={{ scale: 0.95 }}
                      href={`https://wa.me/201000000000?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl liquid-button flex items-center justify-center cursor-pointer shadow-md shadow-orange-500/20"
                      title={t('catalog.whatsappInquire')}
                    >
                      <MessageCircle className="w-4 h-4 text-white" />
                    </motion.a>

                  </div>
                </div>

              </motion.div>
            );
          })}
        </motion.div>
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
