import axios, { AxiosRequestConfig } from 'axios';

const MCP_ENDPOINTS = {
  googleCalendar: 'https://hooks.zapier.com/mcp/google-calendar/<tu-endpoint>',
  googleMaps: 'https://mcpmarket.com/server/travel-planner',
  argentinaTravelAgent: 'https://<tu-servidor-mcp-agente-viaje-argentina>'
};

async function callMcpService(endpoint: string, payload: any, config?: AxiosRequestConfig) {
  try {
    const response = await axios.post(endpoint, payload, config);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al conectar con el servicio MCP');
  }
}

export async function createCalendarEvent(eventData: any) {
  return callMcpService(MCP_ENDPOINTS.googleCalendar, {
    action: 'createEvent',
    data: eventData
  });
}

export async function getRouteFromGoogleMaps(origin: string, destination: string) {
  return callMcpService(MCP_ENDPOINTS.googleMaps, {
    action: 'getRoute',
    data: { origin, destination }
  });
}

export async function getArgentinaTravelActivities(query: any) {
  return callMcpService(MCP_ENDPOINTS.argentinaTravelAgent, {
    action: 'getActivities',
    data: query
  });
}

export default {
  createCalendarEvent,
  getRouteFromGoogleMaps,
  getArgentinaTravelActivities
};
