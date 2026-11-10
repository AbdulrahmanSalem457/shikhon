import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { motion } from 'framer-motion';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, product, loading }) => {
  const { t, language } = useLanguage();

  if (!isOpen || !product) return null;

  const displayName = language === 'ar' ? product.name_ar : product.name_en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 25 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="specular-glare opacity-30 pointer-events-none" />

        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 end-4 p-1.5 rounded-full liquid-pill text-[#64748B] hover:text-[#0F172A] cursor-pointer transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </motion.button>

        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mb-4 text-red-600 relative z-10 shadow-xs">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-[#0F172A] mb-2 relative z-10">
          {t('deleteModal.title')}
        </h3>

        <p className="text-xs text-[#64748B] mb-4 leading-relaxed relative z-10">
          {t('deleteModal.message')}
        </p>

        <div className="p-3 rounded-2xl liquid-pill mb-6 flex items-center gap-3 relative z-10">
          <img
            src={product.image_url}
            alt={displayName}
            className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-200 p-1"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-[#0F172A] truncate">{displayName}</h4>
            <span className="text-[11px] text-[#64748B] font-mono">
              {product.part_number || product.id?.slice(0, 8)}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2 relative z-10">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl liquid-pill text-[#64748B] hover:text-[#0F172A] text-xs font-semibold cursor-pointer"
          >
            {t('deleteModal.cancelBtn')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('deleteModal.confirmBtn')}</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
