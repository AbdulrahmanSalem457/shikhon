import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, product, loading }) => {
  const { t, language } = useLanguage();

  if (!isOpen || !product) return null;

  const displayName = language === 'ar' ? product.name_ar : product.name_en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md liquid-glass rounded-3xl p-6 sm:p-7 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-1.5 rounded-full liquid-pill text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/15 border border-red-200 dark:border-red-500/30 flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          {t('deleteModal.title')}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-300 mb-4 leading-relaxed">
          {t('deleteModal.message')}
        </p>

        <div className="p-3 rounded-2xl liquid-pill mb-6 flex items-center gap-3">
          <img
            src={product.image_url}
            alt={displayName}
            className="w-12 h-12 rounded-xl object-contain bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-white/10"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{displayName}</h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              {product.part_number || product.id?.slice(0, 8)}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl liquid-pill text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer"
          >
            {t('deleteModal.cancelBtn')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('deleteModal.confirmBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};