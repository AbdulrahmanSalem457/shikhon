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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-[#0F172A]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#64748B] font-semibold tracking-wider">
            Loading Shikhon Admin...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-orange-500/20 selection:text-orange-900 ${isRTL ? 'font-ar' : 'font-en'}`}>
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