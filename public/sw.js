const CACHE = 'fitcoach-v4'; // bump version to force fresh install
const STATIC = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/Logo192.png',
  '/Logo512.png',
  '/favicon.ico',
  '/apple-touch-icon.png',
];

const BYPASS_HOSTS = [
  'firestore.googleapis.com',
  'firebase',
  'identitytoolkit',
  'securetoken',
  'openrouter.ai',
  'anthropic.com',
  'onrender.com',
  'cdn.jsdelivr.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

// File extensions that must NEVER fall back to index.html
const BINARY_EXTENSIONS = /\.(wasm|bin|tflite|data|model|onnx|pb)(\?.*)?$/i;

// All static asset extensions (cache-first, but fail silently — no HTML fallback)
const ASSET_EXTENSIONS = /\.(js|css|png|jpg|jpeg|svg|ico|webp|webmanifest|woff2?|ttf|eot|map)(\?.*)?$/i;

// ── INSTALL ──
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.allSettled(STATIC.map(u => c.add(u).catch(() => {})))
    )
   
  );
});

// ── ACTIVATE ──
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── FETCH ──
self.addEventListener('fetch', e => {
  const url = e.request.url;
  const { pathname } = new URL(url);

  // Only handle GET
  if (e.request.method !== 'GET') return;

  // Skip non-http
  if (!url.startsWith('http')) return;

  // Skip external APIs — always live, SW hands off completely
  if (BYPASS_HOSTS.some(b => url.includes(b))) return;

  // Binary ML assets — NEVER cache, NEVER fall back to HTML
  // Let the browser handle them natively (wasm, tflite, bin, etc.)
  if (BINARY_EXTENSIONS.test(pathname)) return;

  // Navigation requests — SPA routing
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Static assets — cache first, but on failure return network error (not HTML!)
  if (ASSET_EXTENSIONS.test(pathname)) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
            caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          }
          return res;
          // ✅ No .catch() here — let asset failures surface as real errors,
          //    not silently serve index.html
        });
      })
    );
    return;
  }

  // Everything else — network only, no caching, no HTML fallback
  // (catches any unlisted file types cleanly)
  e.respondWith(fetch(e.request));
});

// ── FORCE UPDATE ──
self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});