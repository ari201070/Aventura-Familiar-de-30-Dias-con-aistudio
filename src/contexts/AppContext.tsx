import React from 'react';
import { Language, Currency, AppContextType } from '../config/types';

export const AppContext = React.createContext<AppContextType>({
  language: Language.ES,
  setLanguage: () => {},
  currency: Currency.ARS,
  setCurrency: () => {},
  t: (key: string) => key,
});