const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/page.html'
]; //What we want to cashe in this tiny project

// Install event - When the service worker is first installed, it opens a cache storage and adds specified files to it.
// After that, your files (like your HTML, CSS) are stored in the browser. Later, these can be accessed without an internet connection.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache); //This makes sure it caches all pages regardless of whether the user has visited those pages or not. This ensures that all necessary assets for those pages are available offline from the get-go.
      })
  );
});

// Activate event - Activates the service worker and takes control of any open pages.
// Makes sure that the service worker starts working immediately across all tabs where the site is open, without needing to reload the pages.
self.addEventListener('activate', event => {
  console.log('Service worker activated');
  event.waitUntil(
    clients.claim() // This line makes the service worker update immediately for all open tabs.
  );
});

// Fetch event - Intercepts all network requests made by your site.
// Checks if the requested file exists in the cache. If it does, the cached version is used. If not, it fetches it from the internet. This allows your site to work offline by serving cached content when no network is available.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response, otherwise fetch from network
        return response || fetch(event.request);
      })
  );
});
