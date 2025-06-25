// filepath: [TopBar.tsx](http://_vscodecontentref_/5)
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';

const TopBar: React.FC = () => {
  const { language, setLanguage, currency, setCurrency, t } = useAppContext();

  return (
    <header className="top-bar">
      <span>{t('Idioma')}:</span>
      <button className={language === 'es' ? 'active' : ''} onClick={() => setLanguage('es')}>{t('ES')}</button>
      <button className={language === 'he' ? 'active' : ''} onClick={() => setLanguage('he')}>{t('HE')}</button>
      <span>{t('Moneda')}:</span>
      <button className={currency === 'ARS' ? 'active' : ''} onClick={() => setCurrency('ARS')}>{t('ARS')}</button>
      <button className={currency === 'USD' ? 'active' : ''} onClick={() => setCurrency('USD')}>{t('USD')}</button>
      <button className={currency === 'ILS' ? 'active' : ''} onClick={() => setCurrency('ILS')}>{t('ILS')}</button>
      <button className={currency === 'EUR' ? 'active' : ''} onClick={() => setCurrency('EUR')}>{t('EUR')}</button>
    </header>
  );
};

export default TopBar;
