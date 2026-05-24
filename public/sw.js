const CACHE = 'fitcoach-v1';
const STATIC = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/Logo192.png',
  '/Logo512.png',
  '/favicon.ico',
  '/apple-touch-icon.png',
];

// Never cache these
const BYPASS = [
  'firestore.googleapis.com',
  'firebase',
  'identitytoolkit',
  'securetoken',
  'openrouter.ai',
  'anthropic.com',
  'onrender.com',
  'mediapipe',
  'cdn.jsdelivr.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

// ── INSTALL ──
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.allSettled(STATIC.map(u => c.add(u).catch(() => {})))
    ).then(() => self.skipWaiting())
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

  // Only handle GET
  if (e.request.method !== 'GET') return;

  // Skip non-http
  if (!url.startsWith('http')) return;

  // Skip API / Firebase / MediaPipe — always live
  if (BYPASS.some(b => url.includes(b))) return;

  // Navigation — serve index.html (SPA routing)
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Static assets — cache first
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match('/index.html'));
    })
  );
});

// ── FORCE UPDATE ──
self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});