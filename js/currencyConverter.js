// ===============================
// Conversor de Moneda MCP + Offline + Multilenguaje
// ===============================

const CURRENCIES = ['ARS', 'USD', 'EUR', 'ILS'];
const EXCHANGE_KEY = 'exchangeRates';

async function fetchRates() {
  try {
    const resp = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=ARS,USD,EUR,ILS');
    const data = await resp.json();
    if (data && data.rates) {
      localStorage.setItem(EXCHANGE_KEY, JSON.stringify({
        rates: data.rates,
        date: new Date().toISOString()
      }));
      return data.rates;
    }
  } catch (e) {}
  // Fallback: localStorage
  const cached = JSON.parse(localStorage.getItem(EXCHANGE_KEY));
  return cached ? cached.rates : null;
}

function convertCurrency(amount, from, to, rates) {
  if (from === to) return amount;
  // Siempre convierte a USD como intermediario si falta el par directo
  const usdAmount = from === 'USD' ? amount : amount / rates[from];
  return to === 'USD' ? usdAmount : usdAmount * rates[to];
}

async function handleCurrencyConvert(e) {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('amount').value);
  const from = document.getElementById('fromCurrency').value;
  const to = document.getElementById('toCurrency').value;
  const resultDiv = document.getElementById('result');
  if (isNaN(amount) || amount <= 0) {
    resultDiv.textContent = window.t ? window.t('conversor_monto_invalido') : 'Ingresa un monto válido.';
    return;
  }
  resultDiv.textContent = window.t ? window.t('cargando') : 'Cargando...';
  const rates = await fetchRates();
  if (!rates || !rates[from] || !rates[to]) {
    resultDiv.textContent = window.t ? window.t('conversor_error') : 'No se pudo obtener la tasa de cambio.';
    return;
  }
  const converted = convertCurrency(amount, from, to, rates);
  resultDiv.textContent = `${window.t ? window.t('conversor_resultado') : 'Resultado'}: ${converted.toLocaleString(undefined, {maximumFractionDigits: 2})} ${to}`;
}

function translateCurrencyConverter() {
  document.getElementById('currencyForm').querySelector('button').textContent = window.t ? window.t('convertirBtn') : 'Convertir';
}

function initCurrencyConverter() {
  document.getElementById('currencyForm').onsubmit = handleCurrencyConvert;
  translateCurrencyConverter();
  window.onLanguageChange = function () {
    translateCurrencyConverter();
  };
}

// Exponer para main.js
window.initCurrencyConverter = initCurrencyConverter;
