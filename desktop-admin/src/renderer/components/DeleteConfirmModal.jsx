import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, product, loading }) => {
  const { t, language } = useLanguage();

  if (!isOpen || !product) return null;

  const displayName = language === 'ar' ? product.name_ar : product.name_en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md liquid-glass rounded-3xl p-6 sm:p-7 border border-red-500/30 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mb-4 text-red-400">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white mb-2">
          {t('deleteModal.title')}
        </h3>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          {t('deleteModal.message')}
        </p>

        <div className="p-3 rounded-2xl bg-black/40 border border-white/10 mb-6 flex items-center gap-3">
          <img
            src={product.image_url}
            alt={displayName}
            className="w-12 h-12 rounded-xl object-contain bg-slate-900 border border-white/10"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{displayName}</h4>
            <span className="text-[11px] text-slate-400 font-mono">
              {product.part_number || product.id?.slice(0, 8)}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
          >
            {t('deleteModal.cancelBtn')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-red-600/30"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('deleteModal.confirmBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
