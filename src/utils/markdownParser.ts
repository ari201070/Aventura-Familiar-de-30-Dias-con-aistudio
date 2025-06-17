import { useContext } from 'react';
import { LanguageContext } from '../constants';

export function useTranslation() {
  const { language, dictionary } = useContext(LanguageContext);
  return (key: string) => dictionary[language][key] || key;
}
