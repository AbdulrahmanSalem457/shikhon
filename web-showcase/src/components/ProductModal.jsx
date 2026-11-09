import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, Check, Copy, MessageCircle, Phone, Tag, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductModal = ({ product, isOpen, onClose }) => {
  const { language, t, isRTL } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const displayName = language === 'ar' ? product.name_ar : product.name_en;
  const secondaryName = language === 'ar' ? product.name_en : product.name_ar;
  const partNumber = product.part_number || 'SHK-' + (product.id ? product.id.slice(0, 8).toUpperCase() : '9000');

  const handleCopyPartNumber = () => {
    navigator.clipboard.writeText(partNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    language === 'ar'
      ? `مرحباً شيخون، أود الاستفسار وطلب قطعة الغيار:\n- الاسم: ${product.name_ar}\n- رقم القطعة: ${partNumber}`
      : `Hello Shikhon, I would like to inquire about ordering:\n- Part: ${product.name_en}\n- Part #: ${partNumber}`
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Calm Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/75 backdrop-blur-md"
        />

        {/* Modal Liquid Glass Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl rounded-3xl liquid-glass overflow-hidden z-10 my-8"
        >
          {/* Top specular highlight glare */}
          <div className="specular-glare" />

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-20 w-9 h-9 rounded-full liquid-pill hover:scale-105 text-slate-600 dark:text-white flex items-center justify-center transition-all`}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Image Preview Area */}
            <div className="relative bg-slate-100/70 dark:bg-slate-950/60 p-8 flex items-center justify-center min-h-[300px] border-b md:border-b-0 md:border-r border-slate-200/80 dark:border-white/10">
              <img
                src={product.image_url}
                alt={displayName}
                className="w-full h-auto max-h-[300px] object-contain rounded-2xl filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs liquid-pill px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                  <span>100% Genuine OEM</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {t('catalog.inStock')}
                </span>
              </div>
            </div>

            {/* Content Details Area */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                
                {/* Category & Tag */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 dark:bg-cyan-500/15 border border-sky-500/20 dark:border-cyan-500/30 text-sky-600 dark:text-cyan-300 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {product.category || 'General'}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    ID: {product.id ? product.id.slice(0, 8) : 'NEW'}
                  </span>
                </div>

                {/* Main Product Name */}
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                  {displayName}
                </h2>

                {/* Subtitle / Alternate Language Name */}
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {secondaryName}
                </p>

                {/* Part Number Box */}
                <div className="mt-5 p-3.5 rounded-2xl liquid-pill flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                      {t('modal.partNumber')}
                    </span>
                    <span className="font-mono text-sm font-bold text-sky-600 dark:text-cyan-300">
                      {partNumber}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyPartNumber}
                    className="p-2 rounded-xl liquid-pill hover:border-sky-400/50 text-slate-600 dark:text-slate-200 transition-all flex items-center gap-1 text-xs cursor-pointer"
                    title={t('modal.copyPartNumber')}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{t('modal.copied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Price Display */}
                {product.price && (
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('modal.price')}:</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      ${product.price}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-2.5">
                <a
                  href={`https://wa.me/201000000000?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('modal.orderViaWhatsapp')}</span>
                </a>

                <div className="flex gap-2">
                  <a
                    href="tel:+201000000000"
                    className="flex-1 py-2.5 px-3 rounded-xl liquid-pill text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors hover:border-sky-400/50"
                  >
                    <Phone className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                    <span>{t('modal.callStore')}</span>
                  </a>

                  <button
                    onClick={onClose}
                    className="py-2.5 px-5 rounded-xl liquid-pill text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {t('modal.close')}
                  </button>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};