
export const SUPPORTED_LANGUAGES = ['es', 'he'] as const;
export const SUPPORTED_CURRENCIES = ['ARS', 'USD', 'ILS', 'EUR'] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

// FALLBACK_EXCHANGE_RATES - Fuente offline para conversor de moneda
export const FALLBACK_EXCHANGE_RATES = {
  'ARS': { 'USD': 0.0011, 'EUR': 0.00095, 'ILS': 0.0038 },
  'USD': { 'ARS': 950, 'EUR': 0.85, 'ILS': 3.45 },
  'EUR': { 'ARS': 1120, 'USD': 1.18, 'ILS': 4.05 },
  'ILS': { 'ARS': 265, 'USD': 0.29, 'EUR': 0.25 }
};

// TRANSPORT_DATA - Datos locales de transporte entre ciudades
export const TRANSPORT_DATA = [
  {
    from: 'Buenos Aires',
    to: 'Rosario',
    method: 'Bus',
    duration: '3h',
    priceARS: 8500,
    company: 'Flecha Bus'
  },
  {
    from: 'Rosario',
    to: 'Bariloche',
    method: 'Vuelo',
    duration: '2h',
    priceARS: 85000,
    company: 'Aerolíneas Argentinas'
  },
  {
    from: 'Bariloche',
    to: 'Mendoza',
    method: 'Bus',
    duration: '12h',
    priceARS: 25000,
    company: 'Andesmar'
  },
  {
    from: 'Mendoza',
    to: 'Malargüe',
    method: 'Bus',
    duration: '4h',
    priceARS: 12000,
    company: 'Buttini'
  },
  {
    from: 'Malargüe',
    to: 'Jujuy',
    method: 'Vuelo + Bus',
    duration: '8h',
    priceARS: 75000,
    company: 'FlyBondi + Balut'
  },
  {
    from: 'Jujuy',
    to: 'Iguazú',
    method: 'Vuelo',
    duration: '2.5h',
    priceARS: 90000,
    company: 'Aerolíneas Argentinas'
  },
  {
    from: 'Iguazú',
    to: 'Corrientes',
    method: 'Bus',
    duration: '6h',
    priceARS: 18000,
    company: 'Crucero del Norte'
  },
  {
    from: 'Corrientes',
    to: 'Iberá',
    method: 'Auto/Transfer',
    duration: '2h',
    priceARS: 15000,
    company: 'Transfer Privado'
  }
];

