import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Wrench, ShieldCheck, Sparkles, ExternalLink, Code2 } from 'lucide-react';

export const Navbar = () => {
  const { language, toggleLanguage, t, isRTL } = useLanguage();
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
        className={`max-w-7xl mx-auto rounded-2xl sm:rounded-full px-5 py-3.5 transition-all duration-300 liquid-glass ${
          scrolled 
            ? 'shadow-[0_20px_40px_rgba(0,0,0,0.6)] border-white/20' 
            : 'shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-white/15'
        }`}
      >
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full liquid-pill flex items-center justify-center p-1.5 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-12">
              <img 
                src="/logo.svg" 
                alt="Shikhon Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" 
              />
              <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-pulse-subtle pointer-events-none" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  {t('brand.name')}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  Auto
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {t('brand.subtitle')}
              </span>
            </div>
          </a>

          {/* Center Navigation Links (Hidden on small mobile) */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-sm font-medium text-slate-300">
            <a 
              href="#catalog" 
              className="px-4 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
            >
              {t('nav.catalog')}
            </a>
            <a 
              href="#categories" 
              className="px-4 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
            >
              {t('nav.categories')}
            </a>
            <a 
              href="#about" 
              className="px-4 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
            >
              {t('nav.about')}
            </a>
          </div>

          {/* Right Action Controls: AR/EN Language Pill & Admin Link */}
          <div className="flex items-center gap-3">
            
            {/* Fluid AR / EN Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle Language"
              className="relative flex items-center p-1 rounded-full liquid-pill group cursor-pointer transition-all duration-300 hover:border-cyan-400/50"
            >
              <div className="flex items-center text-xs font-bold">
                {/* Arabic Label */}
                <span 
                  className={`px-2.5 py-1 rounded-full transition-all duration-300 ${
                    language === 'ar' 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  عربي
                </span>

                {/* English Label */}
                <span 
                  className={`px-2.5 py-1 rounded-full transition-all duration-300 ${
                    language === 'en' 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  EN
                </span>
              </div>
              <Globe className="w-3.5 h-3.5 mx-1.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </button>

            {/* Swagger API Explorer Link */}
            <a
              href="./swagger/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all duration-200"
              title="Open Swagger API Explorer"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Swagger API</span>
            </a>

            {/* Admin Dashboard Entry Link */}
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.06] hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-200 border border-white/15 hover:border-cyan-500/40 transition-all duration-200"
              title="Admin Portal (Desktop / Web)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('nav.adminPortal')}</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

          </div>

        </div>
      </nav>
    </header>
  );
};
