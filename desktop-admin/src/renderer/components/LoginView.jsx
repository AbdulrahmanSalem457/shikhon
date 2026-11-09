import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getSupabaseConfig, saveSupabaseConfig, reinitializeSupabase } from '../lib/supabase';
import { Lock, Mail, Shield, AlertCircle, Sparkles, ChevronDown, Database, ArrowRight } from 'lucide-react';

export const LoginView = () => {
  const { t, isRTL } = useLanguage();
  const { loginWithPassword, loginAsDemo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Supabase quick config toggle
  const [showConfig, setShowConfig] = useState(false);
  const currentConfig = getSupabaseConfig();
  const [urlInput, setUrlInput] = useState(currentConfig.url);
  const [keyInput, setKeyInput] = useState(currentConfig.anonKey);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg(t('auth.fillAllFields'));
      return;
    }

    try {
      setLoading(true);
      await loginWithPassword(email, password);
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(err.message || t('auth.invalidLogin'));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = () => {
    reinitializeSupabase(urlInput, keyInput);
    setShowConfig(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Animated Aurora Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/20 to-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Icon Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-3xl liquid-pill flex items-center justify-center p-3 border border-cyan-400/40 shadow-xl shadow-cyan-500/10 mb-4 animate-float">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {t('brand.name')}
          </h1>
          <p className="text-xs uppercase tracking-widest font-bold text-cyan-300 mt-1">
            {t('brand.adminTitle')}
          </p>
        </div>

        {/* Login Liquid Glass Card */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl relative">
          
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">
              {t('auth.title')}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t('auth.subtitle')}
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-5 p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shikhon-parts.com"
                  className={`w-full py-2.5 rounded-xl glass-input text-white text-xs ${isRTL ? 'pr-10 pl-3.5' : 'pl-10 pr-3.5'}`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full py-2.5 rounded-xl glass-input text-white text-xs ${isRTL ? 'pr-10 pl-3.5' : 'pl-10 pr-3.5'}`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? t('auth.loggingIn') : t('auth.loginButton')}
            </button>

          </form>

          {/* Quick Demo Access Mode */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={loginAsDemo}
              className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('auth.demoLogin')}</span>
            </button>
          </div>

          {/* Supabase URL & Key Expandable Config */}
          <div className="mt-4 pt-2">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="w-full text-slate-400 hover:text-slate-200 text-[11px] font-medium flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Database className="w-3 h-3 text-cyan-400" />
                <span>{t('auth.supabaseConfig')}</span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${showConfig ? 'rotate-180' : ''}`} />
            </button>

            {showConfig && (
              <div className="mt-3 p-3 rounded-2xl bg-black/40 border border-white/10 space-y-2.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">{t('auth.supabaseUrl')}</span>
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://xyz.supabase.co"
                    className="w-full px-2.5 py-1.5 rounded-lg glass-input text-white text-[11px]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">{t('auth.supabaseKey')}</span>
                  <input
                    type="password"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="eyJhbGciOi..."
                    className="w-full px-2.5 py-1.5 rounded-lg glass-input text-white text-[11px]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="w-full py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 font-semibold text-[11px] transition-colors"
                >
                  {t('auth.saveConfig')}
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Footnote */}
        <p className="text-center text-[11px] text-slate-500 mt-6">
          Shikhon Automotive Spare Parts Platform • Supabase Auth
        </p>

      </div>
    </div>
  );
};
