import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { BrandLogo } from './BrandLogo';
import { Globe, Sun, Moon } from 'lucide-react';

export const Navbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2.5 sm:px-6 lg:px-8 pt-2.5 sm:pt-4 transition-all duration-300 w-full max-w-full">
      <nav 
        className={`w-full max-w-6xl mx-auto rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3 transition-all duration-300 bg-[#0F172A] dark:bg-[#090D16]/95 dark:backdrop-blur-md border border-slate-800 dark:border-[#1E293B] text-white ${
          scrolled 
            ? 'shadow-xl shadow-slate-950/20 border-slate-700' 
            : 'shadow-md shadow-slate-950/10'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          
          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-2 sm:gap-3 group min-w-0 shrink">
            <div className="relative h-8 sm:h-11 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0">
              <BrandLogo className="h-8 sm:h-10 w-auto max-w-[95px] sm:max-w-[150px]" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-base sm:text-xl font-black tracking-tight text-white truncate">
                  {t('brand.name')}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-[#F97316] shrink-0">
                  Auto
                </span>
              </div>
              <span className="text-[10px] text-[#94A3B8] font-medium hidden md:block truncate">
                {t('brand.subtitle')}
              </span>
            </div>
          </a>

          {/* Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 shrink-0">
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

          {/* Right Action Controls: Theme Switcher + AR/EN Language Pill */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={isDark ? (language === 'ar' ? 'تفعيل الوضع النهاري' : 'Switch to Light Mode') : (language === 'ar' ? 'تفعيل الوضع الداكن' : 'Switch to Dark Mode')}
              className="p-1.5 sm:p-2 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300 hover:text-white hover:border-orange-500/50 cursor-pointer transition-all duration-200 shrink-0"
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F97316] transition-transform duration-300 rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 hover:text-[#F97316] transition-transform duration-300" />
              )}
            </button>

            {/* AR / EN Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle Language"
              className="relative flex items-center p-0.5 sm:p-1 rounded-full bg-slate-800/90 border border-slate-700 cursor-pointer transition-all hover:border-orange-500/50"
            >
              <div className="flex items-center text-[11px] sm:text-xs font-bold">
                <span 
                  className={`px-2 sm:px-2.5 py-0.5 rounded-full transition-all duration-300 ${
                    language === 'ar' 
                      ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  عربي
                </span>

                <span 
                  className={`px-2 sm:px-2.5 py-0.5 rounded-full transition-all duration-300 ${
                    language === 'en' 
                      ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  EN
                </span>
              </div>
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 mx-1 text-slate-400" />
            </button>

          </div>

        </div>
      </nav>
    </header>
  );
};
