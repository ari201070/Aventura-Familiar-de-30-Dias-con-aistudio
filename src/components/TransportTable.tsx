
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { TRANSPORT_DATA, FALLBACK_EXCHANGE_RATES, SupportedCurrency } from '../config/constants';
import { exchangeRateService } from '../services/apiService';

interface TransportData {
  route: string;
  mode: 'bus' | 'plane' | 'car' | 'train';
  duration: string;
  priceARS: number;
  company?: string;
  notes?: string;
}

export const TransportTable: React.FC = () => {
  const { t, globalCurrency } = useAppContext();
  const [convertedPrices, setConvertedPrices] = useState<{[key: string]: number}>({});
  const [exchangeRates, setExchangeRates] = useState(FALLBACK_EXCHANGE_RATES);
  const [rateSource, setRateSource] = useState<'live' | 'cached' | 'fallback'>('fallback');

  // Cargar tasas de cambio
  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        const rates = await exchangeRateService.getExchangeRates();
        if (rates && Object.keys(rates).length > 0) {
          setExchangeRates(rates);
          setRateSource('live');
        }
      } catch (error) {
        // Intentar cargar desde caché
        const cachedRates = localStorage.getItem('exchangeRates');
        if (cachedRates) {
          setExchangeRates(JSON.parse(cachedRates));
          setRateSource('cached');
        }
        // Si falla todo, mantener fallback
      }
    };

    loadExchangeRates();
  }, []);

  // Convertir precios cuando cambie la moneda global o las tasas
  useEffect(() => {
    const converted: {[key: string]: number} = {};
    
    TRANSPORT_DATA.forEach((transport, index) => {
      if (globalCurrency === 'ARS') {
        converted[index] = transport.priceARS;
      } else {
        // Convertir de ARS a la moneda global via USD
        const usdAmount = transport.priceARS / exchangeRates.ARS;
        converted[index] = globalCurrency === 'USD' ? usdAmount : usdAmount * exchangeRates[globalCurrency];
      }
    });
    
    setConvertedPrices(converted);
  }, [globalCurrency, exchangeRates]);

  const getModeIcon = (mode: string) => {
    const icons = {
      bus: '🚌',
      plane: '✈️',
      car: '🚗',
      train: '🚂'
    };
    return icons[mode as keyof typeof icons] || '🚌';
  };

  const getRateSourceBadge = () => {
    const badges = {
      live: { color: 'bg-green-100 text-green-800', icon: '🟢', text: t('live_rates') },
      cached: { color: 'bg-yellow-100 text-yellow-800', icon: '🟡', text: t('cached_rates') },
      fallback: { color: 'bg-red-100 text-red-800', icon: '🔴', text: t('fallback_rates') }
    };
    
    const badge = badges[rateSource];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.icon} {badge.text}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
          {t('transport_table_title')}
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">{t('prices_in')}:</span>
          <span className="font-semibold text-blue-600">{globalCurrency}</span>
          {getRateSourceBadge()}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('route')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('transport_mode')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('duration')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('price')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('company')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('notes')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {TRANSPORT_DATA.map((transport, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {t(transport.route)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <span>{getModeIcon(transport.mode)}</span>
                    <span>{t(transport.mode)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transport.duration}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                  {convertedPrices[index]?.toFixed(2) || '...'} {globalCurrency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transport.company ? t(transport.company) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transport.notes ? t(transport.notes) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        {t('transport_disclaimer')}
      </div>
    </div>
  );
};
