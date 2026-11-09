import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { uploadImageToStorage, supabase } from '../lib/supabase';
import { 
  X, 
  UploadCloud, 
  Image as ImageIcon, 
  Check, 
  AlertCircle, 
  ArrowLeftRight, 
  Loader2, 
  Layers 
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

  // Quick name sync
  const copyArToEn = () => {
    if (nameAr) setNameEn(nameAr);
  };

  const copyEnToAr = () => {
    if (nameEn) setNameAr(nameEn);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!nameAr.trim() || !nameEn.trim()) {
      setErrorMessage(t('form.validationNameRequired'));
      return;
    }

    if (!imageFile && !imagePreview) {
      setErrorMessage(t('form.validationImageRequired'));
      return;
    }

    try {
      setLoading(true);

      let finalImageUrl = imagePreview;

      // If Supabase not connected yet, simulate locally
      if (!supabase) {
        setStatusMessage(t('form.savingProduct'));
        const newProduct = {
          id: 'demo-' + Date.now(),
          name_ar: nameAr,
          name_en: nameEn,
          image_url: imagePreview,
          category,
          part_number: partNumber || 'SHK-' + Math.floor(1000 + Math.random() * 9000),
          price: price ? parseFloat(price) : null,
          in_stock: true,
          created_at: new Date().toISOString()
        };
        onProductAdded(newProduct);
        onClose();
        return;
      }

      // 1. Upload directly to Supabase Storage 'product-images'
      setStatusMessage(t('form.uploadingImage'));
      const { publicUrl } = await uploadImageToStorage(imageFile);
      finalImageUrl = publicUrl;

      // 2. Insert into 'products' table
      setStatusMessage(t('form.savingProduct'));
      const productPayload = {
        name_ar: nameAr.trim(),
        name_en: nameEn.trim(),
        image_url: finalImageUrl,
        category,
        part_number: partNumber.trim() || null,
        price: price ? parseFloat(price) : null,
        in_stock: true
      };

      const { data, error } = await supabase
        .from('products')
        .insert([productPayload])
        .select()
        .single();

      if (error) throw error;

      onProductAdded(data);
      onClose();
    } catch (err) {
      console.error('Error saving product:', err);
      setErrorMessage(err.message || t('messages.errorOccurred'));
    } finally {
      setLoading(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl liquid-glass rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-black text-white mb-1">
          {t('form.addNewTitle')}
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          {t('dashboard.subtitle')}
        </p>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Drag & Drop Image Upload Zone */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              {t('form.imageUploadLabel')}
            </label>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer p-5 flex flex-col items-center justify-center text-center ${
                isDragging
                  ? 'border-cyan-400 bg-cyan-500/15'
                  : 'border-white/20 hover:border-cyan-400/40 bg-slate-950/40 hover:bg-slate-950/60'
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
                    className="max-h-40 object-contain rounded-xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity text-xs font-bold text-white">
                    {t('form.replaceImageText')}
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-2.5">
                    <UploadCloud className="w-6 h-6 text-cyan-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-200">
                    {t('form.dragDropText')}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
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
                <label className="text-xs font-bold text-slate-300">
                  {t('form.nameArLabel')}
                </label>
                <button
                  type="button"
                  onClick={copyArToEn}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
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
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs font-medium"
              />
            </div>

            {/* English Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {t('form.nameEnLabel')}
                </label>
                <button
                  type="button"
                  onClick={copyEnToAr}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
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
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs font-medium"
              />
            </div>

          </div>

          {/* Additional details: Category, Part Number, Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Category */}
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

            {/* Part Number */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {t('form.partNumberLabel')}
              </label>
              <input
                type="text"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                placeholder="BRM-9942-X"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs font-mono"
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {t('form.priceLabel')}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="199.99"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs"
              />
            </div>

          </div>

          {/* Actions & Status */}
          <div className="pt-4 flex items-center justify-between">
            <div className="text-xs text-cyan-300 font-medium flex items-center gap-2">
              {loading && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>{statusMessage}</span>
                </>
              )}
            </div>

            <div className="flex gap-2">
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
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 disabled:opacity-50 flex items-center gap-1.5"
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
