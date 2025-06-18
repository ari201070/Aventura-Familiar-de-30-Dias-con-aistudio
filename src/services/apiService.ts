// services/apiService.ts

// ---- MCP Endpoints y funciones ----
const MCP_ENDPOINTS = {
  calendar: '/mcp/calendar',
  routes: '/mcp/routes',
  activities: '/mcp/activities',
  // ... agrega otros endpoints MCP aquí si tienes más
};

/**
 * Llama a un servicio MCP genérico.
 */
async function callMcpService(endpoint: string, data: any): Promise<any> {
  try {
    const response = await fetch(MCP_ENDPOINTS[endpoint], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('MCP service error');
    return await response.json();
  } catch (error) {
    console.error('MCP call failed:', error);
    throw error;
  }
}

/**
 * Crea un evento de calendario usando MCP.
 */
export async function createCalendarEvent(eventData: any): Promise<any> {
  return callMcpService('calendar', eventData);
}

/**
 * Obtiene una ruta desde Google Maps usando MCP.
 */
export async function getRouteFromGoogleMaps(routeData: any): Promise<any> {
  return callMcpService('routes', routeData);
}

/**
 * Obtiene actividades de viaje en Argentina usando MCP.
 */
export async function getArgentinaTravelActivities(activityData: any): Promise<any> {
  return callMcpService('activities', activityData);
}

// ---- Conversor de moneda robusto ----

export type SupportedCurrency = 'ARS' | 'USD' | 'EUR' | 'ILS';

/**
 * Tasas de cambio de respaldo (fallback) para modo offline.
 * Ajusta según la realidad.
 */
const fallbackRates: Record<SupportedCurrency, number> = {
  ARS: 1,
  USD: 900,
  EUR: 1000,
  ILS: 250
};

/**
 * Conversor de moneda usando exchangerate.host.
 * Si falla, usa tasas locales de fallback.
 */
export async function convertCurrency(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency
): Promise<number | null> {
  if (from === to) return amount;
  try {
    const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    if (typeof data.result === 'number') {
      return data.result;
    }
  } catch (e) {
    try {
      // Fallback offline: convierte primero a ARS, luego a la moneda destino
      const amountInARS = amount * (from === 'ARS' ? 1 : fallbackRates['ARS'] / fallbackRates[from]);
      const converted = to === 'ARS' ? amountInARS : amountInARS * (fallbackRates[to] / fallbackRates['ARS']);
      return converted;
    } catch (err) {
      return null;
    }
  }
  return null;
}

// ---- Otros servicios MCP o utilidades (agrega aquí los que uses) ----

// Ejemplo de exportación de otros servicios si los tienes:
// export async function otraFuncionMCP(data: any): Promise<any> {
//   return callMcpService('otroEndpoint', data);
// }
