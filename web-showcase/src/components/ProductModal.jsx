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
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Container (#FFFFFF with #E2E8F0 Border) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F172A] flex items-center justify-center transition-all cursor-pointer`}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Image Preview Area */}
            <div className="relative bg-slate-50 p-8 flex items-center justify-center min-h-[300px] border-b md:border-b-0 md:border-r border-slate-200">
              <img
                src={product.image_url}
                alt={displayName}
                className="w-full h-auto max-h-[300px] object-contain rounded-2xl filter drop-shadow-md"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs bg-white/95 border border-slate-200 px-3 py-1.5 rounded-full text-[#64748B] shadow-xs">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>100% Genuine OEM</span>
                </span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
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
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 border border-orange-200 text-[#F97316] flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {product.category || 'General'}
                  </span>
                  <span className="text-xs text-[#94A3B8] font-mono">
                    ID: {product.id ? product.id.slice(0, 8) : 'NEW'}
                  </span>
                </div>

                {/* Main Product Name (Midnight Navy #0F172A) */}
                <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] leading-snug">
                  {displayName}
                </h2>

                {/* Subtitle / Alternate Language Name */}
                <p className="text-sm text-[#64748B] mt-1 font-medium">
                  {secondaryName}
                </p>

                {/* Part Number Box (Metallic Slate #64748B + Orange Accent) */}
                <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#64748B] block font-medium">
                      {t('modal.partNumber')}
                    </span>
                    <span className="font-mono text-sm font-bold text-[#F97316]">
                      {partNumber}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyPartNumber}
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:border-orange-300 text-[#0F172A] transition-all flex items-center gap-1 text-xs cursor-pointer shadow-xs"
                    title={t('modal.copyPartNumber')}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-600 font-semibold">{t('modal.copied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#64748B]" />
                      </>
                    )}
                  </button>
                </div>

                {/* Price Display */}
                {product.price && (
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-xs text-[#64748B] font-medium">{t('modal.price')}:</span>
                    <span className="text-2xl font-black text-[#0F172A]">
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
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#FB923C] hover:to-[#EA580C] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('modal.orderViaWhatsapp')}</span>
                </a>

                <div className="flex gap-2">
                  <a
                    href="tel:+201000000000"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#F97316]" />
                    <span>{t('modal.callStore')}</span>
                  </a>

                  <button
                    onClick={onClose}
                    className="py-2.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#64748B] hover:text-[#0F172A] text-xs font-semibold transition-colors cursor-pointer"
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
