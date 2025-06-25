
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { FALLBACK_EXCHANGE_RATES, SupportedCurrency, SUPPORTED_CURRENCIES } from '../config/constants';
import { exchangeRateService } from '../services/apiService';

interface ExchangeRates {
  [from: string]: {
    [to: string]: number;
  };
}

export const CurrencyConverter: React.FC = () => {
  const { t } = useAppContext();
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<SupportedCurrency>('ARS');
  const [toCurrency, setToCurrency] = useState<SupportedCurrency>('USD');
  const [result, setResult] = useState<number | null>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(FALLBACK_EXCHANGE_RATES);
  const [rateSource, setRateSource] = useState<'live' | 'cached' | 'fallback'>('fallback');
  const [isUpdating, setIsUpdating] = useState(false);

  // Cargar tasas desde localStorage al inicio
  useEffect(() => {
    const cachedRates = localStorage.getItem('exchangeRates');
    const cacheTimestamp = localStorage.getItem('exchangeRatesTimestamp');
    
    if (cachedRates && cacheTimestamp) {
      const now = Date.now();
      const cacheAge = now - parseInt(cacheTimestamp);
      const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos
      
      if (cacheAge < CACHE_DURATION) {
        setExchangeRates(JSON.parse(cachedRates));
        setRateSource('cached');
      }
    }
  }, []);

  // Función para obtener tasas actualizadas
  const updateExchangeRates = async () => {
    setIsUpdating(true);
    try {
      const rates = await exchangeRateService.getExchangeRates();
      if (rates) {
        setExchangeRates(rates);
        setRateSource('live');
        
        // Guardar en localStorage
        localStorage.setItem('exchangeRates', JSON.stringify(rates));
        localStorage.setItem('exchangeRatesTimestamp', Date.now().toString());
      }
    } catch (error) {
      console.error('Error updating exchange rates:', error);
      // Mantener tasas actuales (cached o fallback)
    } finally {
      setIsUpdating(false);
    }
  };

  // Función para convertir moneda
  const convertCurrency = (amount: number, from: SupportedCurrency, to: SupportedCurrency): number => {
    if (from === to) return amount;
    
    // Intentar conversión directa
    const directRate = exchangeRates[from]?.[to];
    if (directRate) {
      return amount * directRate;
    }
    
    // Bridge vía USD si no hay tasa directa
    if (from !== 'USD' && to !== 'USD') {
      const toUsdRate = exchangeRates[from]?.['USD'];
      const fromUsdRate = exchangeRates['USD']?.[to];
      
      if (toUsdRate && fromUsdRate) {
        return amount * toUsdRate * fromUsdRate;
      }
    }
    
    // Fallback final
    const fallbackRate = FALLBACK_EXCHANGE_RATES[from]?.[to];
    if (fallbackRate) {
      return amount * fallbackRate;
    }
    
    return amount; // Si todo falla, devolver cantidad original
  };

  // Realizar conversión cuando cambien los valores
  useEffect(() => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      const converted = convertCurrency(numAmount, fromCurrency, toCurrency);
      setResult(converted);
    } else {
      setResult(null);
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  const getRateSourceIcon = () => {
    switch (rateSource) {
      case 'live': return '🟢';
      case 'cached': return '🟡';
      case 'fallback': return '🔴';
      default: return '🔴';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {t('currency_converter_title')}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Cantidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('amount')}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="100"
            min="0"
            step="0.01"
          />
        </div>

        {/* Moneda origen */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('from_currency')}
          </label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value as SupportedCurrency)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SUPPORTED_CURRENCIES.map(curr => (
              <option key={curr} value={curr}>{t(curr)}</option>
            ))}
          </select>
        </div>

        {/* Moneda destino */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('to_currency')}
          </label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value as SupportedCurrency)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SUPPORTED_CURRENCIES.map(curr => (
              <option key={curr} value={curr}>{t(curr)}</option>
            ))}
          </select>
        </div>

        {/* Botón convertir */}
        <div className="flex items-end">
          <button
            onClick={updateExchangeRates}
            disabled={isUpdating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-md transition-colors"
          >
            {isUpdating ? t('loading') : t('update_rates')}
          </button>
        </div>
      </div>

      {/* Resultado */}
      {result !== null && (
        <div className="bg-gray-50 rounded-md p-4 mb-4">
          <div className="text-2xl font-bold text-gray-800">
            {amount} {t(fromCurrency)} = {result.toFixed(2)} {t(toCurrency)}
          </div>
        </div>
      )}

      {/* Fuente de tasa */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {t('exchange_rate_source')} {getRateSourceIcon()} {t(`${rateSource}_rates`)}
        </span>
        <button
          onClick={updateExchangeRates}
          disabled={isUpdating}
          className="text-blue-600 hover:text-blue-800 disabled:text-blue-300"
        >
          {t('update_rates')}
        </button>
      </div>
    </div>
  );
};
