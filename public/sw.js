
const CACHE_NAME = 'argentina-familia-cache-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';
const FALLBACK_CACHE = 'fallback-v2';

// Core Assets - Cache First Strategy
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// CDN Assets - Cache First Strategy
const CDN_ASSETS = [
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'
];

// Fallback responses for offline
const FALLBACK_RESPONSES = {
  '/': `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Argentina Aventura Familiar - Offline</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .offline-container { max-width: 500px; margin: 0 auto; }
        .offline-icon { font-size: 4rem; margin-bottom: 1rem; }
        .btn { background: #4f46e5; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; margin: 10px; }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="offline-icon">🌍</div>
        <h1>Argentina Aventura Familiar</h1>
        <p>Estás offline, pero puedes seguir usando la aplicación con los datos guardados.</p>
        <button class="btn" onclick="window.location.reload()">Intentar Reconectar</button>
        <button class="btn" onclick="window.location.hash='#/'">Ir al Inicio</button>
      </div>
    </body>
    </html>
  `
};

// Install Event - Cache Core Assets
self.addEventListener('install', event => {
  console.log('SW: Installing Service Worker v2...');
  event.waitUntil(
    Promise.all([
      // Cache core assets
      caches.open(STATIC_CACHE).then(cache => {
        console.log('SW: Caching core assets');
        return cache.addAll(CORE_ASSETS.map(url => new Request(url, { mode: 'no-cors' })));
      }),
      // Cache CDN assets
      caches.open(STATIC_CACHE).then(cache => {
        console.log('SW: Caching CDN assets');
        return Promise.allSettled(
          CDN_ASSETS.map(url => 
            cache.add(new Request(url, { mode: 'no-cors' }))
              .catch(err => console.warn('SW: Failed to cache CDN asset:', url, err))
          )
        );
      }),
      // Cache fallback responses
      caches.open(FALLBACK_CACHE).then(cache => {
        console.log('SW: Caching fallback responses');
        return cache.put('/', new Response(FALLBACK_RESPONSES['/'], {
          headers: { 'Content-Type': 'text/html' }
        }));
      })
    ]).then(() => {
      console.log('SW: Installation completed');
      return self.skipWaiting();
    }).catch(err => {
      console.error('SW: Installation failed:', err);
    })
  );
});

// Activate Event - Clean old caches
self.addEventListener('activate', event => {
  console.log('SW: Activating Service Worker v2...');
  const cacheWhitelist = [STATIC_CACHE, DYNAMIC_CACHE, FALLBACK_CACHE];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('SW: Activation completed');
      return self.clients.claim();
    })
  );
});

// Fetch Event - Smart caching strategies
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // API calls - Network Only with fallbacks
  if (requestUrl.hostname.includes('api.') || 
      requestUrl.hostname.includes('polygon.io') || 
      requestUrl.hostname.includes('generativelanguage.googleapis.com')) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }

  // Core Assets & CDN - Cache First
  if (CORE_ASSETS.some(asset => event.request.url.includes(asset)) ||
      CDN_ASSETS.some(asset => event.request.url.includes(asset))) {
    event.respondWith(handleCacheFirst(event.request));
    return;
  }

  // Images - Cache First with Dynamic fallback
  if (event.request.destination === 'image' || 
      event.request.url.includes('/docs/imagenes/') ||
      event.request.url.includes('.jpg') || 
      event.request.url.includes('.png') || 
      event.request.url.includes('.webp')) {
    event.respondWith(handleImageRequest(event.request));
    return;
  }

  // Navigation - Network First with fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(handleNavigation(event.request));
    return;
  }

  // Default - Stale While Revalidate
  event.respondWith(handleDefault(event.request));
});

// Cache First Strategy
async function handleCacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('SW: Serving from cache:', request.url);
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
      console.log('SW: Cached new resource:', request.url);
    }
    return networkResponse;
  } catch (error) {
    console.error('SW: Cache first failed:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// API Request Handler - Network Only with informative fallbacks
async function handleApiRequest(request) {
  try {
    console.log('SW: API request:', request.url);
    const networkResponse = await fetch(request);
    
    // Cache successful API responses briefly
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      const clonedResponse = networkResponse.clone();
      
      // Set expiration for API cache (5 minutes)
      const headers = new Headers(clonedResponse.headers);
      headers.set('sw-cached-at', Date.now().toString());
      
      cache.put(request, new Response(clonedResponse.body, {
        status: clonedResponse.status,
        statusText: clonedResponse.statusText,
        headers: headers
      }));
    }
    
    return networkResponse;
  } catch (error) {
    console.log('SW: API request failed, checking cache:', request.url);
    
    // Check for cached API response
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      const cachedAt = cachedResponse.headers.get('sw-cached-at');
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (cachedAt && (now - parseInt(cachedAt)) < fiveMinutes) {
        console.log('SW: Serving cached API response:', request.url);
        return cachedResponse;
      }
    }
    
    // Return informative fallback for different APIs
    if (request.url.includes('polygon.io')) {
      return new Response(JSON.stringify({
        error: 'offline',
        message: 'Datos de moneda desde caché local',
        source: 'fallback'
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 503
      });
    }
    
    if (request.url.includes('generativelanguage.googleapis.com')) {
      return new Response(JSON.stringify({
        error: 'offline',
        message: 'Consulta offline: Por favor revisa la información guardada en la aplicación.',
        source: 'fallback'
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 503
      });
    }
    
    return new Response('API Offline', { status: 503 });
  }
}

// Navigation Handler - Network First with fallback
async function handleNavigation(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('SW: Navigation offline, serving fallback');
    const fallbackResponse = await caches.match('/', { cacheName: FALLBACK_CACHE });
    return fallbackResponse || new Response('Offline', { status: 503 });
  }
}

// Image Handler - Cache First with placeholder
async function handleImageRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('SW: Image failed, using placeholder');
    // Return a simple SVG placeholder
    const svgPlaceholder = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
        <text x="50%" y="50%" font-family="Arial" font-size="16" text-anchor="middle" fill="#6b7280">
          Imagen no disponible offline
        </text>
      </svg>
    `;
    return new Response(svgPlaceholder, {
      headers: { 'Content-Type': 'image/svg+xml' }
    });
  }
}

// Default Handler - Stale While Revalidate
async function handleDefault(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// Background sync for when connection is restored
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('SW: Background sync triggered');
    event.waitUntil(
      // Update critical data when back online
      updateCriticalData()
    );
  }
});

async function updateCriticalData() {
  try {
    // Refresh exchange rates
    await fetch('/api/exchange-rates');
    console.log('SW: Exchange rates updated');
  } catch (error) {
    console.log('SW: Failed to update critical data:', error);
  }
}
