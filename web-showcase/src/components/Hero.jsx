import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, Sparkles, Shield, Truck, Cpu, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero = ({ searchQuery, setSearchQuery }) => {
  const { t, isRTL } = useLanguage();

  return (
    <section className="relative pt-32 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F8FAFC] w-full max-w-full">
      
      {/* Subtle Warm Automotive Ambient Glow (Safely clipped inside section) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] max-w-full h-[320px] bg-gradient-to-tr from-orange-400/10 via-amber-300/10 to-slate-200/40 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center w-full">
        
        {/* Release Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-[#F97316] shadow-sm mb-5 sm:mb-6 max-w-full"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
          <span className="truncate">{t('hero.badge')}</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.25] text-[#0F172A] max-w-3xl mx-auto break-words"
        >
          <span>{t('hero.titlePrefix')} </span>
          <span className="bg-gradient-to-r from-[#F97316] via-[#EA580C] to-[#C2410C] bg-clip-text text-transparent inline-block">
            {t('hero.titleHighlight')}
          </span>
        </motion.h1>

        {/* Subtitle (Metallic Slate #64748B) */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-xs sm:text-base md:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed font-normal"
        >
          {t('hero.description')}
        </motion.p>

        {/* Search Bar (Snow White #FFFFFF + Metallic Slate Border #CBD5E1 + Orange Accent #F97316) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-7 sm:mt-8 max-w-xl mx-auto w-full"
        >
          <div className="relative group w-full">
            <div className="relative flex items-center rounded-2xl bg-white border-2 border-slate-200 group-hover:border-[#F97316]/50 focus-within:border-[#F97316] px-3.5 sm:px-4 py-2 sm:py-2.5 shadow-md shadow-slate-900/5 transition-all w-full">
              <Search className={`w-4 h-4 sm:w-5 sm:h-5 text-[#F97316] shrink-0 ${isRTL ? 'ml-2.5 sm:ml-3' : 'mr-2.5 sm:mr-3'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('hero.searchPlaceholder')}
                className="w-full min-w-0 flex-1 bg-transparent border-none text-[#0F172A] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-0 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-2 py-0.5 text-xs text-slate-400 hover:text-[#0F172A] rounded-md bg-slate-100 transition-colors shrink-0"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* 3 Metric Cards (#FFFFFF with #E2E8F0 Border) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto w-full"
        >
          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 flex items-center gap-3 text-start shadow-sm w-full">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5 text-[#F97316]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-black text-[#0F172A]">{t('hero.stat1Value')}</div>
              <div className="text-[11px] text-[#64748B] font-medium truncate">{t('hero.stat1Label')}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 flex items-center gap-3 text-start shadow-sm w-full">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-[#64748B]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-black text-[#0F172A]">{t('hero.stat2Value')}</div>
              <div className="text-[11px] text-[#64748B] font-medium truncate">{t('hero.stat2Label')}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 flex items-center gap-3 text-start shadow-sm w-full">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#F97316]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-black text-[#0F172A]">{t('hero.stat3Value')}</div>
              <div className="text-[11px] text-[#64748B] font-medium truncate">{t('hero.stat3Label')}</div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <a 
          href="#catalog"
          className="inline-flex flex-col items-center gap-1 mt-10 text-[#64748B] hover:text-[#F97316] transition-colors"
        >
          <span className="text-[11px] font-medium">{t('nav.catalog')}</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce text-[#F97316]" />
        </a>

      </div>
    </section>
  );
};
