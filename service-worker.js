const CACHE_NAME = 'quiz-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/correct.mp3',
  '/wrong.mp3',
  '/img/mela.jpg',
  '/img/banana.jpg',
  '/img/uva.jpg',
  '/img/pesca.jpg'
  // aggiungi qui tutte le immagini che usi
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
