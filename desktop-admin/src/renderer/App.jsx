import React from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminNavbar } from './components/AdminNavbar';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';

const MainApp = () => {
  const { isAuthenticated, loading } = useAuth();
  const { isRTL } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-semibold tracking-wider">
            Loading Shikhon Admin...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#070b14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 ${isRTL ? 'font-ar' : 'font-en'}`}>
      <AdminNavbar />
      <main>
        {isAuthenticated ? <DashboardView /> : <LoginView />}
      </main>
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
