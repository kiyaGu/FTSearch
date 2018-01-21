const cacheName = "FTHeadlineSearch-1";
const filesToCache = [
    "/",
    "/manifest.json",
    "/serviceWorker.js",
    "/js/bundle.js",
    "/css/bundle.css",
    "/images/FTlogo32x32.png",
    "/images/FTlogo180x180.png",
    "/images/FTlogo194x194.png",
    "images/placeHolderImage.png",
    "./"
];
//The service worker installation event is a good time to cache static assets
//This ensures that all the resources a service worker is expected to have are cached
//when the service worker is installed.
self.addEventListener("install", function(e) {
    // console.log("[ServiceWorker] Install");
    // ensures that the pages are cached before installation is completed
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            //console.log("[ServiceWorker] Caching app shell");
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
                    //TODO
                    //ServiceWorker Removing old cache cacheName;
                    //  return caches.delete(cName);
                })
            );
        })
    );
    //lets you activate the service worker faster. else
    //sevice worker won’t take control until the next time the page is loaded.
    return self.clients.claim();
});

//cacheFirst strategy
self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.open(cacheName).then(function(cache) {
            //prevents the browser's default fetch handling, and allows you to provide a promise for a Response yourself.
            return cache.match(event.request).then(function(response) {
                //If a request doesn't match anything in the cache, get it from the network,
                //send it to the page & add it to the cache at the same time.
                return (
                    response ||
                    fetch(event.request)
                    .then(function(response) {
                        var contentType = response.headers.get("content-type");
                        if (response.status < 400) {
                            // This avoids caching responses that we know are errors (i.e. HTTP status code of 4xx or 5xx).
                            // We call .clone() on the request since we might use it in the call to cache.put() later on.
                            //clone the response because the request is a stream that can only be consumed once
                            const resp = response.clone();
                            var contentType = resp.headers.get("content-type");

                            if (
                                contentType == null ||
                                contentType.indexOf("application/font-woff") !== -1 ||
                                contentType.indexOf("application/json") == -1
                            ) {
                                //if the response is not json file, store it in the catche and return it
                                //else don't worry about it, just return it and it will be stored in indexDB
                                cache.put(event.request, resp);
                            }
                            return response;
                        } else {
                            //for other response.status fetch / page
                            return caches.match("/");
                        }
                    })
                    .catch(function(error) {
                        console.log("ERROR:" + error);
                    })
                );
            });
        })
    );
});