// filepath: [HomePage.tsx](http://_vscodecontentref_/8)
import React, { useEffect, useState } from 'react';
import CityCard from '../components/CityCard';
import { City } from '../config/types';
import { useAppContext } from '../hooks/useAppContext';

const HomePage: React.FC = () => {
  const { t } = useAppContext();
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    fetch('/data/cities.json')
      .then(res => res.json())
      .then(setCities);
  }, []);

  return (
    <div className="homepage">
      <h1>{t('Itinerario familiar de 30 días por Argentina')}</h1>
      <div className="city-list">
        {cities.map(city => (
          <CityCard key={city.name} city={city} onSelect={(name) => window.location.href = `/ciudades/${name}.html`} />
        ))}
      </div>
      {/* Aquí puedes agregar los módulos: conversor de moneda, lista de equipaje, consulta IA */}
    </div>
  );
};

export default HomePage;