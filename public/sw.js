
const CACHE_NAME = 'argentina-itinerary-cache-v1.2'; // Increment version to force update
const urlsToCache = [
  './', // Alias for index.html
  'index.html',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js',
  // --- App-specific assets ---
  // City images (ensure paths are correct and relative to sw.js location if not absolute)
  // These paths become relative to public/ if sw.js is in public/
  // or absolute paths if they start with /
  '/docs/imagenes/buenosaires/buenosaires.jpg',
  '/docs/imagenes/rosario/Monumento-a-la-Bandera-1024x768.jpg',
  '/docs/imagenes/bariloche/emilio-lujan-HhobdGoYzaA-unsplash.jpg', // Corrected Bariloche image
  '/docs/imagenes/mendoza/Mendoza-Puente-del-Inca.jpg',
  '/docs/imagenes/malargue/malargue-cover.jpg',
  '/docs/imagenes/jujuy/jujuy-cover.jpg',
  '/docs/imagenes/iguazu/iguazu-cover.jpg',
  '/docs/imagenes/corrientes/corrientes-cover.jpg',
  '/docs/imagenes/ibera/ibera-cover.jpg',
  // Placeholder/default images
  'https://picsum.photos/seed/argentina/600/400', // Default city image
  // Agenda files
  '/docs/agenda/ariflier1970@gmail.com.ical.zip', // Example, add all relevant agenda files
  // Icons for manifest
  '/docs/imagenes/icons/icon-192x192.png',
  '/docs/imagenes/icons/icon-512x512.png',
  // --- ESM.sh modules ---
  // Note: Caching these helps with offline after first load, but the browser still needs to interpret index.tsx
  // For a fully robust offline experience for app logic, index.tsx would need to be pre-compiled to JS.
  'https://esm.sh/react@^19.1.0/',
  'https://esm.sh/react@^19.1.0',
  'https://esm.sh/react-dom@^19.1.0/',
  'https://esm.sh/react-router-dom@^7.6.1',
  'https://esm.sh/@google/genai@^1.3.0',
  'https://esm.sh/uuid@^11.1.0'
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        // Use addAll with a catch for individual resource failures
        // This is important because if one resource fails, addAll fails entirely.
        const promises = urlsToCache.map(urlToCache => {
          // For local assets moved to public, ensure the paths in urlsToCache are correct
          // If sw.js is in public/, and docs/ is in public/, then './docs/...' becomes '/docs/...'
          // or just 'docs/...' if relative to sw.js inside public/
          // For simplicity, using absolute paths for assets from `public` like `/docs/...` is robust.
          let correctedUrl = urlToCache;
          if (urlToCache.startsWith('docs/')) {
            correctedUrl = `/${urlToCache}`; // Make it absolute from root
          }
          return cache.add(correctedUrl).catch(err => {
            console.warn(`[Service Worker] Failed to cache ${correctedUrl}:`, err);
          });
        });
        return Promise.all(promises);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete, self.skipWaiting() called.');
        return self.skipWaiting(); // Activate worker immediately
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Activation complete, self.clients.claim() called.');
      return self.clients.claim(); // Take control of uncontrolled clients
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Let the browser handle requests for scripts from esm.sh initially,
  // but cache them so they are available offline after the first successful load.
  // For other requests, use cache-first strategy.
  // const isEsmRequest = event.request.url.startsWith('https://esm.sh/');

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          // console.log('[Service Worker] Found in cache:', event.request.url);
          return response; // Serve from cache
        }
        // console.log('[Service Worker] Not in cache, fetching:', event.request.url);
        return fetch(event.request).then(
          (networkResponse) => {
            // If the request is successful, cache it
            if (networkResponse && networkResponse.status === 200) {
              // Check if it's a request we want to cache dynamically (e.g., esm.sh or other CDNs not in initial list)
              // Or if it's one of the initially defined URLs that might have failed to cache during install
              const requestUrl = event.request.url;
              const isUrlToCache = urlsToCache.some(cachedUrl => {
                // Adjust comparison for potentially relative paths in urlsToCache vs absolute requestUrl
                if (cachedUrl.startsWith('./')) cachedUrl = cachedUrl.substring(1); // remove ./
                if (!cachedUrl.startsWith('http') && !cachedUrl.startsWith('/')) cachedUrl = `/${cachedUrl}`; // make absolute if it's like docs/...
                return requestUrl.endsWith(cachedUrl); // Simple check, might need refinement
              });

              const shouldCache = isUrlToCache || 
                                  requestUrl.startsWith('https://esm.sh/') ||
                                  requestUrl.startsWith('https://cdn.tailwindcss.com') || 
                                  requestUrl.startsWith('https://cdnjs.cloudflare.com'); 

              if (shouldCache) {
                // console.log('[Service Worker] Caching new resource:', event.request.url);
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseToCache);
                  });
              }
            }
            return networkResponse;
          }
        ).catch(error => {
          console.error('[Service Worker] Fetch failed; returning offline fallback or error for:', event.request.url, error);
          // Optionally, return a generic offline page here for navigation requests
          // if (event.request.mode === 'navigate') {
          //   return caches.match('offline.html'); // You would need an offline.html
          // }
          // For API calls or other assets, just let the error propagate or return a custom response
          return new Response(JSON.stringify({ error: "Offline and not in cache" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 503, // Service Unavailable
            statusText: "Offline and not in cache"
          });
        });
      })
  );
});