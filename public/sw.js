
const CACHE_NAME = 'argentina-familia-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // '/src/index.tsx', // Typically your build tool handles JS/CSS caching with hashes
  // '/src/App.tsx',   // These are source files, not typically cached directly by SW in dev
  // Add paths to your main CSS/JS bundles if they are static and not hashed by Vite
  // For Vite, it often injects a manifest for pre-caching during build
  // For CDN assets, be mindful of CORS and update strategies
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js',
  // Add other critical assets like your logo or default city image if local
  // '/docs/imagenes/buenosaires/buenosaires.jpg', // Example, add important images
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache.map(url => new Request(url, { mode: 'no-cors' })))
          .catch(error => {
            console.error('Service Worker: Failed to cache initial assets:', error);
            // Optionally, you can decide not to fail the install for non-critical assets
            // For example, if a CDN asset fails, the app might still work partially
          });
      })
      .then(() => {
        console.log('Service Worker: Install completed');
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation completed');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  // console.log('Service Worker: Fetching', event.request.url);
  if (event.request.method !== 'GET') {
    // For non-GET requests, use network only
    event.respondWith(fetch(event.request));
    return;
  }

  // Strategy: Cache first, then network for navigation and specified assets
  // For other assets, network first, then cache
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // console.log('Service Worker: Returning from cache', event.request.url);
          return cachedResponse;
        }
        // console.log('Service Worker: Not in cache, fetching from network', event.request.url);
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // console.log('Service Worker: Caching new resource', event.request.url);
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(error => {
          console.error('Service Worker: Fetch failed; returning offline page if available, or error', error);
          // Optionally, return a custom offline page:
          // return caches.match('/offline.html');
          // For now, just let the browser handle the error (which will show the default offline error)
          throw error;
        });
      })
  );
});
