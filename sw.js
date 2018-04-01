/* this and other work files are based on Udacity Mobile Web Developer Nano degree program  */

var staticCache = 'web-static-v1';
var contentImgsCache = 'web-content-imgs-v1';
var allCaches = [
  staticCache,
  contentImgsCache
];

self.addEventListener('install', function(event) {
	event.waitUntil(
		// if whenever the promise resolves the install event complete
		caches.open(staticCache).then(function(cache) {
			return cache.addAll(['/',
				'/restaurant.html',
				'/css/styles.css',
				'/js/main.js',
				'/js/dbhelper.js',
				'/js/restaurant_info.js', 
				'/data/restaurants.json']);
		})
	);
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
					cacheNames.filter(function(cacheName) {
					return cacheName.startsWith('web-') && cacheName != staticCache && cacheName != contentImgsCache;
				}).map(function(cacheName) {
					return caches.delete(cacheName);
				})
			);
		})
	);
});

// this would be something like that
self.addEventListener('fetch', function(event) {
    requestUrl = new URL(event.request.url);
    if (event.request.url.endsWith('.jpg')) {
      event.respondWith(serveImage(event.request));
      return;
    }

    /* other than images */
    if (requestUrl.origin === location.origin) {
    	event.respondWith(
			caches.match(requestUrl.pathname).then(function(response) {
				return response || fetch(event.request);
			})
    	);
    }

    
	
});


function serveImage(request) {
  var storageUrl = request.url.replace(/-\d*\.jpg$/, '');
  return caches.open(contentImgsCache).then(function(cache) {
    return cache.match(storageUrl).then(function(response) {
      var networkFetch = fetch(request).then(function(ntResponse) {
        cache.put(storageUrl, ntResponse.clone());
        return ntResponse;
      });
      return response || networkFetch;
    });
  });
}





