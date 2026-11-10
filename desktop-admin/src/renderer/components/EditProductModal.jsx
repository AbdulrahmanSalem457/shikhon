import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { uploadImageApi } from '../api/storageApi';
import { updateProductApi } from '../api/productsApi';
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

  // Sync state whenever selected product changes or modal opens
  useEffect(() => {
    if (product) {
      setNameAr(product.name_ar || '');
      setNameEn(product.name_en || '');
      setCategory(product.category || 'Brakes');
      setPartNumber(product.part_number || '');
      setPrice(product.price !== null && product.price !== undefined ? product.price : '');
      setImagePreview(product.image_url || '');
      setImageFile(null);
      setErrorMessage('');
    }
  }, [product, isOpen]);

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

      // If user selected a new image file, upload via Storage API
      if (imageFile) {
        const uploadRes = await uploadImageApi(imageFile);
        updatedImageUrl = uploadRes.publicUrl;
      }

      const updatedFields = {
        name_ar: nameAr.trim(),
        name_en: nameEn.trim(),
        image_url: updatedImageUrl,
        category,
        part_number: partNumber.trim() || null,
        price: price ? parseFloat(price) : null,
      };

      // Call PATCH /rest/v1/products?id=eq.{id} API
      const updatedProduct = await updateProductApi(product.id, updatedFields);
      onProductUpdated(updatedProduct);
      onClose();
    } catch (err) {
      console.error('Update error:', err);
      setErrorMessage(err.message || t('messages.errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1.5 rounded-full bg-[#F8FAFC] border border-slate-200 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-black text-[#0F172A] mb-4">
          {t('form.editTitle')}
        </h2>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image & preview */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-contain rounded-xl bg-white border border-slate-200 p-1"
            />
            <div className="flex-1">
              <span className="text-xs font-semibold text-[#0F172A] block mb-1">
                {t('form.replaceImageText')}
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[#0F172A] hover:border-[#F97316] hover:text-[#F97316] text-xs font-medium cursor-pointer transition-colors"
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
                <label className="text-xs font-bold text-[#0F172A]">
                  {t('form.nameArLabel')}
                </label>
                <button
                  type="button"
                  onClick={copyArToEn}
                  className="text-[11px] text-[#F97316] hover:underline flex items-center gap-1 cursor-pointer font-medium"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-300 text-xs text-[#0F172A] font-medium focus:border-[#F97316] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#0F172A]">
                  {t('form.nameEnLabel')}
                </label>
                <button
                  type="button"
                  onClick={copyEnToAr}
                  className="text-[11px] text-[#F97316] hover:underline flex items-center gap-1 cursor-pointer font-medium"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-300 text-xs text-[#0F172A] font-medium focus:border-[#F97316] focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Category, Part No, Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1.5">
                {t('form.categoryLabel')}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-300 text-xs text-[#0F172A] focus:border-[#F97316] focus:bg-white focus:outline-none transition-all"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1.5">
                {t('form.partNumberLabel')}
              </label>
              <input
                type="text"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-300 text-xs font-mono text-[#0F172A] focus:border-[#F97316] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1.5">
                {t('form.priceLabel')}
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-300 text-xs text-[#0F172A] focus:border-[#F97316] focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 text-xs font-semibold cursor-pointer transition-colors"
            >
              {t('form.cancelBtn')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/25 cursor-pointer transition-all"
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
