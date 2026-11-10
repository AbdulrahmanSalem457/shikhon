import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';
import { Globe, LogOut } from 'lucide-react';

export const AdminNavbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, logout, isDemoUser } = useAuth();

  return (
    <header className="sticky top-0 z-40 px-4 sm:px-6 py-3 bg-[#0F172A] border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Info with BrandLogo */}
        <div className="flex items-center gap-3">
          <div className="h-10 flex items-center justify-center">
            <BrandLogo className="h-9 w-auto max-w-[150px]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white">
                {t('brand.name')}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-[#F97316] border border-orange-500/30">
                {t('brand.adminTitle')}
              </span>
              {isDemoUser && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">
                  Demo Mode
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#94A3B8] hidden sm:block">
              {t('brand.sub')}
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">

          {/* Language Switcher Pill */}
          <button
            onClick={toggleLanguage}
            className="flex items-center p-1 rounded-full bg-slate-800/90 border border-slate-700 cursor-pointer hover:border-orange-500/50 transition-all text-xs font-bold"
          >
            <span className={`px-2.5 py-0.5 rounded-full transition-all ${
              language === 'ar' ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}>
              عربي
            </span>
            <span className={`px-2.5 py-0.5 rounded-full transition-all ${
              language === 'en' ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}>
              EN
            </span>
            <Globe className="w-3.5 h-3.5 mx-1.5 text-slate-400" />
          </button>

          {/* User info & Sign out */}
          {user && (
            <div className="flex items-center gap-2 ps-2 border-s border-slate-800">
              <span className="text-xs text-slate-300 font-medium hidden md:block max-w-[160px] truncate">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs font-semibold transition-colors cursor-pointer"
                title={t('auth.logout')}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('auth.logout')}</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
