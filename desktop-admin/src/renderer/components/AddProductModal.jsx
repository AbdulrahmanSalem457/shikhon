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

  // Quick Copy between Arabic & English fields
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

      // STEP 1: Upload Image to Supabase Storage Bucket via REST API
      setStatusMessage(t('form.uploadingImage'));
      const uploadRes = await uploadImageApi(imageFile);
      const publicImageUrl = uploadRes.publicUrl;

      // STEP 2: Insert Record via Supabase REST API (POST /rest/v1/products)
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

      // Inform parent dashboard
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 end-5 p-1.5 rounded-full bg-[#F8FAFC] border border-slate-200 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-black text-[#0F172A] mb-1">
          {t('form.addNewTitle')}
        </h2>
        <p className="text-xs text-[#64748B] mb-6">
          {t('dashboard.subtitle')}
        </p>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
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
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer p-5 flex flex-col items-center justify-center text-center ${
                isDragging
                  ? 'border-[#F97316] bg-orange-50'
                  : 'border-slate-300 hover:border-[#F97316] bg-[#F8FAFC] hover:bg-orange-50/30'
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
                  <div className="absolute inset-0 bg-[#0F172A]/70 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity text-xs font-bold text-white">
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-300 text-xs text-[#0F172A] font-medium focus:border-[#F97316] focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-300 text-xs text-[#0F172A] font-medium focus:border-[#F97316] focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all"
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
                className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-300 text-xs text-[#0F172A] focus:border-[#F97316] focus:bg-white focus:outline-none transition-all"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-300 text-xs font-mono text-[#0F172A] focus:border-[#F97316] focus:bg-white focus:outline-none transition-all"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-300 text-xs text-[#0F172A] focus:border-[#F97316] focus:bg-white focus:outline-none transition-all"
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
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 text-xs font-semibold cursor-pointer transition-colors"
              >
                {t('form.cancelBtn')}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white text-xs font-bold shadow-md shadow-orange-500/25 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Check className="w-4 h-4" />
                <span>{t('form.saveBtn')}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
