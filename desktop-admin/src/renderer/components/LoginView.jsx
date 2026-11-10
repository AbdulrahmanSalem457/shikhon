import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';
import { getSupabaseConfig, reinitializeSupabase } from '../lib/supabase';
import { Lock, Mail, AlertCircle, ChevronDown, Database, Check, UserPlus, LogIn, Sparkles } from 'lucide-react';

export const LoginView = () => {
  const { t, isRTL, language } = useLanguage();
  const { loginWithPassword, signUpWithPassword, loginAsDemo } = useAuth();

  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Supabase quick config toggle
  const [showConfig, setShowConfig] = useState(false);
  const currentConfig = getSupabaseConfig();
  const [urlInput, setUrlInput] = useState(currentConfig.url);
  const [keyInput, setKeyInput] = useState(currentConfig.anonKey);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg(t('auth.fillAllFields'));
      return;
    }

    if (password.length < 6) {
      setErrorMsg(language === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);

      if (mode === 'signup') {
        await signUpWithPassword(email, password);
        setSuccessMsg(language === 'ar' ? 'تم إنشاء الحساب بنجاح! جاري تسجيل الدخول...' : 'Account created successfully! Logging in...');
        
        setTimeout(async () => {
          try {
            await loginWithPassword(email, password);
          } catch (ign) {
            setMode('signin');
          }
        }, 1200);
      } else {
        await loginWithPassword(email, password);
      }
    } catch (err) {
      console.error('Auth error:', err);
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
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 relative overflow-hidden transition-colors">
      
      {/* Background Calm Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-400/10 via-blue-400/10 to-indigo-400/10 dark:from-cyan-600/20 dark:via-blue-600/20 dark:to-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 my-8">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-3xl liquid-pill flex items-center justify-center p-2.5 mb-4 shadow-sm">
            <BrandLogo className="w-full h-full" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('brand.name')}
          </h1>
          <p className="text-xs uppercase tracking-widest font-bold text-sky-600 dark:text-cyan-300 mt-1">
            {t('brand.adminTitle')}
          </p>
        </div>

        {/* Login Liquid Glass Card */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-xl relative">
          
          {/* Mode Switcher: Sign In vs Sign Up */}
          <div className="flex p-1 rounded-2xl liquid-pill mb-6">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signin'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
            </button>

            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'إنشاء حساب مشرف' : 'Create Account'}</span>
            </button>
          </div>

          <div className="mb-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {mode === 'signin' 
                ? (language === 'ar' ? 'تسجيل دخول المشرف' : 'Admin Sign In')
                : (language === 'ar' ? 'إنشاء حساب مشرف جديد في Supabase' : 'Create New Supabase Admin Account')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {mode === 'signin'
                ? t('auth.subtitle')
                : (language === 'ar' ? 'أدخل بريدك وكلمة المرور لإنشاء حسابك فوراً' : 'Enter your email & password to register')}
            </p>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-red-50 dark:bg-red-500/15 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
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
                  className={`w-full py-2.5 rounded-xl glass-input text-xs ${isRTL ? 'pr-10 pl-3.5' : 'pl-10 pr-3.5'}`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full py-2.5 rounded-xl glass-input text-xs ${isRTL ? 'pr-10 pl-3.5' : 'pl-10 pr-3.5'}`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {loading 
                ? (mode === 'signup' ? 'جاري إنشاء الحساب...' : t('auth.loggingIn'))
                : (mode === 'signup' ? (language === 'ar' ? 'إنشاء حساب المشرف' : 'Create Admin Account') : t('auth.loginButton'))}
            </button>

          </form>

          {/* Quick Demo Access Mode */}
          <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-white/10 text-center">
            <button
              type="button"
              onClick={loginAsDemo}
              className="w-full py-2 px-3 rounded-xl liquid-pill text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('auth.demoLogin')}</span>
            </button>
          </div>

        </div>

        {/* Footnote */}
        <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-6">
          Shikhon Automotive Spare Parts Platform • Supabase Auth
        </p>

      </div>
    </div>
  );
};