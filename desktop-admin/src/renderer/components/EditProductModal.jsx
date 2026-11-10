import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { uploadImageApi } from '../api/storageApi';
import { updateProductApi } from '../api/productsApi';
import { X, UploadCloud, Check, AlertCircle, ArrowLeftRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 25 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 overflow-hidden"
      >
        <div className="specular-glare opacity-30 pointer-events-none" />

        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-5 end-5 p-1.5 rounded-full liquid-pill text-[#64748B] hover:text-[#0F172A] cursor-pointer transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </motion.button>

        <h2 className="text-xl font-black text-[#0F172A] mb-4 relative z-10">
          {t('form.editTitle')}
        </h2>

        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 relative z-10"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Image & preview */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl liquid-pill">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-contain rounded-xl bg-white border border-slate-200 p-1 shadow-sm"
            />
            <div className="flex-1">
              <span className="text-xs font-semibold text-[#0F172A] block mb-1">
                {t('form.replaceImageText')}
              </span>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[#0F172A] hover:border-[#F97316] hover:text-[#F97316] text-xs font-medium cursor-pointer shadow-xs transition-colors"
              >
                تغيير الصورة
              </motion.button>
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
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-medium"
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
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-medium"
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
                className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
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
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono"
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
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl liquid-pill text-[#64748B] hover:text-[#0F172A] text-xs font-semibold cursor-pointer"
            >
              {t('form.cancelBtn')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl liquid-button text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-orange-500/25 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 text-white" />}
              <span>{t('form.updateBtn')}</span>
            </motion.button>
          </div>
        </form>

      </motion.div>
    </div>
  );
};
