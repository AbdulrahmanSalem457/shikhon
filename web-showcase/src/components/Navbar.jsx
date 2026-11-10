import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogo } from './BrandLogo';
import { Globe, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 120, damping: 14 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-4 transition-all duration-300"
    >
      <nav 
        className={`max-w-6xl mx-auto rounded-2xl px-5 py-3 transition-all duration-500 bg-[#0F172A]/95 backdrop-blur-2xl border border-slate-800 text-white relative overflow-hidden ${
          scrolled 
            ? 'shadow-2xl shadow-slate-950/40 border-slate-700/80 -translate-y-1' 
            : 'shadow-lg shadow-slate-950/20'
        }`}
      >
        {/* Subtle Water Sheen reflection on the Navbar */}
        <div className="specular-glare opacity-20 pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          
          {/* Brand Logo & Name with Floating Water Physics */}
          <a href="#" className="flex items-center gap-3 group">
            <motion.div 
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative h-11 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
            >
              <BrandLogo className="h-10 w-auto max-w-[160px] filter drop-shadow-[0_2px_8px_rgba(249,115,22,0.25)]" />
            </motion.div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-orange-400 transition-colors">
                  {t('brand.name')}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-[#F97316] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-ping" />
                  Auto
                </span>
              </div>
              <span className="text-[10px] text-[#94A3B8] font-medium hidden sm:block">
                {t('brand.subtitle')}
              </span>
            </div>
          </a>

          {/* Navigation Links with Fluid Hover Ripple */}
          <div className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800/80 text-xs font-semibold text-slate-300 backdrop-blur-md">
            <a 
              href="#catalog" 
              className="relative px-3.5 py-1.5 rounded-full hover:text-[#F97316] hover:bg-slate-800/80 transition-all duration-200"
            >
              {t('nav.catalog')}
            </a>
            <a 
              href="#categories" 
              className="relative px-3.5 py-1.5 rounded-full hover:text-[#F97316] hover:bg-slate-800/80 transition-all duration-200"
            >
              {t('nav.categories')}
            </a>
            <a 
              href="#about" 
              className="relative px-3.5 py-1.5 rounded-full hover:text-[#F97316] hover:bg-slate-800/80 transition-all duration-200"
            >
              {t('nav.about')}
            </a>
          </div>

          {/* Right Action Controls: AR/EN Language Pill with Fluid Wave */}
          <div className="flex items-center gap-2.5">
            
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={toggleLanguage}
              aria-label="Toggle Language"
              className="relative flex items-center p-1 rounded-full bg-slate-800/90 border border-slate-700/80 cursor-pointer transition-all hover:border-orange-500/50 shadow-inner"
            >
              <div className="flex items-center text-xs font-bold">
                <span 
                  className={`px-2.5 py-0.5 rounded-full transition-all duration-300 ${
                    language === 'ar' 
                      ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-md shadow-orange-500/30' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  عربي
                </span>

                <span 
                  className={`px-2.5 py-0.5 rounded-full transition-all duration-300 ${
                    language === 'en' 
                      ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-md shadow-orange-500/30' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  EN
                </span>
                <Globe className="w-3.5 h-3.5 mx-1.5 text-slate-400" />
              </div>
            </motion.button>

          </div>

        </div>
      </nav>
    </motion.header>
  );
};
