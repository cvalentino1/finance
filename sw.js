const CACHE_NAME = 'serca40-v1';
const urlsToCache = ['./', './index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(names => Promise.all(names.map(name => {if(name !== CACHE_NAME) return caches.delete(name)}))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(response => {
    if(response) return response;
    return fetch(event.request).then(res => {
      if(!res || res.status !== 200 || res.type !== 'basic') return res;
      const resClone = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
      return res;
    });
  }));
});
