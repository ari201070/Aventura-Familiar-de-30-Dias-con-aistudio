import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { PolygonRateResponse, Language } from '../config/types';
// import { GEMINI_API_KEY, POLYGON_API_KEY } from '../config/constants'; // We'll define them here from robust env access

// Function to safely get environment variables
const getEnvVariable = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && typeof process.env[key] === 'string') {
    return process.env[key] as string;
  }
  // console.warn(`Environment variable ${key} not found or process.env is not standard.`);
  return ""; 
};

export const GEMINI_API_KEY = getEnvVariable('API_KEY');
export const POLYGON_API_KEY = getEnvVariable('REACT_APP_POLYGON_API_KEY');


// --- Gemini AI Service ---
let ai: GoogleGenAI | null = null;
if (GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  } catch (e) {
    console.error("Error initializing GoogleGenAI, possibly due to API key or environment issues:", e);
    // ai remains null
  }
} else {
  console.warn("Gemini API key not found. AI features will be limited.");
}

export const askGemini = async (userPrompt: string, currentLanguage: Language): Promise<string> => {
  if (!ai) {
    return currentLanguage === Language.HE ? "שירות הבינה המלאכותית אינו זמין (חסר מפתח API או שגיאת אתחול)." : "AI service is unavailable (API key missing or initialization error).";
  }
  try {
    const languageInstruction = currentLanguage === Language.HE ? "Respond in Hebrew." : "Respond in Spanish.";
    // Ensure the prompt is not excessively long and is well-formed.
    // Basic prompts like "tell me a story" are fine. Complex structured prompts need care.
    const fullPrompt = `${userPrompt}\n\n${languageInstruction}`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: fullPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return currentLanguage === Language.HE ? "אירעה שגיאה בתקשורת עם הבינה המלאכותית." : "An error occurred while contacting the AI.";
  }
};

// --- Currency Conversion Service (Polygon.io) ---
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface CachedRate {
  rate: number;
  timestamp: number;
}

const getPolygonExchangeRate = async (fromCurrency: string, toCurrency: string): Promise<number | null> => {
  if (!POLYGON_API_KEY) {
    console.warn("Polygon.io API key not found (REACT_APP_POLYGON_API_KEY). Currency conversion will use fallback or be disabled.");
    // Fallback for common offline scenario or missing key
    if (fromCurrency === 'USD' && toCurrency === 'ARS') return 900; 
    if (fromCurrency === 'ARS' && toCurrency === 'USD') return 1/900;
    if (fromCurrency === 'EUR' && toCurrency === 'ARS') return 950;
    if (fromCurrency === 'ARS' && toCurrency === 'EUR') return 1/950;
    if (fromCurrency === 'ILS' && toCurrency === 'ARS') return 250;
    if (fromCurrency === 'ARS' && toCurrency === 'ILS') return 1/250;
    return null;
  }

  if (fromCurrency === toCurrency) return 1;

  const url = `https://api.polygon.io/v2/aggs/ticker/C:${fromCurrency}${toCurrency}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`;
  try {
    const response = await fetch(url);
    const data: PolygonRateResponse = await response.json();

    if (!response.ok || data.status === "ERROR" || !data.results || data.results.length === 0) {
      console.error(`Error fetching rate for ${fromCurrency}/${toCurrency} from Polygon.io: ${data.error || response.statusText}`);
      return null;
    }
    return data.results[0].c; 
  } catch (error) {
    console.error(`Network error fetching rate for ${fromCurrency}/${toCurrency}:`, error);
    return null;
  }
};

export const getCachedExchangeRate = async (from: string, to: string): Promise<number | null> => {
  if (from === to) return 1.0;
  const cacheKey = `exchangeRate_${from}_${to}`;
  
  try {
    const cachedItem = localStorage.getItem(cacheKey);
    if (cachedItem) {
      const cached: CachedRate = JSON.parse(cachedItem);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        // console.log(`Using cached rate for ${from}->${to}: ${cached.rate}`);
        return cached.rate;
      } else {
        localStorage.removeItem(cacheKey); // Cache expired
      }
    }
  } catch (e) {
    console.error("Error reading from localStorage for exchange rate:", e);
  }

  // console.log(`Fetching fresh rate for ${from}->${to}`);
  const rate = await getPolygonExchangeRate(from, to);
  if (rate !== null) {
    try {
      const newItem: CachedRate = { rate, timestamp: Date.now() };
      localStorage.setItem(cacheKey, JSON.stringify(newItem));
    } catch (e) {
      console.error("Error saving to localStorage for exchange rate:", e);
    }
  }
  return rate;
};


export const convertCurrency = async (amount: number, fromCurrency: string, toCurrency: string): Promise<number | null> => {
  if (fromCurrency === toCurrency) return amount;

  let rate = await getCachedExchangeRate(fromCurrency, toCurrency);

  if (rate !== null) {
    return amount * rate;
  } else {
    // Try bridge conversion via USD if direct rate failed and currencies are not USD
    if (fromCurrency !== 'USD' && toCurrency !== 'USD') {
      console.log(`Direct rate ${fromCurrency}->${toCurrency} not found or failed. Trying bridge conversion via USD.`);
      const rateFromToUSD = await getCachedExchangeRate(fromCurrency, 'USD');
      const rateUSDToTo = await getCachedExchangeRate('USD', toCurrency);

      if (rateFromToUSD !== null && rateUSDToTo !== null) {
        const finalAmount = amount * rateFromToUSD * rateUSDToTo;
        // Cache the bridged rate for future direct use (fromCurrency -> toCurrency)
        const bridgedRate = rateFromToUSD * rateUSDToTo;
        try {
            const newItem: CachedRate = { rate: bridgedRate, timestamp: Date.now() };
            localStorage.setItem(`exchangeRate_${fromCurrency}_${toCurrency}`, JSON.stringify(newItem));
        } catch (e) {
            console.error("Error saving bridged rate to localStorage:", e);
        }
        return finalAmount;
      }
    }
  }
  
  console.error(`Could not convert ${fromCurrency} to ${toCurrency}, even with USD bridge or cache.`);
  // Attempt to provide a very basic fallback if API key is missing, for critical pairs
  if (!POLYGON_API_KEY) {
    if (fromCurrency === 'USD' && toCurrency === 'ARS') return amount * 900;
    if (fromCurrency === 'ARS' && toCurrency === 'USD') return amount * (1/900);
    if (fromCurrency === 'EUR' && toCurrency === 'ARS') return amount * 950;
    if (fromCurrency === 'ARS' && toCurrency === 'EUR') return amount * (1/950);
    if (fromCurrency === 'ILS' && toCurrency === 'ARS') return amount * 250;
    if (fromCurrency === 'ARS' && toCurrency === 'ILS') return amount * (1/250);
  }
  return null; 
};
