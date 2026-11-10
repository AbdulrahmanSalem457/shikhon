import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { Footer } from './components/Footer';
import { supabase, isSupabaseConfigured, FALLBACK_PRODUCTS } from './lib/supabase';
import { getProductsApi } from './api/productsApi';

const MainContent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { isRTL } = useLanguage();

  // Load products via Supabase REST API (GET /rest/v1/products)
  const loadProducts = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const data = await getProductsApi();
      setProducts(data || []);
      setError(null);
    } catch (err) {
      console.warn('API fetch error:', err);
      if (!isSilent) setError(err.message);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Initial Load
    loadProducts(false);

    // 2. Real-Time WebSocket Channel (Instant Broadcast + Postgres Replication)
    const channel = supabase.channel('shikhon-products-sync', {
      config: {
        broadcast: { ack: true }
      }
    });

    // Handle instant Peer Broadcast from Desktop Admin
    channel.on('broadcast', { event: 'product_deleted' }, ({ payload }) => {
      console.log('⚡ [Realtime Broadcast] Deleted product:', payload);
      if (payload?.id) {
        setProducts(prev => prev.filter(p => p.id !== payload.id));
      }
      loadProducts(true);
    });

    channel.on('broadcast', { event: 'product_added' }, ({ payload }) => {
      console.log('⚡ [Realtime Broadcast] Added product:', payload);
      if (payload?.id) {
        setProducts(prev => [payload, ...prev.filter(p => p.id !== payload.id)]);
      }
      loadProducts(true);
    });

    channel.on('broadcast', { event: 'product_updated' }, ({ payload }) => {
      console.log('⚡ [Realtime Broadcast] Updated product:', payload);
      if (payload?.id) {
        setProducts(prev => prev.map(p => p.id === payload.id ? payload : p));
      }
      loadProducts(true);
    });

    // Also listen to direct PostgreSQL database replication changes
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      (payload) => {
        console.log('📦 [Postgres Realtime Change]:', payload);
        if (payload.eventType === 'DELETE') {
          const deletedId = payload.old?.id || payload.old_record?.id;
          if (deletedId) {
            setProducts(prev => prev.filter(p => p.id !== deletedId));
          }
        } else if (payload.eventType === 'INSERT' && payload.new) {
          setProducts(prev => [payload.new, ...prev.filter(p => p.id !== payload.new.id)]);
        } else if (payload.eventType === 'UPDATE' && payload.new) {
          setProducts(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
        }
        loadProducts(true);
      }
    );

    channel.subscribe((status) => {
      console.log('[Web Showcase Realtime Sync Status]:', status);
    });

    // 3. Silent Background Sync Interval (Every 3.5 seconds)
    const pollInterval = setInterval(() => {
      loadProducts(true);
    }, 3500);

    // 4. Tab Visibility & Focus Sync
    const handleSyncOnActive = () => {
      if (document.visibilityState === 'visible') {
        loadProducts(true);
      }
    };

    window.addEventListener('focus', handleSyncOnActive);
    document.addEventListener('visibilitychange', handleSyncOnActive);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleSyncOnActive);
      document.removeEventListener('visibilitychange', handleSyncOnActive);
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className={`min-h-screen flex flex-col justify-between w-full max-w-full overflow-x-hidden ${isRTL ? 'font-ar' : 'font-en'}`}>
      <div className="w-full max-w-full overflow-x-hidden">
        <Navbar />
        <main className="w-full max-w-full overflow-x-hidden">
          <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <ProductCatalog 
            products={products} 
            loading={loading} 
            error={error} 
            searchQuery={searchQuery} 
          />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MainContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
