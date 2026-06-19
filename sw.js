const CACHE_NAME = 'vigi-portal-cache-v6';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './auth.js',
  './supabase-config.js',
  './data.js',
  './VIGI.png',
  './icon-192.png',
  './icon-512.png'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache v5');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event — apaga todos os caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event — network first para HTML/JS/CSS, cache para imagens
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isAsset = /\.(png|jpg|jpeg|svg|ico|woff2?)$/.test(url.pathname);

  if (isAsset) {
    // Cache first para imagens/fontes
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
  } else {
    // Network first para HTML/JS/CSS — sempre pega versão mais recente
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const toCache = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
