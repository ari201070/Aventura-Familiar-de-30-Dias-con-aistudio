import React from 'react';
import CityCard from '../components/CityCard';
import { CurrencyConverter } from '../components/CurrencyConverter';
import { PackingList } from '../components/PackingList';
import { TransportTable } from '../components/TransportTable';
import { AIQueryPanel } from '../components/AIQueryPanel';
import InteractiveMap from '../components/InteractiveMap';
import { useAppContext } from '../hooks/useAppContext';
import { CITIES } from '../config/constants';

const HomePage: React.FC = () => {
  const { t } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Título principal */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-4">
            {t('homepage_title')}
          </h1>
          <p className="text-xl text-center text-blue-100">
            {t('homepage_subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Conversor de Moneda */}
        <CurrencyConverter />

        {/* Lista de Equipaje */}
        <PackingList />

        {/* Tabla de Transporte */}
        <TransportTable />

        {/* Consultor IA General */}
        <AIQueryPanel />

        {/* Mapa Interactivo */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {t('interactive_map_title')}
          </h2>
          <InteractiveMap />
        </div>

        {/* Ciudades del itinerario */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {t('cities_itinerary_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CITIES.map(city => (
              <CityCard 
                key={city.id} 
                city={city} 
                onSelect={(cityId) => window.location.href = `#/city/${cityId}`} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