// CITIES - Estructura completa de datos de ciudades
export const CITIES = [
  {
    id: 'buenosaires',
    name: 'Buenos Aires',
    coordinates: [-34.6037, -58.3816] as [number, number],
    images: [
      '/src/pages/docs/imagenes/buenosaires/buenosaires.jpg',
      '/src/pages/docs/imagenes/buenosaires/sofia-cancela-wk-8oDH4lR4-unsplash.jpg'
    ],
    dates: '1-5 del itinerario',
    duration: '4-5 noches',
    description: 'Ciudad cosmopolita, ideal para familias',
    mainAttractions: [
      'Obelisco',
      'Caminito y La Boca', 
      'Teatro Colón',
      'Jardín Botánico',
      'Puerto Madero'
    ],
    activities: [
      'Paseo en bicicleta por los bosques de Palermo',
      'Visita a museos gratuitos',
      'Espectáculos de tango al aire libre',
      'Picnic en los parques'
    ],
    accommodation: [
      'Alvear Palace (Lujo)',
      'Madero (Boutique)',
      'Ibis (Económico)',
      'Airbnb Palermo (Familiar)'
    ],
    restaurants: [
      { name: 'Don Julio', type: 'Parrilla clásica', glutenFree: true, sugarFree: false },
      { name: 'Sacro', type: 'Vegano gourmet', glutenFree: true, sugarFree: true },
      { name: 'Bio Restaurante', type: 'Orgánico', glutenFree: true, sugarFree: true },
      { name: 'Paru Inkas', type: 'Fusión Peruano-Japonesa', glutenFree: false, sugarFree: true }
    ],
    cafes: [
      { name: 'Café Tortoni', type: 'Histórico/Clásico', glutenFree: false, sugarFree: false },
      { name: 'Havanna', type: 'Alfajores/Café', glutenFree: false, sugarFree: false },
      { name: 'Confitería Ideal', type: 'Repostería Tradicional', glutenFree: false, sugarFree: false }
    ]
  },
  {
    id: 'rosario',
    name: 'Rosario',
    coordinates: [-32.9442, -60.6505] as [number, number],
    images: [
      '/src/pages/docs/imagenes/rosario/Monumento-a-la-Bandera-1024x768.jpg',
      '/src/pages/docs/imagenes/rosario/rosario2.jpg'
    ],
    dates: '6-8 del itinerario',
    duration: '2-3 noches',
    description: 'Cuna de la bandera argentina, ciudad universitaria vibrante',
    mainAttractions: [
      'Monumento a la Bandera',
      'Costanera Norte',
      'Parque de España',
      'Museo de Bellas Artes'
    ],
    activities: [
      'Paseo por la costanera',
      'Visita al Monumento a la Bandera',
      'Recorrido por el centro histórico',
      'Parques y plazas familiares'
    ],
    accommodation: [],
    restaurants: [],
    cafes: []
  },
  {
    id: 'bariloche',
    name: 'Bariloche',
    coordinates: [-41.1335, -71.3103] as [number, number],
    images: [
      '/src/pages/docs/imagenes/bariloche/delfina-iacub-zsgJdHDP4IE-unsplash.jpg',
      '/src/pages/docs/imagenes/bariloche/emilio-lujan-HhobdGoYzaA-unsplash.jpg'
    ],
    dates: '9-12 del itinerario',
    duration: '3-4 noches',
    description: 'Paisajes andinos, lagos cristalinos y aventura familiar',
    mainAttractions: [
      'Cerro Campanario',
      'Lago Nahuel Huapi',
      'Catedral de Bariloche',
      'Centro Cívico'
    ],
    activities: [
      'Teleférico al Cerro Campanario',
      'Navegación por el lago',
      'Caminatas familiares',
      'Degustación de chocolates'
    ],
    accommodation: [],
    restaurants: [],
    cafes: []
  },
  {
    id: 'mendoza',
    name: 'Mendoza',
    coordinates: [-32.8833, -68.8167] as [number, number],
    images: [
      '/src/pages/docs/imagenes/mendoza/Mendoza-Puente-del-Inca.jpg'
    ],
    dates: '13-15 del itinerario',
    duration: '2-3 noches',
    description: 'Capital mundial del Malbec y puerta de entrada a la Cordillera',
    mainAttractions: [
      'Puente del Inca',
      'Aconcagua (mirador)',
      'Bodegas tradicionales',
      'Parque San Martín'
    ],
    activities: [
      'Visita a bodegas familiares',
      'Excursión a alta montaña',
      'Parques y espacios verdes',
      'Centro histórico'
    ],
    accommodation: [],
    restaurants: [],
    cafes: []
  },
  {
    id: 'malargue',
    name: 'Malargüe',
    coordinates: [-35.4758, -69.5842] as [number, number],
    images: [
      '/src/pages/docs/imagenes/malargue/Malargue-Argentina.jpg'
    ],
    dates: '16-17 del itinerario',
    duration: '1-2 noches',
    description: 'Paisajes únicos, cielos estrellados y aventura astronómica',
    mainAttractions: [
      'La Payunia',
      'Observatorio Pierre Auger',
      'Caverna de las Brujas',
      'Volcán Malacara'
    ],
    activities: [
      'Observación astronómica',
      'Trekking familiar',
      'Exploración de cavernas',
      'Fotografía de paisajes'
    ],
    accommodation: [],
    restaurants: [],
    cafes: []
  },
  {
    id: 'jujuy',
    name: 'Jujuy',
    coordinates: [-24.1858, -65.2995] as [number, number],
    images: [
      '/src/pages/docs/imagenes/jujuy/julieta-acosta-u4GAAc-myrg-unsplash.jpg',
      '/src/pages/docs/imagenes/jujuy/sofia-truppel-Gy1PG0XusF4-unsplash.jpg'
    ],
    dates: '18-22 del itinerario',
    duration: '4-5 noches',
    description: 'Quebrada de Humahuaca, colores andinos y cultura ancestral',
    mainAttractions: [
      'Quebrada de Humahuaca',
      'Purmamarca (Cerro 7 Colores)',
      'Salinas Grandes',
      'Tilcara (Pucará)'
    ],
    activities: [
      'Recorrido de la Quebrada',
      'Mercados artesanales',
      'Caminatas suaves',
      'Fotografía de paisajes'
    ],
    accommodation: [],
    restaurants: [],
    cafes: []
  },
  {
    id: 'iguazu',
    name: 'Iguazú',
    coordinates: [-25.6953, -54.4367] as [number, number],
    images: [
      '/src/pages/docs/imagenes/iguazu/claudio-mota-R9ZvATRLDSk-unsplash.jpg',
      '/src/pages/docs/imagenes/iguazu/nelso-ramon-MwiBXIWBAzo-unsplash.jpg',
      '/src/pages/docs/imagenes/iguazu/pau-sayrol-TKWKr8Hsg1k-unsplash.jpg'
    ],
    dates: '23-25 del itinerario',
    duration: '2-3 noches',
    description: 'Cataratas espectaculares, una de las 7 maravillas naturales',
    mainAttractions: [
      'Cataratas del Iguazú (lado argentino)',
      'Cataratas del Iguazú (lado brasileño)',
      'Garganta del Diablo',
      'Parque Nacional Iguazú'
    ],
    activities: [
      'Senderos a las cataratas',
      'Navegación Macuco Safari',
      'Avistaje de fauna selvática',
      'Tren Ecológico'
    ],
    accommodation: [],
    restaurants: [],
    cafes: []
  },
  {
    id: 'corrientes',
    name: 'Corrientes',
    coordinates: [-27.4806, -58.8341] as [number, number],
    images: [
      '/src/pages/docs/imagenes/corrientes/Peatonal.jpg',
      '/src/pages/docs/imagenes/corrientes/fachy-marin-A5xJay6N_fI-unsplash.jpg'
    ],
    dates: '26-27 del itinerario',
    duration: '1-2 noches',
    description: 'Capital del chamamé, cultura guaraní y tradiciones del litoral',
    mainAttractions: [
      'Costanera de Corrientes',
      'Puente General Belgrano',
      'Catedral de Corrientes',
      'Casa de Gobierno'
    ],
    activities: [
      'Paseo por la costanera',
      'Centro histórico',
      'Música folclórica',
      'Gastronomía regional'
    ],
    accommodation: [],
    restaurants: [],
    cafes: []
  },
  {
    id: 'ibera',
    name: 'Iberá',
    coordinates: [-28.5167, -57.1167] as [number, number],
    images: [
      '/src/pages/docs/imagenes/ibera/snapsaga-DMVuTOv5Vys-unsplash.jpg'
    ],
    dates: '28-30 del itinerario',
    duration: '2-3 noches',
    description: 'Humedales únicos, vida silvestre abundante y naturaleza prístina',
    mainAttractions: [
      'Reserva Natural Iberá',
      'Colonia Carlos Pellegrini',
      'Lagunas y esteros',
      'Fauna autóctona (carpinchos, yacarés)'
    ],
    activities: [
      'Avistaje de fauna en lancha',
      'Caminatas en la reserva',
      'Fotografía de naturaleza',
      'Ecoturismo familiar'
    ],
    accommodation: [],
    restaurants: [],
    cafes: []
  }
];

