import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogo } from './BrandLogo';
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer id="about" className="relative mt-20 sm:mt-24 bg-[#0F172A] border-t border-slate-800 pt-12 sm:pt-16 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-8 text-white overflow-hidden w-full max-w-full">
      
      {/* Dynamic Liquid Water Glow in the Footer (Safely contained inside overflow-hidden wrapper) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="liquid-blob w-80 sm:w-[500px] h-60 sm:h-[300px] -bottom-10 sm:-bottom-20 left-1/4 sm:left-1/3 bg-orange-500/10"
          style={{ animationDuration: '20s' }}
        />
        <div 
          className="liquid-blob w-72 sm:w-[400px] h-60 sm:h-[300px] -bottom-10 right-5 sm:right-10 bg-blue-500/5"
          style={{ animationDuration: '25s', animationDelay: '-6s' }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 sm:mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <motion.div 
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="h-10 sm:h-12 flex items-center justify-start shrink-0"
              >
                <BrandLogo className="h-9 sm:h-12 w-auto max-w-[120px] sm:max-w-[190px] filter drop-shadow-[0_2px_12px_rgba(249,115,22,0.3)]" />
              </motion.div>
              <span className="text-xl sm:text-2xl font-black text-white">
                {t('brand.fullName')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md leading-relaxed">
              {t('footer.description')}
            </p>

            {/* Quality & Trust Badge with Liquid Meniscus */}
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-semibold bg-slate-900/90 border border-slate-800 text-slate-300 shadow-inner cursor-default"
            >
              <CheckCircle2 className="w-4 h-4 text-[#F97316] shrink-0" />
              <span>
                {language === 'ar' ? 'قطع غيار معتمدة 100% وأصلية' : '100% Certified OEM Quality'}
              </span>
            </motion.div>
          </div>

          {/* Quick Links with Hover Animation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
              {t('nav.categories')}
            </h4>
            <ul className="space-y-2 text-xs font-medium text-[#94A3B8]">
              <li><a href="#categories" className="hover:text-orange-400 hover:translate-x-1 inline-block transition-all duration-200">Brakes & Rotors</a></li>
              <li><a href="#categories" className="hover:text-orange-400 hover:translate-x-1 inline-block transition-all duration-200">Engine Components</a></li>
              <li><a href="#categories" className="hover:text-orange-400 hover:translate-x-1 inline-block transition-all duration-200">Suspension & Steering</a></li>
              <li><a href="#categories" className="hover:text-orange-400 hover:translate-x-1 inline-block transition-all duration-200">Electrical & Ignition</a></li>
            </ul>
          </div>

          {/* Engineering & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
              {t('footer.trustTitle')}
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {t('footer.trustDescription')}
            </p>
            <div className="text-[11px] font-mono text-slate-400">
              Cairo, Egypt • Instant Logistics
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 sm:pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} شيخون (Shikhon).</span>
            <span>{t('footer.allRightsReserved')}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-400">High Reliability Auto Parts Showcase</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
