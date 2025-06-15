
import React, { useState, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppContext } from './contexts/AppContext'; 
import { Language, Currency, AppContextType, TranslationSet } from './config/types'; 
import { translations, LANGUAGES, CURRENCIES } from './config/constants'; 
import HomePage from './pages/HomePage';
import CityDetailPage from './pages/CityDetailPage';
import TopBar from './components/TopBar';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('appLanguage');
    return (savedLang && Object.values(Language).includes(savedLang as Language)) ? savedLang as Language : Language.ES;
  });
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const savedCurrency = localStorage.getItem('appCurrency');
    return (savedCurrency && Object.values(Currency).includes(savedCurrency as Currency)) ? savedCurrency as Currency : Currency.ARS;
  });

  useEffect(() => {
    document.documentElement.dir = language === Language.HE ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('appLanguage', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('appCurrency', currency);
  }, [currency]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
  };

  const t = useCallback((key: string, replacements?: Record<string, string>): string => {
    const langSet = translations[language] as TranslationSet;
    let translatedString = langSet[key] || key; // Fallback to key if translation not found
    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        translatedString = translatedString.replace(`{${placeholder}}`, replacements[placeholder]);
      });
    }
    return translatedString;
  }, [language]);

  const appContextValue: AppContextType = {
    language,
    setLanguage,
    currency,
    setCurrency,
    t,
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100">
          <TopBar />
          <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/city/:cityId" element={<CityDetailPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
