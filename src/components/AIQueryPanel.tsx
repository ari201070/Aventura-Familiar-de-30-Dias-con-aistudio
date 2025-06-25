
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { geminiService } from '../services/apiService';
import { parseMarkdown } from '../utils/markdownParser';

interface QueryOption {
  id: string;
  titleKey: string;
  promptTemplate: string;
  icon: string;
}

const QUERY_OPTIONS: QueryOption[] = [
  {
    id: 'itinerary_analysis',
    titleKey: 'ai_itinerary_analysis',
    promptTemplate: 'Analiza este itinerario de 30 días por Argentina para una familia con 2 hijos. Sugiere mejoras en logística, tiempos y actividades familiares.',
    icon: '📋'
  },
  {
    id: 'packing_suggestions',
    titleKey: 'ai_packing_suggestions',
    promptTemplate: 'Sugiere qué empacar para un viaje familiar de 30 días por Argentina, considerando diferentes climas desde Jujuy hasta Bariloche. Prioriza artículos para diabéticos.',
    icon: '🧳'
  },
  {
    id: 'budget_optimization',
    titleKey: 'ai_budget_optimization',
    promptTemplate: 'Ayúdame a optimizar el presupuesto para una familia de 4 personas en un viaje de 30 días por Argentina. Incluye consejos para ahorrar sin sacrificar comodidad.',
    icon: '💰'
  },
  {
    id: 'family_activities',
    titleKey: 'ai_family_activities',
    promptTemplate: 'Recomienda actividades familiares específicas para cada región del itinerario argentino, adecuadas para niños y que promuevan la unión familiar.',
    icon: '👨‍👩‍👧‍👦'
  },
  {
    id: 'health_safety',
    titleKey: 'ai_health_safety',
    promptTemplate: 'Proporciona consejos de salud y seguridad para una familia viajando por Argentina por 30 días, incluyendo cuidados para diabéticos y prevención de enfermedades comunes.',
    icon: '🏥'
  },
  {
    id: 'local_culture',
    titleKey: 'ai_local_culture',
    promptTemplate: 'Explica aspectos culturales argentinos importantes que una familia debería conocer para integrarse mejor y respetar las costumbres locales.',
    icon: '🇦🇷'
  }
];

const AI_FALLBACK_RESPONSES = {
  itinerary_analysis: `**Análisis del Itinerario Familiar**

✅ **Puntos Fuertes:**
- Duración adecuada para cada destino
- Variedad de experiencias (montaña, ciudad, cataratas)
- Buen equilibrio entre descanso y actividades

📍 **Sugerencias de Mejora:**
- Considerar días de descanso entre destinos largos
- Verificar horarios de vuelos para optimizar tiempo
- Reservar alojamientos familiares con anticipación`,

  packing_suggestions: `**Lista de Equipaje Familiar - 30 Días**

🧥 **Ropa (variedad climática):**
- Abrigos impermeables (Bariloche)
- Ropa ligera y protección solar (Iguazú)
- Calzado cómodo para caminar

💊 **Salud (diabéticos):**
- Medicamentos en exceso
- Glucómetro y tiras
- Snacks sin azúcar
- Documentos médicos

👨‍👩‍👧‍👦 **Familia:**
- Entretenimiento para niños
- Documentos de viaje
- Tecnología y cargadores`,

  budget_optimization: `**Optimización de Presupuesto Familiar**

💡 **Consejos de Ahorro:**
- Hospedaje: Apartamentos con cocina para preparar comidas
- Transporte: Comprar pasajes con anticipación
- Comidas: Mercados locales y cocinar ocasionalmente
- Actividades: Muchas atracciones naturales son gratuitas

💰 **Presupuesto Estimado (USD):**
- Alojamiento: $80-120/día
- Comidas: $60-80/día 
- Transporte: $200-400 total
- Actividades: $30-50/día`,

  family_activities: `**Actividades Familiares por Región**

🏔️ **Bariloche:**
- Cerro Catedral (teleférico)
- Circuito Chico en auto
- Museo del Chocolate

🌊 **Iguazú:**
- Cataratas lado argentino y brasileño
- Parque de las Aves
- Paseo en lancha (Macuco Safari)

🍷 **Mendoza:**
- Bodegas familiares
- Parque San Martín
- Termas de Cacheuta`,

  health_safety: `**Salud y Seguridad Familiar**

🏥 **Salud General:**
- Seguro médico internacional obligatorio
- Vacunas al día (consultar médico)
- Botiquín familiar completo

💉 **Cuidados Diabéticos:**
- Medicamentos en exceso
- Identificación médica
- Plan de emergencias médicas
- Contactos de hospitales principales

🚨 **Seguridad:**
- Evitar zonas no turísticas de noche
- Documentos escaneados en la nube
- Números de emergencia locales`,

  local_culture: `**Cultura Argentina - Guía Familiar**

🇦🇷 **Costumbres Sociales:**
- Saludo con beso en la mejilla
- Cenas tardías (21:00-22:00)
- Mate: bebida social argentina

👨‍👩‍👧‍👦 **Con Niños:**
- Argentinos muy amigables con familias
- Horarios flexibles en restaurantes
- Parques y plazas en cada ciudad

🍽️ **Gastronomía:**
- Asado: tradición dominical
- Empanadas: snack popular
- Heladerías artesanales excelentes`
};

