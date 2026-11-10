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
  CheckCircle2
} from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      
      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="liquid-glass rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
              {t('dashboard.totalParts')}
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
              {products.length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-cyan-500/15 border border-sky-500/20 dark:border-cyan-500/30 flex items-center justify-center text-sky-600 dark:text-cyan-400">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="liquid-glass rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
              {t('dashboard.inStock')}
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
              {products.filter(p => p.in_stock !== false).length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="liquid-glass rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
              {t('dashboard.categoriesCount')}
            </span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
              {new Set(products.map(p => p.category || 'General')).size}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Action Header */}
      <div className="liquid-glass rounded-3xl p-5 sm:p-6 mb-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Title & Sub */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t('dashboard.title')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('dashboard.subtitle')}
            </p>
          </div>

          {/* Add Product Button */}
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-sky-500/20 transition-all self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('dashboard.addProductBtn')}</span>
          </button>

        </div>

        {/* Search & View Controls Bar */}
        <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('dashboard.searchPlaceholder')}
              className={`w-full py-2 rounded-xl glass-input text-xs ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
            />
          </div>

          {/* View Mode & Refresh */}
          <div className="flex items-center gap-2">
            
            {/* Refresh */}
            <button
              onClick={fetchProducts}
              disabled={loading}
              className="p-2 rounded-xl liquid-pill text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title={t('dashboard.refresh')}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Grid View button */}
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                  : 'liquid-pill text-slate-500 dark:text-slate-400'
              }`}
              title={t('dashboard.viewGrid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            {/* Table View button */}
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                  : 'liquid-pill text-slate-500 dark:text-slate-400'
              }`}
              title={t('dashboard.viewTable')}
            >
              <ListFilter className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>

      {/* Product Display: Grid or Table */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 liquid-glass rounded-3xl">
          <Package className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
            {t('table.noData')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            اضغط على زر "إضافة قطعة غيار جديدة" لبدء إضافة القطع.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const displayName = language === 'ar' ? product.name_ar : product.name_en;
            const subName = language === 'ar' ? product.name_en : product.name_ar;

            return (
              <div
                key={product.id}
                className="liquid-glass-card rounded-3xl p-4 flex flex-col justify-between"
              >
                {/* Image */}
                <div className="w-full h-40 rounded-2xl bg-slate-100 dark:bg-slate-950/70 p-3 mb-3 flex items-center justify-center relative overflow-hidden border border-slate-200/60 dark:border-white/10">
                  <img
                    src={product.image_url}
                    alt={displayName}
                    className="w-full h-full object-contain filter drop-shadow-sm"
                  />
                  <span className="absolute top-2 start-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/80 dark:bg-black/60 border border-slate-200/50 dark:border-white/15 text-sky-700 dark:text-cyan-300">
                    {product.category || 'General'}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 block mb-1">
                    {product.part_number || product.id?.slice(0, 8)}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                    {displayName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {subName}
                  </p>
                  {product.price && (
                    <div className="mt-2 text-xs font-black text-slate-900 dark:text-white">
                      ${product.price}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="flex-1 py-1.5 px-2.5 rounded-xl liquid-pill text-sky-600 dark:text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer hover:border-sky-400/50"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{t('table.edit')}</span>
                  </button>

                  <button
                    onClick={() => setDeletingProduct(product)}
                    className="p-1.5 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 transition-colors cursor-pointer"
                    title={t('table.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="liquid-glass rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-slate-100/60 dark:bg-white/[0.04] border-b border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">
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
              <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <img
                        src={product.image_url}
                        alt=""
                        className="w-12 h-12 object-contain rounded-xl bg-slate-100 dark:bg-slate-950/70 p-1 border border-slate-200/60 dark:border-white/10"
                      />
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white max-w-xs truncate" dir="rtl">
                      {product.name_ar}
                    </td>
                    <td className="p-4 font-medium text-slate-600 dark:text-slate-300 max-w-xs truncate" dir="ltr">
                      {product.name_en}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-50 dark:bg-cyan-500/15 border border-sky-200 dark:border-cyan-500/30 text-sky-700 dark:text-cyan-300">
                        {product.category || 'General'}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-semibold text-slate-500 dark:text-slate-400">
                      {product.part_number || '—'}
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {product.price ? `$${product.price}` : '—'}
                    </td>
                    <td className="p-4 text-end">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-1.5 rounded-lg liquid-pill text-sky-600 dark:text-cyan-300 transition-colors cursor-pointer"
                          title={t('table.edit')}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(product)}
                          className="p-1.5 rounded-lg bg-red-50 dark:bg-red-500/15 hover:bg-red-100 dark:hover:bg-red-500/25 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                          title={t('table.delete')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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