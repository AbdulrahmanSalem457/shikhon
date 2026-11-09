import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, Sparkles, Shield, Truck, Cpu, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero = ({ searchQuery, setSearchQuery }) => {
  const { t, isRTL } = useLanguage();

  return (
    <section className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background Animated Aurora Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/20 to-purple-600/15 rounded-full blur-[120px] pointer-events-none -z-10 animate-mesh-slow" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-cyan-500/15 rounded-full blur-[90px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto text-center">
        
        {/* Release Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-pill text-xs font-semibold text-cyan-300 border border-cyan-400/30 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span>{t('hero.badge')}</span>
        </motion.div>

        {/* Hero Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.2] text-white max-w-4xl mx-auto"
        >
          <span>{t('hero.titlePrefix')} </span>
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]">
            {t('hero.titleHighlight')}
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-slate-300/90 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          {t('hero.description')}
        </motion.p>

        {/* Central Liquid Glass Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 max-w-2xl mx-auto"
        >
          <div className="relative group">
            {/* Ambient Glass Glow on hover */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/40 via-blue-500/40 to-indigo-500/40 blur-xl opacity-40 group-hover:opacity-75 transition duration-500 group-hover:duration-200" />
            
            <div className="relative flex items-center rounded-2xl liquid-glass border border-white/25 px-4 py-2 sm:py-3 shadow-2xl">
              <Search className={`w-5 h-5 text-cyan-400 shrink-0 ${isRTL ? 'ml-3' : 'mr-3'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('hero.searchPlaceholder')}
                className="w-full bg-transparent border-none text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-0 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-2 py-1 text-xs text-slate-400 hover:text-white rounded-md bg-white/10 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* 3 Metric Pills with Liquid Glass Surface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          <div className="liquid-glass rounded-2xl p-4 border border-white/10 flex items-center gap-3.5 text-start transition-all hover:border-cyan-400/30">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-xl font-black text-white">{t('hero.stat1Value')}</div>
              <div className="text-xs text-slate-400">{t('hero.stat1Label')}</div>
            </div>
          </div>

          <div className="liquid-glass rounded-2xl p-4 border border-white/10 flex items-center gap-3.5 text-start transition-all hover:border-blue-400/30">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-xl font-black text-white">{t('hero.stat2Value')}</div>
              <div className="text-xs text-slate-400">{t('hero.stat2Label')}</div>
            </div>
          </div>

          <div className="liquid-glass rounded-2xl p-4 border border-white/10 flex items-center gap-3.5 text-start transition-all hover:border-indigo-400/30">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="text-xl font-black text-white">{t('hero.stat3Value')}</div>
              <div className="text-xs text-slate-400">{t('hero.stat3Label')}</div>
            </div>
          </div>
        </motion.div>

        {/* Scroll down indicator */}
        <a 
          href="#catalog"
          className="inline-flex flex-col items-center gap-1.5 mt-12 text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <span className="text-xs font-medium">{t('nav.catalog')}</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </a>

      </div>
    </section>
  );
};
