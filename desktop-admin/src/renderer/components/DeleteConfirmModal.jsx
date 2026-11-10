import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, product, loading }) => {
  const { t, language } = useLanguage();

  if (!isOpen || !product) return null;

  const displayName = language === 'ar' ? product.name_ar : product.name_en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-[#1E293B] transition-colors">
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-1.5 rounded-full bg-[#F8FAFC] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">
          {t('deleteModal.title')}
        </h3>

        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-4 leading-relaxed">
          {t('deleteModal.message')}
        </p>

        <div className="p-3 rounded-2xl bg-[#F8FAFC] dark:bg-[#090D16] border border-slate-200 dark:border-[#1E293B] mb-6 flex items-center gap-3">
          <img
            src={product.image_url}
            alt={displayName}
            className="w-12 h-12 rounded-xl object-contain bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] p-1"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">{displayName}</h4>
            <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono">
              {product.part_number || product.id?.slice(0, 8)}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] text-xs font-semibold cursor-pointer transition-colors"
          >
            {t('deleteModal.cancelBtn')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('deleteModal.confirmBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
