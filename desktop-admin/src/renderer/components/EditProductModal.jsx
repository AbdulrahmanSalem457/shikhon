import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { uploadImageToStorage, supabase } from '../lib/supabase';
import { X, UploadCloud, Check, AlertCircle, ArrowLeftRight, Loader2 } from 'lucide-react';

const CATEGORIES = [
  'Brakes',
  'Engine',
  'Suspension',
  'Electrical',
  'Lighting',
  'Cooling',
  'General'
];

export const EditProductModal = ({ product, isOpen, onClose, onProductUpdated, isDemo }) => {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);

  const [nameAr, setNameAr] = useState(product?.name_ar || '');
  const [nameEn, setNameEn] = useState(product?.name_en || '');
  const [category, setCategory] = useState(product?.category || 'Brakes');
  const [partNumber, setPartNumber] = useState(product?.part_number || '');
  const [price, setPrice] = useState(product?.price || '');

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image_url || '');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !product) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const copyArToEn = () => { if (nameAr) setNameEn(nameAr); };
  const copyEnToAr = () => { if (nameEn) setNameAr(nameEn); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!nameAr.trim() || !nameEn.trim()) {
      setErrorMessage(t('form.validationNameRequired'));
      return;
    }

    try {
      setLoading(true);
      let updatedImageUrl = product.image_url;

      // If user selected a new image file
      if (imageFile) {
        if (supabase) {
          const { publicUrl } = await uploadImageToStorage(imageFile);
          updatedImageUrl = publicUrl;
        } else {
          updatedImageUrl = imagePreview;
        }
      }

      const updatedFields = {
        name_ar: nameAr.trim(),
        name_en: nameEn.trim(),
        image_url: updatedImageUrl,
        category,
        part_number: partNumber.trim() || null,
        price: price ? parseFloat(price) : null,
      };

      if (supabase) {
        const { data, error } = await supabase
          .from('products')
          .update(updatedFields)
          .eq('id', product.id)
          .select()
          .single();

        if (error) throw error;
        onProductUpdated(data);
      } else {
        onProductUpdated({ ...product, ...updatedFields });
      }

      onClose();
    } catch (err) {
      console.error('Update error:', err);
      setErrorMessage(err.message || t('messages.errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl liquid-glass rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl my-8">
        
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-black text-white mb-4">
          {t('form.editTitle')}
        </h2>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image & preview */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-black/40 border border-white/10">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-contain rounded-xl bg-slate-900 border border-white/10"
            />
            <div className="flex-1">
              <span className="text-xs font-semibold text-slate-300 block mb-1">
                {t('form.replaceImageText')}
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium"
              >
                تغيير الصورة
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Bilingual Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {t('form.nameArLabel')}
                </label>
                <button
                  type="button"
                  onClick={copyArToEn}
                  className="text-[11px] text-cyan-400 flex items-center gap-1"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                </button>
              </div>
              <input
                type="text"
                required
                dir="rtl"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {t('form.nameEnLabel')}
                </label>
                <button
                  type="button"
                  onClick={copyEnToAr}
                  className="text-[11px] text-cyan-400 flex items-center gap-1"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                </button>
              </div>
              <input
                type="text"
                required
                dir="ltr"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs"
              />
            </div>
          </div>

          {/* Category, Part No, Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {t('form.categoryLabel')}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-white text-xs bg-slate-900"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {t('form.partNumberLabel')}
              </label>
              <input
                type="text"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {t('form.priceLabel')}
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
            >
              {t('form.cancelBtn')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>{t('form.updateBtn')}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
