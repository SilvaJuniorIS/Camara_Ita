const CACHE = 'aprova360-v2';
const CORE = [
  './','./index.html','./dashboard.html','./curso.html','./capitulo.html?id=1',
  './exercicios.html','./simulados.html','./flashcards.html','./planner.html',
  './revisoes.html','./desempenho.html','./caderno-erros.html','./anotacoes.html',
  './configuracoes.html','./onboarding.html','./planos.html','./termos.html','./offline.html',
  './manifest.webmanifest','./css/reset.css','./css/variables.css','./css/main.css',
  './css/components.css','./css/dashboard.css','./css/course.css','./css/product.css',
  './css/responsive.css','./js/storage.js','./js/navigation.js','./js/app.js',
  './js/product.js','./js/onboarding.js','./js/checkout.js','./assets/icons/app-icon.svg'
];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match(event.request).then(cached => cached || (event.request.mode === 'navigate' ? caches.match('./offline.html') : Response.error()))));
});
