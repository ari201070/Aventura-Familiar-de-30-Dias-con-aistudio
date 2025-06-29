import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", ""); // Carga variables de .env, .env.local, etc.

  return {
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY), // Mantener por si se usa directamente
      "process.env.REACT_APP_POLYGON_API_KEY": JSON.stringify(
        env.POLYGON_API_KEY,
      ), // Añadido para Polygon
    },
    server: {
      host: "0.0.0.0", // Permite conexiones desde cualquier dirección
      port: 5000, // Asegúrate de que sea el puerto correcto
      allowedHosts: ["all"], // Permitir todos los hosts
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"), // Alias actualizado
      },
    },
  };
});
