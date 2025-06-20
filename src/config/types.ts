export enum Language {
  ES = 'es',
  HE = 'he',
}

export enum Currency {
  ARS = 'ARS',
  USD = 'USD',
  ILS = 'ILS',
  EUR = 'EUR',
}

export interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
}

export type TranslationSet = Record<string, string>;

export interface City {
  name: string;
  description: string;
  images: string[];
  accommodation?: string;
  food?: string;
  attractions?: string;
  budget?: string;
  tips?: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  city?: string;
  date?: string;
  type?: string;
}

export interface Event {
  id: string;
  summary: string;
  date: string;
  location?: string;
  city?: string;
  details?: string;
}