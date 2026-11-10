import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { BrandLogo } from './BrandLogo';
import { Globe, Sun, Moon } from 'lucide-react';

export const Navbar = () => {
  const { language, toggleLanguage, t, isRTL } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
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
        className={`max-w-6xl mx-auto rounded-full px-5 py-3 transition-all duration-300 liquid-glass ${
          scrolled 
            ? 'shadow-lg border-opacity-90' 
            : 'shadow-sm'
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
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-sky-600 to-blue-700 dark:from-white dark:to-cyan-300 bg-clip-text text-transparent">
                  {t('brand.name')}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-cyan-300">
                  Auto
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                {t('brand.subtitle')}
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full liquid-pill text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a 
              href="#catalog" 
              className="px-3.5 py-1.5 rounded-full hover:text-sky-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
            >
              {t('nav.catalog')}
            </a>
            <a 
              href="#categories" 
              className="px-3.5 py-1.5 rounded-full hover:text-sky-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
            >
              {t('nav.categories')}
            </a>
            <a 
              href="#about" 
              className="px-3.5 py-1.5 rounded-full hover:text-sky-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
            >
              {t('nav.about')}
            </a>
          </div>

          {/* Right Action Controls: Theme Switcher & AR/EN Language Pill */}
          <div className="flex items-center gap-2.5">
            
            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-full liquid-pill hover:border-sky-400/50 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
              title={isDark ? "تفعيل الوضع المضيء (Light Mode)" : "تفعيل الوضع الداكن (Dark Mode)"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* AR / EN Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle Language"
              className="relative flex items-center p-1 rounded-full liquid-pill cursor-pointer transition-all hover:border-sky-400/50"
            >
              <div className="flex items-center text-xs font-bold">
                <span 
                  className={`px-2.5 py-0.5 rounded-full transition-all duration-300 ${
                    language === 'ar' 
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  عربي
                </span>

                <span 
                  className={`px-2.5 py-0.5 rounded-full transition-all duration-300 ${
                    language === 'en' 
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
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