// SISTEMA DE TRADUCCIÓN UNIFICADO
export const translations = {
  es: {
    // Navegación y general
    'app_title': 'Itinerario Familiar por Argentina',
    'welcome_message': '¡Bienvenidos! Haz clic en cada ciudad para ver información, mapas y recomendaciones.',
    'back_to_itinerary': '⬅ Volver al itinerario',
    'explore_details': 'Explorar más detalles',
    'language': 'Idioma:',
    'currency': 'Moneda:',
    'loading': 'Cargando...',
    'error_loading_city': 'Error al cargar datos de la ciudad',
    'coming_soon': 'Próximamente',
    
    // Idiomas y monedas
    'ES': 'ES',
    'HE': 'HE', 
    'ARS': 'ARS',
    'USD': 'USD',
    'ILS': 'ILS',
    'EUR': 'EUR',
    
    // Secciones de ciudad
    'introduction': 'Introducción',
    'main_attractions': 'Lugares imperdibles',
    'recommended_activities': 'Actividades recomendadas',
    'gastronomy': 'Gastronomía destacada',
    'accommodation': 'Alojamiento',
    'budget': 'Presupuesto orientativo',
    'family_tips': 'Consejos para familias',
    'events_agenda': 'Agenda de eventos',
    
    // Transporte
    'transport_title': 'Transporte entre ciudades',
    'from': 'Desde',
    'to': 'Hasta',
    'method': 'Medio',
    'duration': 'Tiempo',
    'price': 'Precio aprox.',
    'company': 'Compañía',
    
    // Mapa
    'interactive_map_title': 'Mapa Interactivo del Viaje Familiar',
    'interactive_map_welcome': 'Recorre el itinerario familiar por Argentina. Haz clic en cada ciudad para detalles.',
    'map_title': 'Mapa de {city}',
    
    // Lista de equipaje
    'packing_title': 'Lista de equipaje',
    'packing_add': 'Agregar',
    'packing_essential': 'Esenciales',
    'packing_optional': 'Opcionales',
    'packing_placeholder': '¿Qué más llevar?',
    
    // Conversor de moneda
    'currency_converter_title': 'Conversor de Moneda',
    'amount': 'Cantidad',
    'from_currency': 'De',
    'to_currency': 'A',
    'convert': 'Convertir',
    'exchange_rate_source': 'Fuente de tasa:',
    'live_rates': 'En vivo',
    'cached_rates': 'Cache',
    'fallback_rates': 'Offline',
    'update_rates': 'Actualizar tasas',
    
    // Consultas IA
    'ai_general_title': 'Consulta General con IA ✨',
    'ai_general_description': 'Haz cualquier pregunta sobre tu viaje por Argentina',
    'ai_menu_title': 'Generador de Menú Saludable ✨',
    'ai_menu_description': 'Obtén sugerencias de menú diario adaptadas para dietas bajas en carbohidratos, aptas para diabéticos y sin gluten',
    'ai_accommodation_title': 'Sugerencias de Alojamiento con IA 🏨',
    'ai_accommodation_description': 'Obtén recomendaciones de alojamiento familiares, seguras y bien ubicadas',
    'ai_family_tips_title': 'Consejos Adicionales para Familias 👨‍👩‍👧‍👦',
    'ai_family_tips_description': 'Recibe consejos personalizados para disfrutar en familia',
    'ai_budget_title': 'Análisis de Presupuesto con IA 💰',
    'ai_budget_description': 'Obtén análisis y desglose del presupuesto orientativo',
    'generate_menu': 'Generar Menú',
    'generate_accommodation': 'Generar Sugerencias',
    'generate_family_tips': 'Generar Consejos',
    'generate_budget': 'Analizar Presupuesto',
    'ask_ai': 'Preguntar a IA',
    'ai_loading': 'Generando...',
    
    // Restaurantes y gastronomía
    'recommended_restaurants': 'Restaurantes recomendados',
    'restaurant': 'Restaurante',
    'type': 'Tipo',
    'gluten_free': 'Sin Gluten',
    'sugar_free': 'Sin Azúcar',
    'yes': '✔️',
    'no': '❌',
    'cafes_title': 'Confiterías y cafés',
    'cafe': 'Confitería',
    
    // Footer
    'footer_copyright': '© 2025 Viaje Familiar Argentina',
    
    // Ciudades específicas
    'buenos_aires': 'Buenos Aires',
    'rosario': 'Rosario',
    'bariloche': 'Bariloche',
    'mendoza': 'Mendoza',
    'malargue': 'Malargüe',
    'jujuy': 'Jujuy',
    'iguazu': 'Iguazú',
    'corrientes': 'Corrientes',
    'ibera': 'Iberá'
  },
  
  he: {
    // Navegación y general
    'app_title': 'מסלול משפחתי בארגנטינה',
    'welcome_message': 'ברוכים הבאים! לחצו על כל עיר למידע, מפות והמלצות.',
    'back_to_itinerary': '⬅ חזרה למסלול',
    'explore_details': 'לגלות פרטים נוספים',
    'language': 'שפה:',
    'currency': 'מטבע:',
    'loading': 'טוען...',
    'error_loading_city': 'שגיאה בטעינת נתוני העיר',
    'coming_soon': 'בקרוב',
    
    // Idiomas y monedas
    'ES': 'ES',
    'HE': 'HE',
    'ARS': 'ARS',
    'USD': 'USD',
    'ILS': 'ILS',
    'EUR': 'EUR',
    
    // Secciones de ciudad
    'introduction': 'הקדמה',
    'main_attractions': 'אתרים שאסור לפספס',
    'recommended_activities': 'פעילויות מומלצות',
    'gastronomy': 'גסטרונומיה מובחרת',
    'accommodation': 'לינה',
    'budget': 'תקציב משוער',
    'family_tips': 'טיפים למשפחות',
    'events_agenda': 'לוח אירועים',
    
    // Transporte
    'transport_title': 'תחבורה בין ערים',
    'from': 'מ',
    'to': 'עד',
    'method': 'אמצעי',
    'duration': 'זמן',
    'price': 'מחיר משוער',
    'company': 'חברה',
    
    // Mapa
    'interactive_map_title': 'מפת המסלול המשפחתי בארגנטינה',
    'interactive_map_welcome': 'גלו את המסלול המשפחתי בארגנטינה. לחצו על כל עיר לפרטים.',
    'map_title': 'מפת {city}',
    
    // Lista de equipaje
    'packing_title': 'רשימת ציוד',
    'packing_add': 'הוסף',
    'packing_essential': 'חיוני',
    'packing_optional': 'אופציונלי',
    'packing_placeholder': 'מה עוד לקחת?',
    
    // Conversor de moneda
    'currency_converter_title': 'ממיר מטבעות',
    'amount': 'כמות',
    'from_currency': 'מ',
    'to_currency': 'ל',
    'convert': 'המר',
    'exchange_rate_source': 'מקור שער:',
    'live_rates': 'חי',
    'cached_rates': 'מטמון',
    'fallback_rates': 'לא מקוון',
    'update_rates': 'עדכן שערים',
    
    // Consultas IA
    'ai_general_title': 'שאלה כללית לבינה מלאכותית ✨',
    'ai_general_description': 'שאלו כל שאלה על הטיול שלכם בארגנטינה',
    'ai_menu_title': 'מחולל תפריט בריא ✨',
    'ai_menu_description': 'קבלו הצעות לתפריט יומי מותאם לדיאטה דלת פחמימות, מתאים לסוכרתיים וללא גלוטן',
    'ai_accommodation_title': 'המלצות לינה עם בינה מלאכותית 🏨',
    'ai_accommodation_description': 'קבלו המלצות לינה משפחתיות, בטוחות וממוקמות היטב',
    'ai_family_tips_title': 'טיפים נוספים למשפחות 👨‍👩‍👧‍👦',
    'ai_family_tips_description': 'קבלו טיפים מותאמים אישית לבילוי משפחתי',
    'ai_budget_title': 'ניתוח תקציב עם בינה מלאכותית 💰',
    'ai_budget_description': 'קבלו ניתוח וחלוקה של תקציב משוער',
    'generate_menu': 'צור תפריט',
    'generate_accommodation': 'צור המלצות',
    'generate_family_tips': 'צור טיפים',
    'generate_budget': 'נתח תקציב',
    'ask_ai': 'שאל בינה מלאכותית',
    'ai_loading': 'יוצר...',
    
    // Restaurantes y gastronomía
    'recommended_restaurants': 'מסעדות מומלצות',
    'restaurant': 'מסעדה',
    'type': 'סוג',
    'gluten_free': 'ללא גלוטן',
    'sugar_free': 'ללא סוכר',
    'yes': '✔️',
    'no': '❌',
    'cafes_title': 'בתי קפה וקונדיטוריות',
    'cafe': 'קונדיטוריה',
    
    // Footer
    'footer_copyright': '© 2025 טיול משפחתי ארגנטינה',
    
    // Ciudades específicas
    'buenos_aires': 'בואנוס איירס',
    'rosario': 'רוסריו',
    'bariloche': 'ברילוצ\'ה',
    'mendoza': 'מנדוסה',
    'malargue': 'מלארגואה',
    'jujuy': 'חוחוי',
    'iguazu': 'איגואסו',
    'corrientes': 'קוריינטס',
    'ibera': 'איברה'
  }
};

