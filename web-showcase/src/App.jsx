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
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProductsApi();
      setProducts(data || []);
      setError(null);
    } catch (err) {
      console.warn('API fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();

    // Set up Real-Time subscription if Supabase configured
    if (isSupabaseConfigured && supabase) {
      const channel = supabase
        .channel('public:products')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          (payload) => {
            console.log('Realtime change received:', payload);
            loadProducts();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  return (
    <div className={`min-h-screen flex flex-col justify-between ${isRTL ? 'font-ar' : 'font-en'}`}>
      <div>
        <Navbar />
        <main>
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
