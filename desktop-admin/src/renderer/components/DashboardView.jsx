import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { supabase, broadcastProductChange } from '../lib/supabase';
import { getProductsApi, deleteProductApi } from '../api/productsApi';
import { deleteImageApi } from '../api/storageApi';
import { AddProductModal } from './AddProductModal';
import { EditProductModal } from './EditProductModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  ListFilter, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Layers, 
  Package, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardView = () => {
  const { t, language, isRTL } = useLanguage();
  const { isDemoUser } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch products via GET /rest/v1/products API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProductsApi();
      setProducts(data || []);
    } catch (err) {
      console.error('[API Fetch Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [isDemoUser]);

  // Product Add Callback
  const handleProductAdded = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    broadcastProductChange('product_added', newProduct);
  };

  // Product Update Callback
  const handleProductUpdated = (updated) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    broadcastProductChange('product_updated', updated);
  };

  // Product Delete Handler via DELETE /rest/v1/products API
  const confirmDelete = async () => {
    if (!deletingProduct) return;

    const deletedId = deletingProduct.id;

    try {
      setDeleteLoading(true);

      // Call DELETE /rest/v1/products?id=eq.{id}
      await deleteProductApi(deletedId);

      // Call DELETE /storage/v1/object/product-images/{filename}
      if (deletingProduct.image_url) {
        await deleteImageApi(deletingProduct.image_url);
      }

      setProducts(prev => prev.filter(p => p.id !== deletedId));
      setDeletingProduct(null);

      // Broadcast instant Real-Time deletion to Website Showcase
      broadcastProductChange('product_deleted', { id: deletedId });
    } catch (err) {
      console.error('[API Delete Error]:', err);
      alert(err.message || 'Error deleting product via API');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter products by search
  const filteredProducts = products.filter(p => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const matchAr = p.name_ar ? p.name_ar.toLowerCase().includes(query) : false;
    const matchEn = p.name_en ? p.name_en.toLowerCase().includes(query) : false;
    const matchCat = p.category ? p.category.toLowerCase().includes(query) : false;
    const matchPart = p.part_number ? p.part_number.toLowerCase().includes(query) : false;
    return matchAr || matchEn || matchCat || matchPart;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative overflow-hidden">
      
      {/* Background Liquid Water Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="liquid-blob w-[450px] h-[450px] -top-20 -right-20 bg-orange-400/10 pointer-events-none" />
        <div className="liquid-blob w-[400px] h-[400px] top-1/2 -left-32 bg-slate-300/20 pointer-events-none" />
      </div>

      {/* KPI Stats Bar with Liquid Glass Physics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8 relative z-10">
        
        {/* Total parts card */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="liquid-glass-card p-5 flex items-center justify-between cursor-default"
        >
          <div>
            <span className="text-xs text-[#64748B] block font-semibold">
              {t('dashboard.totalParts')}
            </span>
            <span className="text-3xl font-black text-[#0F172A] mt-1 block">
              {products.length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-[#F97316] shadow-xs">
            <Package className="w-6 h-6" />
          </div>
        </motion.div>

        {/* In Stock card */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="liquid-glass-card p-5 flex items-center justify-between cursor-default"
        >
          <div>
            <span className="text-xs text-[#64748B] block font-semibold">
              {t('dashboard.inStock')}
            </span>
            <span className="text-3xl font-black text-emerald-600 mt-1 block">
              {products.filter(p => p.in_stock !== false).length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Categories count card */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="liquid-glass-card p-5 flex items-center justify-between cursor-default"
        >
          <div>
            <span className="text-xs text-[#64748B] block font-semibold">
              {t('dashboard.categoriesCount')}
            </span>
            <span className="text-3xl font-black text-[#0F172A] mt-1 block">
              {new Set(products.map(p => p.category || 'General')).size}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#64748B] shadow-xs">
            <Layers className="w-6 h-6" />
          </div>
        </motion.div>
      </div>

      {/* Main Action Header Card with Liquid Glass Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="liquid-glass rounded-3xl p-6 sm:p-7 mb-8 shadow-sm relative z-10"
      >
        <div className="specular-glare opacity-25 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Title & Sub */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A]">
              {t('dashboard.title')}
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              {t('dashboard.subtitle')}
            </p>
          </div>

          {/* Add Product Button (Liquid Button with continuous fluid wave) */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAddOpen(true)}
            className="px-6 py-3 rounded-2xl liquid-button text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-500/25 self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>{t('dashboard.addProductBtn')}</span>
          </motion.button>

        </div>

        {/* Search & View Controls Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search Box with Fluid Glass Meniscus */}
          <div className="relative flex-1 max-w-md">
            <Search className={`w-4 h-4 text-[#64748B] absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('dashboard.searchPlaceholder')}
              className={`w-full py-2.5 rounded-xl glass-input text-xs ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
            />
          </div>

          {/* View Mode & Refresh with Liquid Pills */}
          <div className="flex items-center gap-2">
            
            {/* Refresh */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={fetchProducts}
              disabled={loading}
              className="p-2.5 rounded-xl liquid-pill text-[#64748B] hover:text-[#0F172A] cursor-pointer"
              title={t('dashboard.refresh')}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#F97316]' : ''}`} />
            </motion.button>

            {/* Grid View button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'liquid-button shadow-sm'
                  : 'liquid-pill text-[#64748B] hover:text-[#0F172A]'
              }`}
              title={t('dashboard.viewGrid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </motion.button>

            {/* Table View button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('table')}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'liquid-button shadow-sm'
                  : 'liquid-pill text-[#64748B] hover:text-[#0F172A]'
              }`}
              title={t('dashboard.viewTable')}
            >
              <ListFilter className="w-4 h-4" />
            </motion.button>

          </div>

        </div>
      </motion.div>

      {/* Product Display: Grid or Table */}
      {filteredProducts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 liquid-glass rounded-3xl relative z-10"
        >
          <Package className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#0F172A] mb-1">
            {t('table.noData')}
          </h3>
          <p className="text-xs text-[#64748B]">
            اضغط على زر "إضافة قطعة غيار جديدة" لبدء إضافة القطع.
          </p>
        </motion.div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW with Liquid Glass Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
          {filteredProducts.map((product, idx) => {
            const displayName = language === 'ar' ? product.name_ar : product.name_en;
            const subName = language === 'ar' ? product.name_en : product.name_ar;

            return (
              <motion.div
                key={product.id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="liquid-glass-card p-4 flex flex-col justify-between group"
              >
                <div className="specular-glare opacity-25 pointer-events-none" />

                {/* Image */}
                <div>
                  <div className="w-full h-44 rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-slate-100/60 p-3 mb-3 flex items-center justify-center relative overflow-hidden border border-slate-100">
                    <img
                      src={product.image_url}
                      alt={displayName}
                      className="w-full h-full object-contain filter drop-shadow-sm transform transition-transform duration-500 group-hover:scale-108"
                    />
                    <span className="absolute top-2 start-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-md border border-slate-200 text-[#F97316]">
                      {product.category || 'General'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1">
                  <span className="text-[10px] font-mono font-bold text-[#64748B] block mb-1">
                    {product.part_number || product.id?.slice(0, 8)}
                  </span>
                  <h3 className="text-sm font-bold text-[#0F172A] line-clamp-2 leading-snug group-hover:text-[#F97316] transition-colors">
                    {displayName}
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-1 mt-0.5 font-medium">
                    {subName}
                  </p>
                  {product.price && (
                    <div className="mt-2 text-sm font-black text-[#0F172A]">
                      ${product.price}
                    </div>
                  )}
                </div>

                {/* Actions with Liquid Pills */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setEditingProduct(product)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-orange-50/60 border border-slate-200 hover:border-orange-200 text-[#0F172A] hover:text-[#F97316] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#F97316]" />
                    <span>{t('table.edit')}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: -6 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setDeletingProduct(product)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                    title={t('table.delete')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                </div>

              </motion.div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW with Liquid Glass Container */
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass rounded-3xl overflow-hidden shadow-sm relative z-10"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-[#F8FAFC] border-b border-slate-200 text-[#64748B] uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">{t('table.image')}</th>
                  <th className="p-4">{t('table.nameAr')}</th>
                  <th className="p-4">{t('table.nameEn')}</th>
                  <th className="p-4">{t('table.category')}</th>
                  <th className="p-4">{t('table.partNumber')}</th>
                  <th className="p-4">{t('table.price')}</th>
                  <th className="p-4 text-end">{t('table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-orange-50/20 transition-colors group">
                    <td className="p-4">
                      <img
                        src={product.image_url}
                        alt=""
                        className="w-12 h-12 object-contain rounded-xl bg-[#F8FAFC] p-1 border border-slate-200 group-hover:scale-110 transition-transform"
                      />
                    </td>
                    <td className="p-4 font-bold text-[#0F172A] max-w-xs truncate" dir="rtl">
                      {product.name_ar}
                    </td>
                    <td className="p-4 font-medium text-slate-700 max-w-xs truncate" dir="ltr">
                      {product.name_en}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-50 border border-orange-200 text-[#F97316]">
                        {product.category || 'General'}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-semibold text-[#64748B]">
                      {product.part_number || '—'}
                    </td>
                    <td className="p-4 font-bold text-[#0F172A]">
                      {product.price ? `$${product.price}` : '—'}
                    </td>
                    <td className="p-4 text-end">
                      <div className="inline-flex items-center gap-1.5">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setEditingProduct(product)}
                          className="p-1.5 rounded-lg bg-[#F8FAFC] hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-[#0F172A] hover:text-[#F97316] transition-colors cursor-pointer"
                          title={t('table.edit')}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: -6 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setDeletingProduct(product)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                          title={t('table.delete')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Add Product Modal */}
      {isAddOpen && (
        <AddProductModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onProductAdded={handleProductAdded}
          isDemo={isDemoUser}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          isOpen={Boolean(editingProduct)}
          onClose={() => setEditingProduct(null)}
          onProductUpdated={handleProductUpdated}
          isDemo={isDemoUser}
        />
      )}

      {/* Delete Product Modal */}
      {deletingProduct && (
        <DeleteConfirmModal
          product={deletingProduct}
          isOpen={Boolean(deletingProduct)}
          onClose={() => setDeletingProduct(null)}
          onConfirm={confirmDelete}
          loading={deleteLoading}
        />
      )}

    </div>
  );
};
