import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { CITIES } from '../config/constants';
import InteractiveMap from '../components/InteractiveMap';
import { parseMarkdown } from '../utils/markdownParser';
import { geminiService } from '../services/apiService';

const CityDetailPage: React.FC = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const { t, language } = useAppContext();
  const navigate = useNavigate();
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [activeQuery, setActiveQuery] = useState<string>('');

  const city = CITIES.find(c => c.id === cityId);

  if (!city) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {t('city_not_found')}
          </h1>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            {t('back_to_itinerary')}
          </button>
        </div>
      </div>
    );
  }

  const handleAIQuery = async (queryType: string) => {
    setIsLoadingAI(true);
    setActiveQuery(queryType);
    
    try {
      const prompts = {
        menu: `Recomienda 5 restaurantes en ${city.name}, Argentina, aptos para diabéticos y bajas en carbohidratos. Incluye direcciones y precios aproximados.`,
        accommodation: `Sugiere 3 alojamientos familiares en ${city.name}, Argentina, cómodos para una pareja con 2 hijos. Incluye precios y servicios.`,
        tips: `Dame 5 consejos específicos para visitar ${city.name}, Argentina con niños. Enfócate en seguridad y comodidad familiar.`,
        budget: `Calcula un presupuesto detallado para una familia de 4 personas por ${city.duration} días en ${city.name}, Argentina. Incluye alojamiento, comida, transporte y actividades.`
      };

      const response = await geminiService.query(prompts[queryType as keyof typeof prompts], language);
      setAiResponse(response || t('ai_fallback_response'));
    } catch (error) {
      console.error('Error en consulta IA:', error);
      setAiResponse(t('ai_error_response'));
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con imagen de fondo */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${city.image})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-white">
              <button
                onClick={() => navigate('/')}
                className="mb-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md transition-colors"
              >
                ← {t('back_to_itinerary')}
              </button>
              <h1 className="text-4xl font-bold mb-2">{t(city.nameKey)}</h1>
              <p className="text-xl text-gray-200">
                {city.duration} {t('days')} • {t(city.province)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contenido principal */}
          <div className="space-y-6">
            {/* Descripción */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t('city_description')}
              </h2>
              <div 
                className="prose max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(t(city.descriptionKey)) }}
              />
            </div>

            {/* Actividades principales */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t('main_activities')}
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                {city.activities.map((activity, index) => (
                  <li key={index}>{t(activity)}</li>
                ))}
              </ul>
            </div>

            {/* Gastronomía */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t('gastronomy')}
              </h2>
              <div className="text-gray-600">
                <p className="mb-2">{t(city.gastronomyKey)}</p>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-4">
                  <p className="text-sm text-green-700">
                    {t('diabetic_friendly_options')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna lateral */}
          <div className="space-y-6">
            {/* Mapa */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t('location_map')}
              </h2>
              <InteractiveMap 
                center={[city.coordinates.lat, city.coordinates.lng]}
                zoom={12}
                markers={[{
                  position: [city.coordinates.lat, city.coordinates.lng],
                  popup: t(city.nameKey)
                }]}
              />
            </div>

            {/* Consultas IA específicas */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t('ai_assistant')}
              </h2>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => handleAIQuery('menu')}
                  disabled={isLoadingAI}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-3 py-2 rounded-md text-sm transition-colors"
                >
                  {t('ai_query_menu')}
                </button>
                <button
                  onClick={() => handleAIQuery('accommodation')}
                  disabled={isLoadingAI}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-3 py-2 rounded-md text-sm transition-colors"
                >
                  {t('ai_query_accommodation')}
                </button>
                <button
                  onClick={() => handleAIQuery('tips')}
                  disabled={isLoadingAI}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-3 py-2 rounded-md text-sm transition-colors"
                >
                  {t('ai_query_tips')}
                </button>
                <button
                  onClick={() => handleAIQuery('budget')}
                  disabled={isLoadingAI}
                  className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white px-3 py-2 rounded-md text-sm transition-colors"
                >
                  {t('ai_query_budget')}
                </button>
              </div>

              {/* Respuesta IA */}
              {(aiResponse || isLoadingAI) && (
                <div className="bg-gray-50 rounded-md p-4">
                  {isLoadingAI ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-gray-600">
                        {t('ai_loading')} {t(`ai_query_${activeQuery}`)}...
                      </span>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {t(`ai_query_${activeQuery}`)}:
                      </h4>
                      <div 
                        className="text-sm text-gray-600 prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(aiResponse) }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Información práctica */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t('practical_info')}
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <strong>{t('duration')}:</strong> {city.duration} {t('days')}
                </div>
                <div>
                  <strong>{t('province')}:</strong> {t(city.province)}
                </div>
                <div>
                  <strong>{t('best_time')}:</strong> {t(city.bestTimeKey)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityDetailPage;
