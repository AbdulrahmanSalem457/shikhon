import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, Sparkles, Shield, Truck, Cpu, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero = ({ searchQuery, setSearchQuery }) => {
  const { t, isRTL } = useLanguage();

  return (
    <section className="relative pt-32 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F8FAFC] w-full max-w-full">
      
      {/* Dynamic Morphing Water Blobs (Safely contained inside overflow-hidden wrapper) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div 
          className="liquid-blob w-72 sm:w-[450px] h-72 sm:h-[450px] -top-10 sm:-top-20 left-1/4 bg-gradient-to-tr from-orange-400/20 via-amber-300/15 to-transparent"
          style={{ animationDuration: '18s' }}
        />
        <div 
          className="liquid-blob w-80 sm:w-[500px] h-80 sm:h-[500px] top-10 -right-10 sm:-right-24 bg-gradient-to-br from-slate-300/30 via-orange-300/10 to-transparent"
          style={{ animationDuration: '22s', animationDelay: '-4s' }}
        />
        <div 
          className="liquid-blob w-64 sm:w-[380px] h-64 sm:h-[380px] top-1/2 left-5 sm:left-10 bg-gradient-to-tr from-orange-500/15 via-rose-300/10 to-transparent"
          style={{ animationDuration: '15s', animationDelay: '-8s' }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
        
        {/* Release Pill Badge with Water Ripple */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", damping: 15 }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full liquid-pill text-[11px] sm:text-xs font-semibold text-[#F97316] mb-5 sm:mb-6 cursor-pointer max-w-full"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F97316]" />
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
          <span className="truncate">{t('hero.badge')}</span>
        </motion.div>

        {/* Main Headline with Animated Fluid Motion */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, type: "spring", damping: 20 }}
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.25] text-[#0F172A] max-w-3xl mx-auto break-words"
        >
          <span>{t('hero.titlePrefix')} </span>
          <span className="relative inline-block bg-gradient-to-r from-[#F97316] via-[#EA580C] to-[#C2410C] bg-clip-text text-transparent">
            {t('hero.titleHighlight')}
            <motion.span 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-full"
            />
          </span>
        </motion.h1>

        {/* Subtitle (Metallic Slate #64748B) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 sm:mt-5 text-xs sm:text-base md:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed font-normal"
        >
          {t('hero.description')}
        </motion.p>

        {/* Search Bar with Liquid Glass Border & Ripple Focus */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, type: "spring", damping: 18 }}
          className="mt-7 sm:mt-9 max-w-xl mx-auto w-full"
        >
          <div className="relative group w-full">
            <div className="relative flex items-center rounded-2xl liquid-glass border border-slate-200 group-hover:border-[#F97316]/70 focus-within:border-[#F97316] px-3.5 sm:px-4 py-2 sm:py-2.5 shadow-lg shadow-slate-900/5 transition-all duration-300 w-full">
              
              <div className="specular-glare opacity-40" />

              <Search className={`w-4 h-4 sm:w-5 sm:h-5 text-[#F97316] shrink-0 transition-transform duration-300 group-hover:scale-110 ${isRTL ? 'ml-2.5 sm:ml-3' : 'mr-2.5 sm:mr-3'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('hero.searchPlaceholder')}
                className="w-full min-w-0 flex-1 bg-transparent border-none text-[#0F172A] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-0 font-medium z-10"
              />
              {searchQuery && (
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchQuery('')}
                  className="px-2 py-0.5 text-xs text-slate-400 hover:text-[#0F172A] rounded-md bg-slate-100/80 transition-colors z-10 shrink-0"
                >
                  ✕
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* 3 Metric Cards with Liquid Glass Physics */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 max-w-2xl mx-auto w-full"
        >
          <motion.div 
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="liquid-glass-card p-3.5 sm:p-4 flex items-center gap-3.5 text-start cursor-pointer group w-full"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-xs">
              <Cpu className="w-5 h-5 text-[#F97316]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg sm:text-xl font-black text-[#0F172A]">{t('hero.stat1Value')}</div>
              <div className="text-[11px] text-[#64748B] font-medium truncate">{t('hero.stat1Label')}</div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="liquid-glass-card p-3.5 sm:p-4 flex items-center gap-3.5 text-start cursor-pointer group w-full"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-xs">
              <Shield className="w-5 h-5 text-[#64748B]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg sm:text-xl font-black text-[#0F172A]">{t('hero.stat2Value')}</div>
              <div className="text-[11px] text-[#64748B] font-medium truncate">{t('hero.stat2Label')}</div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="liquid-glass-card p-3.5 sm:p-4 flex items-center gap-3.5 text-start cursor-pointer group w-full"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-xs">
              <Truck className="w-5 h-5 text-[#F97316]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg sm:text-xl font-black text-[#0F172A]">{t('hero.stat3Value')}</div>
              <div className="text-[11px] text-[#64748B] font-medium truncate">{t('hero.stat3Label')}</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator with Water Drop Bobbing Animation */}
        <motion.a 
          href="#catalog"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex flex-col items-center gap-1.5 mt-10 sm:mt-12 text-[#64748B] hover:text-[#F97316] transition-colors cursor-pointer group"
        >
          <span className="text-[11px] font-semibold tracking-wider group-hover:tracking-widest transition-all">
            {t('nav.catalog')}
          </span>
          <ChevronDown className="w-4 h-4 text-[#F97316]" />
        </motion.a>

      </div>
    </section>
  );
};
