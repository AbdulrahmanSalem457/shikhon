import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogo } from './BrandLogo';
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer id="about" className="relative mt-24 bg-[#0F172A] border-t border-slate-800 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-white">
      
      {/* Subtle Warm Amber/Orange Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-orange-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 flex items-center justify-start">
                <BrandLogo className="h-12 w-auto max-w-[190px]" />
              </div>
              <span className="text-2xl font-black text-white">
                {t('brand.fullName')}
              </span>
            </div>
            <p className="text-sm text-[#94A3B8] max-w-md leading-relaxed">
              {t('footer.description')}
            </p>

            {/* Quality & Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F97316]" />
              <span>
                {language === 'ar' ? 'قطع غيار معتمدة 100% وأصلية' : '100% Certified OEM Quality'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
              {t('nav.categories')}
            </h4>
            <ul className="space-y-2 text-xs font-medium text-[#94A3B8]">
              <li><a href="#categories" className="hover:text-white transition-colors">Brakes & Rotors</a></li>
              <li><a href="#categories" className="hover:text-white transition-colors">Engine Components</a></li>
              <li><a href="#categories" className="hover:text-white transition-colors">Suspension & Steering</a></li>
              <li><a href="#categories" className="hover:text-white transition-colors">Electrical & Ignition</a></li>
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
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
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
