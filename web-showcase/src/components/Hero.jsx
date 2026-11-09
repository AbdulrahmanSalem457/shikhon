import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Search, Sparkles, Shield, Truck, Cpu, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero = ({ searchQuery, setSearchQuery }) => {
  const { t, isRTL } = useLanguage();
  const { isDark } = useTheme();

  return (
    <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Calm Ambient Mesh Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-sky-400/15 via-blue-400/10 to-indigo-400/10 dark:from-cyan-600/20 dark:via-blue-600/20 dark:to-purple-600/15 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center">
        
        {/* Release Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-pill text-xs font-semibold text-sky-600 dark:text-cyan-300 mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-cyan-400" />
          <span>{t('hero.badge')}</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.25] text-slate-900 dark:text-white max-w-3xl mx-auto"
        >
          <span>{t('hero.titlePrefix')} </span>
          <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-500 bg-clip-text text-transparent">
            {t('hero.titleHighlight')}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          {t('hero.description')}
        </motion.p>

        {/* Calm Apple Liquid Glass Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 max-w-xl mx-auto"
        >
          <div className="relative group">
            <div className="relative flex items-center rounded-2xl liquid-glass px-4 py-2 sm:py-2.5 shadow-sm hover:shadow-md transition-shadow">
              <Search className={`w-4 h-4 text-sky-500 dark:text-cyan-400 shrink-0 ${isRTL ? 'ml-3' : 'mr-3'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('hero.searchPlaceholder')}
                className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-0 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-2 py-0.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-md bg-slate-200/50 dark:bg-white/10 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* 3 Calm Metric Cards */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto"
        >
          <div className="liquid-glass rounded-2xl p-3.5 flex items-center gap-3 text-start">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 dark:bg-cyan-500/15 border border-sky-500/20 dark:border-cyan-500/30 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-900 dark:text-white">{t('hero.stat1Value')}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{t('hero.stat1Label')}</div>
            </div>
          </div>

          <div className="liquid-glass rounded-2xl p-3.5 flex items-center gap-3 text-start">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 dark:border-blue-500/30 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-900 dark:text-white">{t('hero.stat2Value')}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{t('hero.stat2Label')}</div>
            </div>
          </div>

          <div className="liquid-glass rounded-2xl p-3.5 flex items-center gap-3 text-start">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 dark:border-indigo-500/30 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-900 dark:text-white">{t('hero.stat3Value')}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{t('hero.stat3Label')}</div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <a 
          href="#catalog"
          className="inline-flex flex-col items-center gap-1 mt-10 text-slate-400 dark:text-slate-500 hover:text-sky-600 dark:hover:text-cyan-300 transition-colors"
        >
          <span className="text-[11px] font-medium">{t('nav.catalog')}</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
        </a>

      </div>
    </section>
  );
};
