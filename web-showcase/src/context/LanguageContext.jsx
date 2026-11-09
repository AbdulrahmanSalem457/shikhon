import React, { createContext, useContext, useState, useEffect } from 'react';
import arTranslations from '../locales/ar.json';
import enTranslations from '../locales/en.json';

const translations = {
  ar: arTranslations,
  en: enTranslations,
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('shikhon_lang');
    return saved === 'en' ? 'en' : 'ar'; // Default to Arabic
  });

  useEffect(() => {
    localStorage.setItem('shikhon_lang', language);
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
    
    // Switch document title
    if (language === 'ar') {
      document.title = 'شيخون | قطع غيار سيارات أصلية';
    } else {
      document.title = 'Shikhon | Premium Automotive Spare Parts';
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const isRTL = language === 'ar';

  // Nested key resolver helper (e.g. t('hero.titlePrefix'))
  const t = (path, params = {}) => {
    const keys = path.split('.');
    let result = translations[language];
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        // Fallback to English if key missing in Arabic
        let fallback = translations.en;
        for (const fKey of keys) {
          fallback = fallback?.[fKey];
        }
        return fallback || path;
      }
    }

    if (typeof result === 'string') {
      let str = result;
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(new RegExp(`{{${k}}}`, 'g'), v);
      }
      return str;
    }
    return result || path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
