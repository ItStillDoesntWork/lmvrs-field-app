// ============================================================
// LMVRS Field Reference — Service Worker
// ============================================================
// Caches all app assets for full offline functionality.
// Cache-first strategy: serve from cache, fall back to network.
// ============================================================

const CACHE_NAME = 'lmvrs-v5';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/cpr.js',
  './js/eta.js',
  './js/tools.js',
  './js/utils.js',
  './data/drugs.js',
  './data/protocols.js',
  './data/phone-numbers.js',
  './data/hospitals.js',
  './data/tools-config.js',
  './data/help-content.js',
  './manifest.json',
  './assets/icons/rescue-logo.png',
  './assets/icons/logo-plus-title.png',
  './assets/Wallace_rule_of_nines-en_text_visible.png',
  './assets/rule_of_nines_pediatric.png',
  './assets/Precordial_leads_in_ECG.png',
  './assets/Noisy-ECG.png',
  './assets/not Noisy-ECG.png',
  './assets/Ventricular-Fibrillation-ECG-Tracing-scaled.jpg',
];

// Optional assets — cached if available, but don't block install
const OPTIONAL_ASSETS = [
  './data/eta-grid.js',
];

// Install: cache all required assets, then try optional ones
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => caches.open(CACHE_NAME))
      .then(cache => {
        // Try to cache optional assets (don't fail install if missing)
        return Promise.all(
          OPTIONAL_ASSETS.map(url =>
            cache.add(url).catch(() => {/* optional — ignore if missing */})
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache new successful responses
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback for navigation requests
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