// CONSULTAS IA PREDEFINIDAS (fallbacks offline)
export const AI_FALLBACK_RESPONSES = {
  es: {
    menu: `**Menú Diario Saludable - Buenos Aires**

**DESAYUNO:**
• Huevos revueltos con espinaca y queso (sin pan)
• Café con leche descremada (sin azúcar)
• Frutas frescas: frutillas, arándanos

**ALMUERZO:**
• Bife de chorizo a la parrilla (sin acompañamiento de papa)
• Ensalada mixta con aceite de oliva
• Agua con gas

**CENA:**
• Salmón grillado con verduras asadas
• Ensalada de rúcula y tomates cherry
• Infusión de manzanilla

*Nota: Datos offline - Para sugerencias actualizadas, consulte con conexión a internet.*`,
    
    accommodation: `**Alojamientos Familiares Recomendados - Buenos Aires**

**ZONA PALERMO:**
• Apart hoteles con cocina equipada
• Airbnb familiares (2-3 habitaciones)
• Proximidad a parques y transportes

**ZONA PUERTO MADERO:**
• Hoteles 4-5 estrellas con servicios familiares
• Piscinas y espacios de recreación
• Vista al río y fácil acceso

**ZONA RECOLETA:**
• Ubicación céntrica y segura
• Cercanía a museos y atracciones
• Opciones de diferentes presupuestos

*Nota: Datos offline - Para disponibilidad actualizada, consulte con conexión a internet.*`,
    
    tips: `**Consejos para Familias - Buenos Aires**

**SEGURIDAD:**
• Mantenga documentos en lugar seguro
• Use transporte oficial (taxi/Uber)
• Evite mostrar objetos de valor

**LOGÍSTICA:**
• SUBE card para transporte público
• Apps útiles: BA Cómo Llego, Mapa Ciudad
• Horarios: comercios cierran 13-17hs

**CON NIÑOS:**
• Parques recomendados: Tres de Febrero, Centenario
• Museos gratuitos los miércoles
• Actividades al aire libre en Puerto Madero

*Nota: Datos offline - Para información actualizada, consulte con conexión a internet.*`,
    
    budget: `**Análisis de Presupuesto - Buenos Aires (4-5 días)**

**ALOJAMIENTO:** ARS 80,000-150,000
• Hotel promedio: ARS 25,000/noche
• Airbnb familiar: ARS 18,000/noche

**COMIDAS:** ARS 60,000-90,000
• Restaurante promedio: ARS 8,000/persona
• Parrilla: ARS 12,000/persona

**TRANSPORTE:** ARS 15,000-25,000
• Taxis/Uber: ARS 3,000/viaje promedio
• SUBE: ARS 200/viaje

**ACTIVIDADES:** ARS 20,000-40,000
• Museos: Gratuitos-ARS 2,000
• Shows: ARS 8,000-15,000/persona

**TOTAL ESTIMADO:** ARS 175,000-305,000

*Nota: Precios orientativos offline - Para cotizaciones actuales, consulte con conexión a internet.*`
  },
  
  he: {
    menu: `**תפריט יומי בריא - בואנוס איירס**

**ארוחת בוקר:**
• ביצים מקושקשות עם תרד וגבינה (בלי לחם)
• קפה עם חלב דל שומן (בלי סוכר)
• פירות טריים: תותים, אוכמניות

**ארוחת צהריים:**
• סטייק צלוי על הגריל (בלי תוספת תפוחי אדמה)
• סלט מעורב עם שמן זית
• מים מוגזים

**ארוחת ערב:**
• סלמון צלוי עם ירקות צלויים
• סלט רוקט ועגבניות שרי
• תה עלי מנטה

*הערה: נתונים לא מקוונים - להצעות מעודכנות, בדקו עם חיבור לאינטרנט.*`,
    
    accommodation: `**המלצות לינה משפחתיות - בואנוס איירס**

**אזור פלרמו:**
• דירות מלון עם מטבח מאובזר
• Airbnb משפחתיים (2-3 חדרים)
• קרבה לפארקים ותחבורה

**אזור פוארטו מדרו:**
• מלונות 4-5 כוכבים עם שירותים משפחתיים
• בריכות ואזורי בילוי
• נוף לנהר וגישה נוחה

**אזור רקולטה:**
• מיקום מרכזי ובטוח
• קרבה למוזיאונים ואטרקציות
• אפשרויות לתקציבים שונים

*הערה: נתונים לא מקוונים - לזמינות מעודכנת, בדקו עם חיבור לאינטרנט.*`,
    
    tips: `**טיפים למשפחות - בואנוס איירס**

**בטיחות:**
• שמרו על מסמכים במקום בטוח
• השתמשו בתחבורה רשמית (מונית/Uber)
• הימנעו מהצגת חפצי ערך

**לוגיסטיקה:**
• כרטיס SUBE לתחבורה ציבורית
• אפליקציות שימושיות: BA Cómo Llego, Mapa Ciudad
• שעות: חנויות סגורות 13-17

**עם ילדים:**
• פארקים מומלצים: Tres de Febrero, Centenario
• מוזיאונים חינמיים בימי רביעי
• פעילויות באוויר הפתוח בפוארטו מדרו

*הערה: נתונים לא מקוונים - למידע מעודכן, בדקו עם חיבור לאינטרנט.*`,
    
    budget: `**ניתוח תקציב - בואנוס איירס (4-5 ימים)**

**לינה:** ARS 80,000-150,000
• מלון ממוצע: ARS 25,000/לילה
• Airbnb משפחתי: ARS 18,000/לילה

**אוכל:** ARS 60,000-90,000
• מסעדה ממוצעת: ARS 8,000/אדם
• מסעדת בשרים: ARS 12,000/אדם

**תחבורה:** ARS 15,000-25,000
• מוניות/Uber: ARS 3,000/נסיעה ממוצעת
• SUBE: ARS 200/נסיעה

**פעילויות:** ARS 20,000-40,000
• מוזיאונים: חינם-ARS 2,000
• מופעים: ARS 8,000-15,000/אדם

**סה"כ משוער:** ARS 175,000-305,000

*הערה: מחירים משוערים לא מקוונים - לקוטציות נוכחיות, בדקו עם חיבור לאינטרנט.*`
  }
};

// FUNCIONES HELPER PARA TRADUCCIÓN
export const getCityById = (id: string) => {
  return CITIES.find(city => city.id === id);
};

export const getCityByName = (name: string) => {
  return CITIES.find(city => city.name.toLowerCase() === name.toLowerCase());
};

export const getTransportBetweenCities = (fromCity: string, toCity: string) => {
  return TRANSPORT_DATA.find(route => 
    route.from.toLowerCase() === fromCity.toLowerCase() && 
    route.to.toLowerCase() === toCity.toLowerCase()
  );
};

export const convertPrice = (priceARS: number, toCurrency: SupportedCurrency, exchangeRates: any) => {
  if (toCurrency === 'ARS') return priceARS;
  
  const rate = exchangeRates['ARS']?.[toCurrency] || FALLBACK_EXCHANGE_RATES['ARS'][toCurrency];
  return Math.round(priceARS * rate);
};
