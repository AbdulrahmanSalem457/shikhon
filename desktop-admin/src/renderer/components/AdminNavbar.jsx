import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BrandLogo } from './BrandLogo';
import { Globe, LogOut, Sun, Moon } from 'lucide-react';

export const AdminNavbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, logout, isDemoUser } = useAuth();

  return (
    <header className="sticky top-0 z-40 px-4 sm:px-6 py-3 liquid-glass border-b border-slate-200/80 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Info with BrandLogo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full liquid-pill flex items-center justify-center p-1">
            <BrandLogo className="w-full h-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {t('brand.name')}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 dark:bg-cyan-500/20 text-sky-600 dark:text-cyan-300 border border-sky-500/20 dark:border-cyan-500/30">
                {t('brand.adminTitle')}
              </span>
              {isDemoUser && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/25">
                  Demo Mode
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              {t('brand.sub')}
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          
          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-full liquid-pill hover:border-sky-400/50 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            title={isDark ? "تفعيل الوضع المضيء (Light Mode)" : "تفعيل الوضع الداكن (Dark Mode)"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Language Switcher Pill */}
          <button
            onClick={toggleLanguage}
            className="flex items-center p-1 rounded-full liquid-pill cursor-pointer hover:border-sky-400/50 transition-all text-xs font-bold"
          >
            <span className={`px-2.5 py-0.5 rounded-full transition-all ${
              language === 'ar' ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
            }`}>
              عربي
            </span>
            <span className={`px-2.5 py-0.5 rounded-full transition-all ${
              language === 'en' ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
            }`}>
              EN
            </span>
            <Globe className="w-3.5 h-3.5 mx-1.5 text-slate-400" />
          </button>

          {/* User info & Sign out */}
          {user && (
            <div className="flex items-center gap-2 ps-2 border-s border-slate-200 dark:border-white/10">
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium hidden md:block max-w-[160px] truncate">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/20 text-xs font-semibold transition-colors cursor-pointer"
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