export const AIQueryPanel: React.FC = () => {
  const { t, language } = useAppContext();
  const [selectedQuery, setSelectedQuery] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState<string>('');

  const handlePresetQuery = async (queryOption: QueryOption) => {
    setIsLoading(true);
    setSelectedQuery(queryOption.id);
    
    try {
      const response = await geminiService.query(queryOption.promptTemplate, language);
      setAiResponse(response || AI_FALLBACK_RESPONSES[queryOption.id as keyof typeof AI_FALLBACK_RESPONSES] || t('ai_fallback_general'));
    } catch (error) {
      console.error('Error en consulta IA:', error);
      setAiResponse(AI_FALLBACK_RESPONSES[queryOption.id as keyof typeof AI_FALLBACK_RESPONSES] || t('ai_fallback_general'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomQuery = async () => {
    if (!customQuery.trim()) return;
    
    setIsLoading(true);
    setSelectedQuery('custom');
    
    try {
      const response = await geminiService.query(customQuery, language);
      setAiResponse(response || t('ai_fallback_general'));
    } catch (error) {
      console.error('Error en consulta IA personalizada:', error);
      setAiResponse(t('ai_custom_fallback'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {t('ai_assistant_title')}
      </h2>

      {/* Consultas predefinidas */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          {t('ai_preset_queries')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUERY_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => handlePresetQuery(option)}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-4 rounded-lg transition-all duration-200 text-left"
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <div className="font-semibold text-sm">
                    {t(option.titleKey)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Consulta personalizada */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          {t('ai_custom_query')}
        </h3>
        <div className="flex flex-col md:flex-row gap-3">
          <textarea
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder={t('ai_custom_placeholder')}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <button
            onClick={handleCustomQuery}
            disabled={isLoading || !customQuery.trim()}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-6 py-3 rounded-md transition-colors whitespace-nowrap"
          >
            {isLoading ? t('loading') : t('ai_ask')}
          </button>
        </div>
      </div>

      {/* Respuesta de IA */}
      {(aiResponse || isLoading) && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span>{t('ai_thinking')}</span>
              </div>
            ) : (
              selectedQuery === 'custom' 
                ? t('ai_custom_response') 
                : t(`ai_${selectedQuery}`)
            )}
          </h3>
          
          {!isLoading && (
            <div 
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(aiResponse) }}
            />
          )}
        </div>
      )}

      {/* Información sobre fuentes */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-700">
          <strong>{t('ai_source_info')}:</strong> {t('ai_source_description')}
        </p>
      </div>
    </div>
  );
};
