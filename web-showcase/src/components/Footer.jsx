import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogo } from './BrandLogo';
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer id="about" className="relative mt-24 border-t border-slate-200/80 dark:border-white/10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors">
      
      {/* Background Soft Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-sky-500/5 dark:bg-cyan-600/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full liquid-pill flex items-center justify-center p-1.5">
                <BrandLogo className="w-full h-full" />
              </div>
              <span className="text-2xl font-black text-slate-800 dark:text-white">
                {t('brand.fullName')}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              {t('footer.description')}
            </p>

            {/* Quality & Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold liquid-pill text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                {language === 'ar' ? 'قطع غيار معتمدة 100% وأصلية' : '100% Certified OEM Quality'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-cyan-300 mb-4">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#catalog" className="hover:text-sky-600 dark:hover:text-white transition-colors">{t('nav.catalog')}</a></li>
              <li><a href="#categories" className="hover:text-sky-600 dark:hover:text-white transition-colors">{t('nav.categories')}</a></li>
              <li><a href="#about" className="hover:text-sky-600 dark:hover:text-white transition-colors">{t('nav.about')}</a></li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-cyan-300 mb-4">
              {language === 'ar' ? 'ضمان وأصالة' : '100% Guarantee'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {language === 'ar' 
                ? 'جميع قطع الغيار مطابقة للمواصفات القياسية ومعتمدة للاستخدام الفوري لجميع الموديلات.' 
                : 'All spare parts meet strict international manufacturing standards and are verified ready for immediate installation.'}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{language === 'ar' ? 'مركز قطع غيار معتمد' : 'Certified Automotive Store'}</span>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <div>
            {t('footer.rights')}
          </div>
          <div className="flex items-center gap-2">
            <span>{t('footer.poweredBy')}</span>
            <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-cyan-400" />
          </div>
        </div>

      </div>
    </footer>
  );
};