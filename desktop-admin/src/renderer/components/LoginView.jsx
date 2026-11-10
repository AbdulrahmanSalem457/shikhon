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

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 relative overflow-hidden bg-[#F8FAFC] dark:bg-[#090D16] transition-colors">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-orange-100 via-slate-100 to-amber-50 dark:from-orange-500/10 dark:via-amber-500/5 dark:to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 my-8">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="h-24 mx-auto flex items-center justify-center p-1 mb-3">
            <BrandLogo className="h-24 w-auto max-w-[260px]" />
          </div>
          <h1 className="text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            {t('brand.name')}
          </h1>
          <p className="text-xs uppercase tracking-widest font-bold text-[#F97316] mt-1">
            {t('brand.adminTitle')}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-[#1E293B] relative transition-colors">
          
          {/* Mode Switcher: Sign In vs Sign Up */}
          <div className="flex p-1 rounded-2xl bg-[#F8FAFC] dark:bg-[#090D16] border border-slate-200 dark:border-[#1E293B] mb-6">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signin'
                  ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-sm'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
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
                  ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-sm'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'إنشاء حساب مشرف' : 'Create Account'}</span>
            </button>
          </div>

          <div className="mb-5">
            <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              {mode === 'signin' 
                ? (language === 'ar' ? 'تسجيل دخول المشرف' : 'Admin Sign In')
                : (language === 'ar' ? 'إنشاء حساب مشرف جديد في Supabase' : 'Create New Supabase Admin Account')}
            </h2>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              {mode === 'signin'
                ? t('auth.subtitle')
                : (language === 'ar' ? 'أدخل بريدك وكلمة المرور لإنشاء حسابك فوراً' : 'Enter your email & password to register')}
            </p>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] block mb-1.5">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 text-[#64748B] dark:text-[#94A3B8] absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shikhon-parts.com"
                  className={`w-full py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#090D16] border border-slate-300 dark:border-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] focus:border-[#F97316] dark:focus:border-[#FB923C] focus:bg-white dark:focus:bg-[#090D16] focus:outline-none focus:ring-2 focus:ring-orange-500/10 text-xs ${isRTL ? 'pr-10 pl-3.5' : 'pl-10 pr-3.5'}`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] block mb-1.5">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className={`w-4 h-4 text-[#64748B] dark:text-[#94A3B8] absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#090D16] border border-slate-300 dark:border-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] focus:border-[#F97316] dark:focus:border-[#FB923C] focus:bg-white dark:focus:bg-[#090D16] focus:outline-none focus:ring-2 focus:ring-orange-500/10 text-xs ${isRTL ? 'pr-10 pl-3.5' : 'pl-10 pr-3.5'}`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#FB923C] hover:to-[#EA580C] text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {loading 
                ? (mode === 'signup' ? 'جاري إنشاء الحساب...' : t('auth.loggingIn'))
                : (mode === 'signup' ? (language === 'ar' ? 'إنشاء حساب المشرف' : 'Create Admin Account') : t('auth.loginButton'))}
            </button>

          </form>

          {/* Quick Demo Access Mode */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-[#1E293B] text-center">
            <button
              type="button"
              onClick={loginAsDemo}
              className="w-full py-2 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#090D16] border border-slate-200 dark:border-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
              <span>{t('auth.demoLogin')}</span>
            </button>
          </div>

        </div>

        {/* Footnote */}
        <p className="text-center text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-6">
          Shikhon Automotive Spare Parts Platform • Supabase Auth
        </p>

      </div>
    </div>
  );
};
