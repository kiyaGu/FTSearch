const cacheName = "FTHeadlineSearch-1";
const filesToCache = [
    "/",
    "/js/bundle.js",
    "/css/bundle.css",
    "/images/FTlogo32x32.png",
    "/images/FTlogo180x180.png",
    "/images/FTlogo194x194.png",
    "/images/placeHolderImage.png"
];

self.addEventListener("install", function(e) {
    console.log("[ServiceWorker] Install");
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log("[ServiceWorker] Caching app shell");
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener("activate", function(e) {
    console.log("[ServiceWorker] Activate");
    e.waitUntil(
        caches.keys().then(function(cacheNames) {
            console.log(cacheNames);
            return Promise.all(
                cacheNames
                .filter(function(cacheName) {
                    //// Return true if you want to remove this cache
                    return true;
                })
                .map(function(cacheName) {
                    //ServiceWorker Removing old cache cacheName;
                    return caches.delete(cacheName);
                })
            );
        })
    );
    /* lets you activate the service worker faster.*/
    return self.clients.claim();
});

self.addEventListener("fetch", function(event) {
    event.respondWith(
        //prevents the browser's default fetch handling, and allows you to provide a promise for a Response yourself.
        caches.open(cacheName).then(function(cache) {
            return cache.match(event.request).then(function(response) {
                return (
                    response ||
                    fetch(event.request).then(function(response) {
                        //key/value pairs to be added to the current Cache object
                        cache.put(event.request, response.clone());
                        return response;
                    })
                );
            });
        })
    );
});