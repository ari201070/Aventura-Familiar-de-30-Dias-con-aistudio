import React, { useEffect, useState } from 'react';
import CityCard from '../components/CityCard';
import { City } from '../types';
import { useTranslation } from '../utils/markdownParser';

const HomePage: React.FC = () => {
  const t = useTranslation();
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    fetch('/data/cities.json')
      .then(res => res.json())
      .then(setCities);
  }, []);

  return (
    <div className="homepage">
      <header className="top-bar">
        <button className="lang-btn">{t('ES')}</button>
        <button className="lang-btn">{t('HE')}</button>
        <button className="currency-btn">{t('ARS')}</button>
        <button className="currency-btn">{t('USD')}</button>
        <button className="currency-btn">{t('ILS')}</button>
        <button className="currency-btn">{t('EUR')}</button>
      </header>
      <h1>{t('Itinerario familiar de 30 días por Argentina')}</h1>
      <div className="city-list">
        {cities.map(city => (
          <CityCard key={city.name} city={city} onSelect={() => window.location.href = `/ciudades/${city.name}.html`} />
        ))}
      </div>
      {/* Conversor de moneda, lista de equipaje y consulta IA van aquí como módulos independientes */}
    </div>
  );
};

export default HomePage;
