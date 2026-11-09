import React from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminNavbar } from './components/AdminNavbar';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';

const MainApp = () => {
  const { isAuthenticated, loading } = useAuth();
  const { isRTL } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex items-center justify-center text-slate-800 dark:text-white transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-sky-500 dark:border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider">
            Loading Shikhon Admin...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 dark:bg-[#070b14] dark:text-slate-100 selection:bg-sky-500/20 selection:text-sky-700 dark:selection:bg-cyan-500/30 dark:selection:text-cyan-200 transition-colors ${isRTL ? 'font-ar' : 'font-en'}`}>
      <AdminNavbar />
      <main>
        {isAuthenticated ? <DashboardView /> : <LoginView />}
      </main>
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;