/* Plan Dual · service worker: la app se instala y funciona en el celular.
   Siempre busca la versión nueva en la red; si no hay conexión, muestra la última guardada.
   Los datos (Apps Script) nunca se guardan en el teléfono. */
const CACHE = 'plandual-v7';
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', 'index.html', 'consulta.html', 'certificacion.html', 'privacidad.html', 'assets/config.js', 'assets/acceso.js', 'assets/preguntas.js', 'assets/icon-192.png']).catch(() => {})));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
