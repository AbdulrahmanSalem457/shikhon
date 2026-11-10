import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogo } from './BrandLogo';
import { Globe } from 'lucide-react';

export const Navbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-4 transition-all duration-300">
      <nav 
        className={`max-w-6xl mx-auto rounded-2xl px-5 py-3 transition-all duration-300 bg-[#0F172A] border border-slate-800 text-white ${
          scrolled 
            ? 'shadow-xl shadow-slate-950/20 border-slate-700' 
            : 'shadow-md shadow-slate-950/10'
        }`}
      >
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative h-11 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <BrandLogo className="h-10 w-auto max-w-[160px]" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white">
                  {t('brand.name')}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-[#F97316]">
                  Auto
                </span>
              </div>
              <span className="text-[10px] text-[#94A3B8] font-medium hidden sm:block">
                {t('brand.subtitle')}
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300">
            <a 
              href="#catalog" 
              className="px-3.5 py-1.5 rounded-full hover:text-[#F97316] hover:bg-slate-800/60 transition-colors"
            >
              {t('nav.catalog')}
            </a>
            <a 
              href="#categories" 
              className="px-3.5 py-1.5 rounded-full hover:text-[#F97316] hover:bg-slate-800/60 transition-colors"
            >
              {t('nav.categories')}
            </a>
            <a 
              href="#about" 
              className="px-3.5 py-1.5 rounded-full hover:text-[#F97316] hover:bg-slate-800/60 transition-colors"
            >
              {t('nav.about')}
            </a>
          </div>

          {/* Right Action Controls: AR/EN Language Pill */}
          <div className="flex items-center gap-2.5">
            
            {/* AR / EN Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle Language"
              className="relative flex items-center p-1 rounded-full bg-slate-800/90 border border-slate-700 cursor-pointer transition-all hover:border-orange-500/50"
            >
              <div className="flex items-center text-xs font-bold">
                <span 
                  className={`px-2.5 py-0.5 rounded-full transition-all duration-300 ${
                    language === 'ar' 
                      ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  عربي
                </span>

                <span 
                  className={`px-2.5 py-0.5 rounded-full transition-all duration-300 ${
                    language === 'en' 
                      ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  EN
                </span>
              </div>
              <Globe className="w-3.5 h-3.5 mx-1.5 text-slate-400" />
            </button>

          </div>

        </div>
      </nav>
    </header>
  );
};
