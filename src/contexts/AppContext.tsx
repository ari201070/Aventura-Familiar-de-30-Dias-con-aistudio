
import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Language, Currency, AppContextType } from '../config/types';
import { translations } from '../config/constants';

interface AppProviderProps {
  children: ReactNode;
}

export const AppContext = createContext<AppContextType>({
  language: Language.ES,
  setLanguage: () => {},
  currency: Currency.ARS,
  setCurrency: () => {},
  t: (key: string) => key,
});

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Cargar idioma y moneda desde localStorage
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'he' ? Language.HE : Language.ES);
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('currency');
    return (saved as Currency) || Currency.ARS;
  });

  // Función de traducción unificada
  const t = useCallback((key: string, replacements?: Record<string, string>): string => {
    const langCode = language === Language.HE ? 'he' : 'es';
    let translation = translations[langCode]?.[key] || key;
    
    // Soporte para reemplazos dinámicos (ej: "map_title": "Mapa de {city}")
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        translation = translation.replace(`{${placeholder}}`, value);
      });
    }
    
    return translation;
  }, [language]);

  // Setters que persisten en localStorage
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // Configurar dirección RTL para hebreo
    const isRTL = lang === Language.HE;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, []);

  const setCurrency = useCallback((curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem('currency', curr);
  }, []);

  // Configurar RTL al cargar
  useEffect(() => {
    const isRTL = language === Language.HE;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const contextValue: AppContextType = {
    language,
    setLanguage,
    currency,
    setCurrency,
    t,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
