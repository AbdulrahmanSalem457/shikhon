import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { uploadImageApi } from '../api/storageApi';
import { createProductApi } from '../api/productsApi';
import { 
  X, 
  UploadCloud, 
  Check, 
  AlertCircle, 
  ArrowLeftRight, 
  Loader2 
} from 'lucide-react';
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

export const AddProductModal = ({ isOpen, onClose, onProductAdded, isDemo }) => {
  const { t, isRTL } = useLanguage();
  const fileInputRef = useRef(null);

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState('Brakes');
  const [partNumber, setPartNumber] = useState('');
  const [price, setPrice] = useState('');
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Reset all input fields and images to completely clean state
  const resetForm = () => {
    setNameAr('');
    setNameEn('');
    setCategory('Brakes');
    setPartNumber('');
    setPrice('');
    setImageFile(null);
    setImagePreview('');
    setIsDragging(false);
    setLoading(false);
    setStatusMessage('');
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Reset every time the modal is opened
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  // Image Selection Handlers
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrorMessage('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const copyArToEn = () => {
    if (nameAr) setNameEn(nameAr);
  };

  const copyEnToAr = () => {
    if (nameEn) setNameAr(nameEn);
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setStatusMessage('');

    if (!nameAr.trim() || !nameEn.trim()) {
      setErrorMessage(t('form.validationNameRequired'));
      return;
    }

    if (!imageFile) {
      setErrorMessage(t('form.validationImageRequired'));
      return;
    }

    try {
      setLoading(true);

      // Upload Image
      setStatusMessage(t('form.uploadingImage'));
      const uploadRes = await uploadImageApi(imageFile);
      const publicImageUrl = uploadRes.publicUrl;

      // Insert Record
      setStatusMessage(t('form.savingProduct'));
      const productPayload = {
        name_ar: nameAr.trim(),
        name_en: nameEn.trim(),
        image_url: publicImageUrl,
        category,
        part_number: partNumber.trim() || null,
        price: price ? parseFloat(price) : null,
        in_stock: true
      };

      const newProduct = await createProductApi(productPayload);

      onProductAdded(newProduct);
      handleClose();

    } catch (err) {
      console.error('[Add Product Error]:', err);
      setErrorMessage(err.message || t('messages.errorOccurred'));
    } finally {
      setLoading(false);
      setStatusMessage('');
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

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClose}
          className="absolute top-5 end-5 p-1.5 rounded-full liquid-pill text-[#64748B] hover:text-[#0F172A] cursor-pointer transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* Modal Title */}
        <div className="relative z-10">
          <h2 className="text-xl font-black text-[#0F172A] mb-1">
            {t('form.addNewTitle')}
          </h2>
          <p className="text-xs text-[#64748B] mb-6">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Error Alert */}
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
          
          {/* Drag & Drop Image Upload Zone */}
          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1.5">
              {t('form.imageUploadLabel')}
            </label>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer p-5 flex flex-col items-center justify-center text-center ${
                isDragging
                  ? 'border-[#F97316] bg-orange-50 shadow-inner'
                  : 'border-slate-300 hover:border-[#F97316] bg-[#F8FAFC] hover:bg-orange-50/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative group w-full flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-40 object-contain rounded-xl shadow-sm"
                  />
                  <div className="absolute inset-0 bg-[#0F172A]/70 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity text-xs font-bold text-white backdrop-blur-xs">
                    {t('form.replaceImageText')}
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mb-2.5">
                    <UploadCloud className="w-6 h-6 text-[#F97316]" />
                  </div>
                  <p className="text-xs font-semibold text-[#0F172A]">
                    {t('form.dragDropText')}
                  </p>
                  <p className="text-[11px] text-[#64748B] mt-1">
                    {t('form.supportedFormats')}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Bilingual Names (Arabic & English) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Arabic Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#0F172A]">
                  {t('form.nameArLabel')}
                </label>
                <button
                  type="button"
                  onClick={copyArToEn}
                  className="text-[11px] text-[#F97316] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  title={t('form.copyNameToEn')}
                >
                  <span>{t('form.copyNameToEn')}</span>
                  <ArrowLeftRight className="w-3 h-3" />
                </button>
              </div>
              <input
                type="text"
                required
                dir="rtl"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder={t('form.nameArPlaceholder')}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-medium"
              />
            </div>

            {/* English Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#0F172A]">
                  {t('form.nameEnLabel')}
                </label>
                <button
                  type="button"
                  onClick={copyEnToAr}
                  className="text-[11px] text-[#F97316] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  title={t('form.copyNameToAr')}
                >
                  <span>{t('form.copyNameToAr')}</span>
                  <ArrowLeftRight className="w-3 h-3" />
                </button>
              </div>
              <input
                type="text"
                required
                dir="ltr"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder={t('form.nameEnPlaceholder')}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-medium"
              />
            </div>

          </div>

          {/* Additional details: Category, Part Number, Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Category */}
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

            {/* Part Number (OEM) */}
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1.5">
                {t('form.partNumberLabel')}
              </label>
              <input
                type="text"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                placeholder="BRM-9942-X"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono"
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1.5">
                {t('form.priceLabel')}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="199.99"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

          </div>

          {/* Actions & Status */}
          <div className="pt-4 flex items-center justify-between">
            <div className="text-xs text-[#F97316] font-medium flex items-center gap-2">
              {loading && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{statusMessage}</span>
                </>
              )}
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleClose}
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
                className="px-6 py-2.5 rounded-xl liquid-button text-xs font-bold disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-orange-500/25"
              >
                <Check className="w-4 h-4 text-white" />
                <span>{t('form.saveBtn')}</span>
              </motion.button>
            </div>
          </div>

        </form>

      </motion.div>
    </div>
  );
};
