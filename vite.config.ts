import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', ''); // Carga variables de .env, .env.local, etc.
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY), // Mantener por si se usa directamente
        'process.env.REACT_APP_POLYGON_API_KEY': JSON.stringify(env.POLYGON_API_KEY) // Añadido para Polygon
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'), // Updated alias
        }
      }
    };
});