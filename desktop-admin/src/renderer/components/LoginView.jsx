import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';
import { getSupabaseConfig, reinitializeSupabase } from '../lib/supabase';
import { Lock, Mail, AlertCircle, ChevronDown, Database, Check, UserPlus, LogIn, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoginView = () => {
  const { t, isRTL, language } = useLanguage();
  const { loginWithPassword, signUpWithPassword, loginAsDemo } = useAuth();

  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 relative overflow-hidden bg-[#F8FAFC]">
      
      {/* 2 Dynamic Fluid Water Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div 
          className="liquid-blob w-[500px] h-[500px] top-1/4 left-1/3 bg-gradient-to-tr from-orange-400/20 via-amber-200/15 to-transparent" 
          style={{ animationDuration: '18s' }}
        />
        <div 
          className="liquid-blob w-[450px] h-[450px] bottom-10 right-1/4 bg-gradient-to-br from-slate-300/25 to-orange-300/10" 
          style={{ animationDuration: '22s', animationDelay: '-5s' }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 260 }}
        className="w-full max-w-md relative z-10 my-8"
      >
        
        {/* Brand Header with Water Bobbing */}
        <div className="text-center mb-8">
          <motion.div 
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="h-24 mx-auto flex items-center justify-center p-1 mb-3"
          >
            <BrandLogo className="h-24 w-auto max-w-[260px] filter drop-shadow-[0_4px_16px_rgba(249,115,22,0.35)]" />
          </motion.div>
          <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">
            {t('brand.name')}
          </h1>
          <p className="text-xs uppercase tracking-widest font-bold text-[#F97316] mt-1 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-ping" />
            {t('brand.adminTitle')}
          </p>
        </div>

        {/* Login Liquid Glass Card */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="specular-glare opacity-30 pointer-events-none" />

          {/* Mode Switcher: Sign In vs Sign Up */}
          <div className="flex p-1 rounded-2xl liquid-pill mb-6 relative z-10">
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signin'
                  ? 'liquid-button shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signup'
                  ? 'liquid-button shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'إنشاء حساب مشرف' : 'Create Account'}</span>
            </motion.button>
          </div>

          <div className="mb-5 relative z-10">
            <h2 className="text-base font-bold text-[#0F172A]">
              {mode === 'signin' 
                ? (language === 'ar' ? 'تسجيل دخول المشرف' : 'Admin Sign In')
                : (language === 'ar' ? 'إنشاء حساب مشرف جديد في Supabase' : 'Create New Supabase Admin Account')}
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              {mode === 'signin'
                ? t('auth.subtitle')
                : (language === 'ar' ? 'أدخل بريدك وكلمة المرور لإنشاء حسابك فوراً' : 'Enter your email & password to register')}
            </p>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 relative z-10"
            >
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 relative z-10"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            
            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1.5">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 text-[#64748B] absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
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
              <label className="text-xs font-semibold text-[#0F172A] block mb-1.5">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className={`w-4 h-4 text-[#64748B] absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
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

            {/* Submit Button (Liquid Button) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl liquid-button text-xs font-bold disabled:opacity-50 cursor-pointer shadow-lg shadow-orange-500/25"
            >
              {loading 
                ? (mode === 'signup' ? 'جاري إنشاء الحساب...' : t('auth.loggingIn'))
                : (mode === 'signup' ? (language === 'ar' ? 'إنشاء حساب المشرف' : 'Create Admin Account') : t('auth.loginButton'))}
            </motion.button>

          </form>

          {/* Quick Demo Access Mode */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center relative z-10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={loginAsDemo}
              className="w-full py-2.5 px-3 rounded-xl liquid-pill text-[#0F172A] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
              <span>{t('auth.demoLogin')}</span>
            </motion.button>
          </div>

        </div>

        {/* Footnote */}
        <p className="text-center text-[11px] text-[#64748B] mt-6">
          Shikhon Automotive Spare Parts Platform • Supabase Auth
        </p>

      </motion.div>
    </div>
  );
};
