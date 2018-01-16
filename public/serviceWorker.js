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
            return Promise.all(
                cacheNames
                .filter(function(cName) {
                    ////  remove this cache
                    return true;
                })
                .map(function(cName) {
                    //ServiceWorker Removing old cache cacheName;
                    console.log(cName);
                    return caches.delete(cName);
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
        caches.match(event.request).then(function(resp) {
            return (
                resp ||
                fetch(event.request).then(function(response) {
                    return caches.open(cacheName).then(function(cache) {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                })
            );
        })
    );
});