import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { Database, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer id="about" className="relative mt-20 border-t border-white/10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background Soft Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-cyan-600/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full liquid-pill flex items-center justify-center p-1.5">
                <img src="/logo.svg" alt="Shikhon Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-black text-white">
                {t('brand.fullName')}
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {t('footer.description')}
            </p>

            {/* Supabase Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/10">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-300">
                {isSupabaseConfigured ? (
                  <span className="text-emerald-400">● Supabase Cloud Live</span>
                ) : (
                  <span className="text-amber-400">● Demo Catalog (Add .env to connect)</span>
                )}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-4">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#catalog" className="hover:text-white transition-colors">{t('nav.catalog')}</a></li>
              <li><a href="#categories" className="hover:text-white transition-colors">{t('nav.categories')}</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">{t('nav.about')}</a></li>
              <li>
                <a 
                  href="http://localhost:5174" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1"
                >
                  <span>{t('nav.adminPortal')}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">Admin</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Trust & Certifications */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-4">
              100% Quality
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              جميع قطع الغيار مطابقة للمواصفات القياسية العالمية ومعتمدة للاستخدام الفوري.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Certified Auto Parts Store</span>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            {t('footer.rights')}
          </div>
          <div className="flex items-center gap-2">
            <span>{t('footer.poweredBy')}</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>
        </div>

      </div>
    </footer>
  );
};
