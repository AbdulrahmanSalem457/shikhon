import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getSupabaseConfig, reinitializeSupabase } from '../lib/supabase';
import { Globe, LogOut, Settings, Database, Shield, Sparkles, Check, X } from 'lucide-react';

export const AdminNavbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, logout, isDemoUser } = useAuth();
  const [showConfigModal, setShowConfigModal] = useState(false);
  
  const currentConfig = getSupabaseConfig();
  const [sbUrl, setSbUrl] = useState(currentConfig.url);
  const [sbKey, setSbKey] = useState(currentConfig.anonKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    reinitializeSupabase(sbUrl, sbKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowConfigModal(false);
      window.location.reload();
    }, 1200);
  };

  return (
    <>
      <header className="sticky top-0 z-40 px-4 sm:px-6 py-3 liquid-glass border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full liquid-pill flex items-center justify-center p-1.5 border border-cyan-400/40">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">
                  {t('brand.name')}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {t('brand.adminTitle')}
                </span>
                {isDemoUser && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Demo Mode
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:block">
                {t('brand.sub')}
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            
            {/* Supabase Config button */}
            <button
              onClick={() => setShowConfigModal(true)}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-colors"
              title="Supabase Settings"
            >
              <Database className="w-4 h-4 text-cyan-400" />
            </button>

            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="flex items-center p-1 rounded-full liquid-pill cursor-pointer hover:border-cyan-400/50 transition-all text-xs font-bold"
            >
              <span className={`px-2.5 py-1 rounded-full transition-all ${
                language === 'ar' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'text-slate-400'
              }`}>
                عربي
              </span>
              <span className={`px-2.5 py-1 rounded-full transition-all ${
                language === 'en' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'text-slate-400'
              }`}>
                EN
              </span>
              <Globe className="w-3.5 h-3.5 mx-1.5 text-slate-400" />
            </button>

            {/* User info & Sign out */}
            {user && (
              <div className="flex items-center gap-2 ps-2 border-s border-white/10">
                <span className="text-xs text-slate-300 font-medium hidden md:block max-w-[160px] truncate">
                  {user.email}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/25 text-xs font-semibold transition-colors"
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

      {/* Supabase Connection Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md liquid-glass rounded-3xl p-6 border border-white/20 shadow-2xl">
            <button
              onClick={() => setShowConfigModal(false)}
              className="absolute top-4 end-4 p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">
                {t('auth.supabaseConfig')}
              </h3>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  {t('auth.supabaseUrl')}
                </label>
                <input
                  type="url"
                  required
                  value={sbUrl}
                  onChange={(e) => setSbUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  {t('auth.supabaseKey')}
                </label>
                <input
                  type="password"
                  required
                  value={sbKey}
                  onChange={(e) => setSbKey(e.target.value)}
                  placeholder="eyJhbGciOi..."
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs"
                />
              </div>

              {savedSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>تم حفظ الإعدادات وتحديث الاتصال!</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium"
                >
                  {t('form.cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20"
                >
                  {t('auth.saveConfig')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
