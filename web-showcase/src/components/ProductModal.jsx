import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, Check, Copy, MessageCircle, Phone, Tag, ShieldCheck, Layers } from 'lucide-react';
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
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-3xl rounded-3xl liquid-glass border border-white/25 overflow-hidden shadow-2xl z-10 my-8"
        >
          {/* Top specular highlight glare */}
          <div className="specular-glare" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white flex items-center justify-center transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Image Preview Area */}
            <div className="relative bg-slate-950/70 p-6 flex items-center justify-center min-h-[300px] border-b md:border-b-0 md:border-r border-white/10">
              <img
                src={product.image_url}
                alt={displayName}
                className="w-full h-auto max-h-[320px] object-contain rounded-2xl filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-400 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>100% Genuine OEM</span>
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {t('catalog.inStock')}
                </span>
              </div>
            </div>

            {/* Content Details Area */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                
                {/* Category & Tag */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {product.category || 'General'}
                  </span>
                  <span className="text-xs text-slate-400">
                    ID: {product.id ? product.id.slice(0, 8) : 'NEW'}
                  </span>
                </div>

                {/* Main Product Name */}
                <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {displayName}
                </h2>

                {/* Subtitle / Alternate Language Name */}
                <p className="text-sm text-slate-400 mt-1 font-medium">
                  {secondaryName}
                </p>

                {/* Part Number Box */}
                <div className="mt-5 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      {t('modal.partNumber')}
                    </span>
                    <span className="font-mono text-sm font-bold text-cyan-300">
                      {partNumber}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyPartNumber}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors flex items-center gap-1 text-xs"
                    title={t('modal.copyPartNumber')}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">{t('modal.copied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-300" />
                      </>
                    )}
                  </button>
                </div>

                {/* Price Display */}
                {product.price && (
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-xs text-slate-400">{t('modal.price')}:</span>
                    <span className="text-2xl font-black text-white">
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
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('modal.orderViaWhatsapp')}</span>
                </a>

                <div className="flex gap-2">
                  <a
                    href="tel:+201000000000"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t('modal.callStore')}</span>
                  </a>

                  <button
                    onClick={onClose}
                    className="py-2.5 px-5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white text-xs font-semibold transition-colors"
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
