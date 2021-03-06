/* 
   This and other work files are based on Udacity Mobile Web Developer Nano degree program  
   many thanks to the whole internet especially StackOverflow which contained solutions to many of my problems. 
   I've customized those techniques to work on this project.
 */

var staticCache = 'web-static-v2';
var contentImgsCache = 'web-content-imgs-v2';
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
				'/js/main.js',
				'/js/idb.js',
				'/js/restaurant_info.js',
				'/sw.js',
				'manifest.json',
				'/reg_sw.js',
				'/js/dbhelper.js']); // the json, main.js, resaurant_info.js, and dphelper.js is not part any more
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

    event.respondWith(
		caches.match(requestUrl.pathname).then(function(response) {
			return response || fetch(event.request);
		})
	);
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





