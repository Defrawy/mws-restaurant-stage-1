/* 
   This and other work files are based on Udacity Mobile Web Developer Nano degree program  
   many thanks to the whole internet especially StackOverflow which contained solutions to many of my problems. 
   I've customized those techniques to work on this project.
 */

/**
 * Common database helper functions.
 */
class DBHelper {

  static openDatabase() {
    // If the browser doesn't support service worker,
    // we don't care about having a database
    if (!navigator.serviceWorker) {
      return Promise.resolve();
    }

    return idb.open('restaurant_reviews', 7, function(upgradeDb) {
      var restaurants = upgradeDb.createObjectStore('restaurants', {
        keyPath: 'id'
      });
      var reviews = upgradeDb.createObjectStore('reviews', {
        keyPath: 'id'
      });

      var reviews = upgradeDb.createObjectStore('favorites', {
        keyPath: 'id'
      });
      // temp_reviews.createIndex('by-date', 'date');
    });
  }

  /**
   * Select all restaurants.
   */
  static selectRestaurants(callback) {
    
    return DBHelper.openDatabase().then(function(db) {
      if (!db) return;

      var objectStore = db.transaction('restaurants')
        .objectStore('restaurants');

      return objectStore.getAll().then(function (restaurants) {
        callback(null, restaurants);
      }).catch(function(error) {
        callback(error, null);
      });
    });
  };

  

  static saveRestaurants(data) {
    return DBHelper.openDatabase().then(function(db) {
        if (!db) return;

        var tx = db.transaction('restaurants', 'readwrite');
        var store = tx.objectStore('restaurants');
        data.forEach(function(restaurant) {
          store.put(restaurant);
        });
      }).catch(function(error) {
        // console.log('there is an error saving the data');
        // console.log(error);
      });
  }


  static saveReviews(data) {
    return DBHelper.openDatabase().then(function(db) {
        if (!db) return;

        var tx = db.transaction('reviews', 'readwrite');
        var store = tx.objectStore('reviews');
        data.forEach(function(review) {
          var d = new Date();
          review.date = d.getTime();
          review.status = 'active';
          review.action = `http://localhost:1337/reviews/${review.id}`;
          store.put(review);
        });
      }).catch(function(error) {
        // console.log('there is an error saving the data');
        // console.log(error);
      });
  }


  /* experimental */
  static saveFavorites(data) {
    return DBHelper.openDatabase().then(function(db) {
        if (!db) return;

        var tx = db.transaction('favorites', 'readwrite');
        var store = tx.objectStore('favorites');
        data.forEach(function(restaurant) {
          restaurant.fav = true;
          restaurant.active = false;
          restaurant.action = `http://localhost:1337/restaurants/${restaurant.id}/?is_favorite=${restaurant.fav}`;
          store.put(restaurant);
        });
      }).catch(function(error) {
        // console.log('there is an error saving the data');
        // console.log(error);
    });
  }

  static saveFavorite(data) {
    return DBHelper.openDatabase().then(function(db) {
        if (!db) return;

        var tx = db.transaction('favorites', 'readwrite');
        var store = tx.objectStore('favorites');
        var restaurant = data;
        restaurant.id = parseInt(data.id);
        restaurant.action = `http://localhost:1337/restaurants/${restaurant.id}/?is_favorite=${restaurant.fav}`;
        store.put(restaurant);
      }).catch(function(error) {
        // console.log('there is an error saving the data');
        // console.log(error);
    });
  }

  static getFavorites(callback) {
    
    return DBHelper.openDatabase().then(function(db) {
      if (!db) return;

      var objectStore = db.transaction('favorites')
        .objectStore('favorites');

      return objectStore.getAll().then(function (favorites) {
        const fvs = favorites.filter(r => r.active);
        console.log(fvs);
        callback(null, fvs);
      }).catch(function(error) {
        callback(error, null);
      });
    });
  };

  static isFavorite(restaurant) {
    return DBHelper.openDatabase().then(function(db) {
        if (!db) return;
        // 'http://localhost:1337/restaurants/?is_favorite=true'
        var tx = db.transaction('favorites', 'readwrite');
        var store = tx.objectStore('favorites');

        return store.get(restaurant.id).then(function(rest) {
          if (rest && rest.fav) {
            console.log('is it really true');
            return true;
          }
          return false;
        }).catch(function(error) {
            callback(error, null);
        }); 

    });
  }

  static deleteFav(restaurant) {
    return DBHelper.openDatabase().then(function(db) {
        if (!db) return;

        var tx = db.transaction('favorites', 'readwrite');
        var store = tx.objectStore('favorites');
        store.delete(+restaurant.id);
      }).catch(function(error) {
        console.log('there is an error deleting the data');
        console.log(error);
      });
  }

  /* experimental */
  static saveReview(temp_review) {
    return DBHelper.openDatabase().then(function(db) {
        if (!db) return;
        var tx = db.transaction('reviews', 'readwrite');
        var store = tx.objectStore('reviews');
        if (!temp_review.status) {
          var d = new Date();
          temp_review.date = d.getTime();
          temp_review.status = 'active';
          temp_review.action = `http://localhost:1337/reviews/${temp_review.id}`;
          temp_review.method = 'POST';
        }
        store.put(temp_review);
        
        console.log('Review saved');
      }).catch(function(error) {
        // console.log('there is an error saving the data');
        console.log(error);
      });
  }

  static saveTempReview(temp_review) {
    return DBHelper.openDatabase().then(function(db) {
        if (!db) return;
        var tx = db.transaction('temp_reviews', 'readwrite');
        var store = tx.objectStore('temp_reviews');

        store.put(temp_review);
      }).catch(function(error) {
        // console.log('there is an error saving the data');
        console.log(error);
      });
  }

  static deleteReview(review) {
    return DBHelper.openDatabase().then(function(db) {
        if (!db) return;

        var tx = db.transaction('reviews', 'readwrite');
        var store = tx.objectStore('reviews');
        store.delete(+review.id);
      }).catch(function(error) {
        console.log('there is an error deleting the data');
        console.log(error);
      });
  }

  static deleteTempReview(temp_review) {
    return DBHelper.openDatabase().then(function(db) {
        if (!db) return;
        var tx = db.transaction('reviews', 'readwrite');
        var store = tx.objectStore('reviews');

        store.delete(review.date);
      }).catch(function(error) {
        // console.log('there is an error saving the data');
        console.log(error);
      });
  }

  static clearReviews(callback, text) {
    return DBHelper.openDatabase().then(function(db) {
        if (!db) return;
        var tx = db.transaction('reviews', 'readwrite');
        var store = tx.objectStore('reviews');

        store.clear(callback(text));
      }).catch(function(error) {
        // console.log('there is an error saving the data');
        console.log(error);
      });
  }

  static getUnupdatedReviews(callback) {
    return DBHelper.openDatabase().then(function(db) {
        if (!db) return;

        var tx = db.transaction('reviews', 'readwrite');
        var store = tx.objectStore('reviews');

        return store.getAll().then(function (reviews) {
            const rvs = reviews.filter(r => r.status != 'active');
            callback(null, rvs);
        }).catch(function(error) {
            callback(error, null);
        }); 

    });
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.selectRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }


  /**
   * Fetch reviews by its ID.
   */
  static fetchReviewsById(id, callback) {
    // fetch all restaurants with proper error handling.
    console.log('fetch reviews by restaurant id');
    DBHelper.openDatabase().then(function(db) {
      if(!db) return;

      var objectStore = db.transaction('reviews')
        .objectStore('reviews');

      return objectStore.getAll().then(function (reviews) {
        const rvs = reviews.filter(r => r.restaurant_id == id);
        callback(null, rvs);
      }).catch(function(error) {
        callback(error, null);
      });

    });
  }

  /**
   * Fetch reviews by its ID and not deleted.
   */
  static fetchReviewsByIdAndNotDelete(id, callback) {
    DBHelper.openDatabase().then(function(db) {
      if(!db) return;

      var objectStore = db.transaction('reviews')
        .objectStore('reviews');

      return objectStore.getAll().then(function (reviews) {
        const rvs = reviews.filter(r => r.restaurant_id == id && r.status != 'delete');
        console.log(rvs);
        callback(null, rvs);
      }).catch(function(error) {
        callback(error, null);
      });

    });
  }


  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.selectRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.selectRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.selectRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.selectRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.selectRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}

'use strict';

(function() {
  function toArray(arr) {
    return Array.prototype.slice.call(arr);
  }

  function promisifyRequest(request) {
    return new Promise(function(resolve, reject) {
      request.onsuccess = function() {
        resolve(request.result);
      };

      request.onerror = function() {
        reject(request.error);
      };
    });
  }

  function promisifyRequestCall(obj, method, args) {
    var request;
    var p = new Promise(function(resolve, reject) {
      request = obj[method].apply(obj, args);
      promisifyRequest(request).then(resolve, reject);
    });

    p.request = request;
    return p;
  }

  function promisifyCursorRequestCall(obj, method, args) {
    var p = promisifyRequestCall(obj, method, args);
    return p.then(function(value) {
      if (!value) return;
      return new Cursor(value, p.request);
    });
  }

  function proxyProperties(ProxyClass, targetProp, properties) {
    properties.forEach(function(prop) {
      Object.defineProperty(ProxyClass.prototype, prop, {
        get: function() {
          return this[targetProp][prop];
        },
        set: function(val) {
          this[targetProp][prop] = val;
        }
      });
    });
  }

  function proxyRequestMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return promisifyRequestCall(this[targetProp], prop, arguments);
      };
    });
  }

  function proxyMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return this[targetProp][prop].apply(this[targetProp], arguments);
      };
    });
  }

  function proxyCursorRequestMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return promisifyCursorRequestCall(this[targetProp], prop, arguments);
      };
    });
  }

  function Index(index) {
    this._index = index;
  }

  proxyProperties(Index, '_index', [
    'name',
    'keyPath',
    'multiEntry',
    'unique'
  ]);

  proxyRequestMethods(Index, '_index', IDBIndex, [
    'get',
    'getKey',
    'getAll',
    'getAllKeys',
    'count'
  ]);

  proxyCursorRequestMethods(Index, '_index', IDBIndex, [
    'openCursor',
    'openKeyCursor'
  ]);

  function Cursor(cursor, request) {
    this._cursor = cursor;
    this._request = request;
  }

  proxyProperties(Cursor, '_cursor', [
    'direction',
    'key',
    'primaryKey',
    'value'
  ]);

  proxyRequestMethods(Cursor, '_cursor', IDBCursor, [
    'update',
    'delete'
  ]);

  // proxy 'next' methods
  ['advance', 'continue', 'continuePrimaryKey'].forEach(function(methodName) {
    if (!(methodName in IDBCursor.prototype)) return;
    Cursor.prototype[methodName] = function() {
      var cursor = this;
      var args = arguments;
      return Promise.resolve().then(function() {
        cursor._cursor[methodName].apply(cursor._cursor, args);
        return promisifyRequest(cursor._request).then(function(value) {
          if (!value) return;
          return new Cursor(value, cursor._request);
        });
      });
    };
  });

  function ObjectStore(store) {
    this._store = store;
  }

  ObjectStore.prototype.createIndex = function() {
    return new Index(this._store.createIndex.apply(this._store, arguments));
  };

  ObjectStore.prototype.index = function() {
    return new Index(this._store.index.apply(this._store, arguments));
  };

  proxyProperties(ObjectStore, '_store', [
    'name',
    'keyPath',
    'indexNames',
    'autoIncrement'
  ]);

  proxyRequestMethods(ObjectStore, '_store', IDBObjectStore, [
    'put',
    'add',
    'delete',
    'clear',
    'get',
    'getAll',
    'getKey',
    'getAllKeys',
    'count'
  ]);

  proxyCursorRequestMethods(ObjectStore, '_store', IDBObjectStore, [
    'openCursor',
    'openKeyCursor'
  ]);

  proxyMethods(ObjectStore, '_store', IDBObjectStore, [
    'deleteIndex'
  ]);

  function Transaction(idbTransaction) {
    this._tx = idbTransaction;
    this.complete = new Promise(function(resolve, reject) {
      idbTransaction.oncomplete = function() {
        resolve();
      };
      idbTransaction.onerror = function() {
        reject(idbTransaction.error);
      };
      idbTransaction.onabort = function() {
        reject(idbTransaction.error);
      };
    });
  }

  Transaction.prototype.objectStore = function() {
    return new ObjectStore(this._tx.objectStore.apply(this._tx, arguments));
  };

  proxyProperties(Transaction, '_tx', [
    'objectStoreNames',
    'mode'
  ]);

  proxyMethods(Transaction, '_tx', IDBTransaction, [
    'abort'
  ]);

  function UpgradeDB(db, oldVersion, transaction) {
    this._db = db;
    this.oldVersion = oldVersion;
    this.transaction = new Transaction(transaction);
  }

  UpgradeDB.prototype.createObjectStore = function() {
    return new ObjectStore(this._db.createObjectStore.apply(this._db, arguments));
  };

  proxyProperties(UpgradeDB, '_db', [
    'name',
    'version',
    'objectStoreNames'
  ]);

  proxyMethods(UpgradeDB, '_db', IDBDatabase, [
    'deleteObjectStore',
    'close'
  ]);

  function DB(db) {
    this._db = db;
  }

  DB.prototype.transaction = function() {
    return new Transaction(this._db.transaction.apply(this._db, arguments));
  };

  proxyProperties(DB, '_db', [
    'name',
    'version',
    'objectStoreNames'
  ]);

  proxyMethods(DB, '_db', IDBDatabase, [
    'close'
  ]);

  // Add cursor iterators
  // TODO: remove this once browsers do the right thing with promises
  ['openCursor', 'openKeyCursor'].forEach(function(funcName) {
    [ObjectStore, Index].forEach(function(Constructor) {
      // Don't create iterateKeyCursor if openKeyCursor doesn't exist.
      if (!(funcName in Constructor.prototype)) return;

      Constructor.prototype[funcName.replace('open', 'iterate')] = function() {
        var args = toArray(arguments);
        var callback = args[args.length - 1];
        var nativeObject = this._store || this._index;
        var request = nativeObject[funcName].apply(nativeObject, args.slice(0, -1));
        request.onsuccess = function() {
          callback(request.result);
        };
      };
    });
  });

  // polyfill getAll
  [Index, ObjectStore].forEach(function(Constructor) {
    if (Constructor.prototype.getAll) return;
    Constructor.prototype.getAll = function(query, count) {
      var instance = this;
      var items = [];

      return new Promise(function(resolve) {
        instance.iterateCursor(query, function(cursor) {
          if (!cursor) {
            resolve(items);
            return;
          }
          items.push(cursor.value);

          if (count !== undefined && items.length == count) {
            resolve(items);
            return;
          }
          cursor.continue();
        });
      });
    };
  });

  var exp = {
    open: function(name, version, upgradeCallback) {
      var p = promisifyRequestCall(indexedDB, 'open', [name, version]);
      var request = p.request;

      request.onupgradeneeded = function(event) {
        if (upgradeCallback) {
          upgradeCallback(new UpgradeDB(request.result, event.oldVersion, request.transaction));
        }
      };

      return p.then(function(db) {
        return new DB(db);
      });
    },
    delete: function(name) {
      return promisifyRequestCall(indexedDB, 'deleteDatabase', [name]);
    }
  };

  if (typeof module !== 'undefined') {
    module.exports = exp;
    module.exports.default = module.exports;
  }
  else {
    self.idb = exp;
  }
}());
$(".star.glyphicon").click(function() {
	
  $(this).toggleClass("glyphicon-star glyphicon-star-empty");

  let restaurant = {};
  restaurant.id = getParameterByName('id');
  restaurant.fav = !$(".star.glyphicon").first().attr('class').includes('empty');
  restaurant.action = `http://localhost:1337/restaurants/${restaurant.id}/?is_favorite=${restaurant.fav}`;
  restaurant.active = true;
  restaurant.method = "PUT";
  DBHelper.saveFavorite(restaurant);

  console.log(!$(".star.glyphicon").first().attr('class').includes('empty'));
  console.log('push button');
});



/* 
   This and other work files are based on Udacity Mobile Web Developer Nano degree program  
   many thanks to the whole internet especially StackOverflow which contained solutions to many of my problems. 
   I've customized those techniques to work on this project.
 */

let restaurants,
  neighborhoods,
  cuisines
var map
var markers = []


// start trigger the UI functions from here
showCachedMessages = () => {

  fetchNeighborhoods();
  fetchCuisines();
};

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  collectData();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      // console.error(error);
      
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  // select.addEventListener('onclick', function (e) {
  //   console.log(document);
    
  // });
  neighborhoods.forEach((neighborhood, i) => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    
    option.setAttribute('role', 'option');
    option.setAttribute('aria-posinset', i + 1);
    option.setAttribute('aria-setsize', neighborhoods.length);
    
    
    select.append(option);
  });
  
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      // console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    /* added code start. */
    // option.setAttribute('aria-activedescendant', select);
    /* added code end. */
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;


  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      // console.error(error);
      
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
  
  const image = document.createElement('img');
  image.alt ="restaurant promotional image";
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.srcset = DBHelper.imageUrlForRestaurant(restaurant).replace('.jpg', '-300.jpg 270w');
  li.append(image);

  const name = document.createElement('h1');
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.setAttribute('aria-label', restaurant.name + " restaurant, view details");
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}



// open a connection to the server for live updates
collectData = () => {
  // here I can check if there is some data in the database, or trigger n event to delete all the data.
  fetch('http://localhost:1337/restaurants', {mode: 'cors'}).then(function(response) {
    response.text().then(function (text) {
      DBHelper.saveRestaurants(JSON.parse(text));
      showCachedMessages();
    });
  });

  // here I can check if there is some data in the database, or trigger n event to delete all the data.
  DBHelper.getUnupdatedReviews(function(reviews) {
    if (!reviews) {
      fetch('http://localhost:1337/reviews', {mode: 'cors'}).then(function(response) {
        response.text().then(function (text) {
          DBHelper.saveReviews(JSON.parse(text));
        });
      });    
    }
  });

  DBHelper.getFavorites(function(restaurants) {
    if (!restaurants) {
      fetch('http://localhost:1337/restaurants/?is_favorite=true').then(function(response) {
        response.text().then(function(text) {
          DBHelper.saveFavorites(JSON.parse(text));
        });
      });
    }
  });
};








/* 
   This and other work files are based on Udacity Mobile Web Developer Nano degree program  
   many thanks to the whole internet especially StackOverflow which contained solutions to many of my problems. 
   I've customized those techniques to work on this project.
 */

let restaurant;
let reviews;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      // console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
  fetchReviewsFromURL((error, reviews) => {
  });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        // console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Get current reviews from page URL.
 */
fetchReviewsFromURL = (callback) => {
  console.log('fetching revidws');
  if (self.reviews) { // reviews already fetched!
    callback(null, self.reviews)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No reviews are avaliable'
    callback(error, null);
  } else {
    DBHelper.fetchReviewsById(id, (error, reviews) => {
      self.reviews = reviews;
      if (!reviews) {
        // console.error(error);
        return;
      }
      fillReviewsHTML();
      callback(null, reviews)
    });
  }
}


/**
 * Get current reviews from page URL.
 */
fetchReviewsLocally = (callback) => {
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No reviews are avaliable'
    callback(error, null);
  } else {
    DBHelper.fetchReviewsByIdAndNotDelete(id, (error, reviews) => {
      self.reviews = reviews;
      if (!reviews) {
        console.error(error);
        return;
      }
      fillReviewsHTML();
      callback(null, reviews)
    });
  }
}



/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  // TODO I should check the database if the resturant is favorit or not here
  // const fav = document.getElementsByClassName('.star.glyphicon')[0];
  var favorite = DBHelper.isFavorite(restaurant).then(function(fav) {
    if (!$(".star.glyphicon").first().attr('class').includes('empty') != fav) {
      $(".star.glyphicon").first().toggleClass("glyphicon-star glyphicon-star-empty");
    }
  });
  

  const picture = document.getElementById('restaurant-pic');
  picture.className = 'restaurant-img'; // this might change
  // add more sources to the picture element, new source, add src
  srcElement = document.createElement('source');
  srcElement.srcset = DBHelper.imageUrlForRestaurant(restaurant).replace('.jpg', '-300.jpg');
  srcElement.media = '(max-width:300px)';
  picture.appendChild(srcElement);

  srcElement = document.createElement('source');
  srcElement.srcset = DBHelper.imageUrlForRestaurant(restaurant).replace('.jpg', '-500.jpg');
  srcElement.media = '(max-width:500px)';
  picture.appendChild(srcElement);

  srcElement = document.createElement('source');
  srcElement.srcset = DBHelper.imageUrlForRestaurant(restaurant).replace('.jpg', '-700.jpg');
  srcElement.media = '(max-width:700px)';
  picture.appendChild(srcElement);
  
  const image = document.createElement('img');
  image.alt ="restaurant promotional image";
  image.id = 'restaurant-img';
  image.className = 'restaurant-img'

  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  picture.appendChild(image);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // // fill reviews
  // fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.reviews) => {
  console.log('fill reviews');
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  container.appendChild(title);



  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  // create an element to contain the name, and date
  const li = document.createElement('li');
  const rh = document.createElement('div');
  rh.className += " rvw-head";


  const name = document.createElement('p');
  name.className += " name";
  name.innerHTML = review.name;
  rh.appendChild(name);
  
  const date = document.createElement('p');
  date.className += " date";
  date.innerHTML = new Date(review.date).toDateString();
  rh.appendChild(date);

  const reviewId = document.createElement('input');
  reviewId.className += " rvid";
  reviewId.hidden = true;
  reviewId.value = review.id;

  rh.appendChild(reviewId);

  const menu = document.createElement('div');
  menu.className += " window-container valign";


  const btnmenu = document.createElement('div');
  btnmenu.className += " button_container";
  btnmenu.onclick = (e) => {
    e.target.nextSibling.classList.toggle("show");

  };
  var span1 = document.createElement('span');
  span1.className = 'top';
  btnmenu.appendChild(span1);

  var span2 = document.createElement('span');
  span2.className = 'top2';
  btnmenu.appendChild(span2);

  var span3 = document.createElement('span');
  span3.className = 'middle';
  btnmenu.appendChild(span3);

  var span4 = document.createElement('span');
  span4.className = 'buttom';
  btnmenu.appendChild(span4);
  
  var span5= document.createElement('span');
  span5.className = 'buttom2';
  btnmenu.appendChild(span5);

  const itemsContainer = document.createElement('div');
  itemsContainer.className += " menu-content";
  itemsContainer.id = review.id;

  const iNew = document.createElement('div');
  iNew.innerHTML = "NEU";

  iNew.onclick = (e) => {
    var modal = document.getElementById('submit_review');
    

    let btn = document.getElementById('b_confirm');
    btn.value = "New";
    btn.onclick = (e) => {
      // create the object and pass it the thread
      // send a message to the running thread with the object :)
      let temp_review = {}; 
      var d = new Date();
      temp_review.id = d.getTime();
      temp_review.createdAt = d.getTime();
      temp_review.date = d.getTime();
      temp_review.status = 'new';
      temp_review.action = 'http://localhost:1337/reviews/';
      temp_review.restaurant_id = getParameterByName('id'); 
      temp_review.method = 'POST';
      temp_review.name =  document.getElementById("i_name").value;
      temp_review.rating = document.getElementById("i_rating").value;
      temp_review.comments = document.getElementById("i_comments").value;

      updateUI(temp_review);

      // close modal
      modal.style.display = "none";
    };

    modal.style.display = "block";

  };
  itemsContainer.appendChild(iNew);

  const iUpdate = document.createElement('div');
  iUpdate.innerHTML = "UPD";
  
  iUpdate.onclick = (e) => {
    var modal = document.getElementById('submit_review');

    var li = e.target.parentElement.parentElement.parentElement.parentElement;
    
    document.getElementById('restaurant_id').value = getParameterByName('id');
    document.getElementById("i_name").value = li.getElementsByClassName(" name")[0].innerHTML;
    document.getElementById("i_rating").value  = li.getElementsByClassName(" rating")[0].innerHTML.split(" ")[1];
    document.getElementById("i_comments").value = li.getElementsByClassName(" comments")[0].innerHTML;

    

    let btn = document.getElementById('b_confirm');
    btn.value = "Update";
    btn.onclick = (e) => {

      let temp_review = {}; 
      
      temp_review.status = 'update';
      temp_review.action = `http://localhost:1337/reviews/${li.getElementsByClassName(' rvid')[0].value}`;
      temp_review.id = li.getElementsByClassName(' rvid')[0].value;
      // temp_review.createdAt = li.getElementsByClassName(' rvid')[1].value;
      temp_review.restaurant_id = getParameterByName('id'); 
      temp_review.method = 'PUT';
      temp_review.name =  document.getElementById("i_name").value;
      temp_review.rating = document.getElementById("i_rating").value;
      temp_review.comments = document.getElementById("i_comments").value;

      updateUI(temp_review);
      modal.style.display = "none";
    };
    modal.style.display = "block";
  };
  itemsContainer.appendChild(iUpdate);

  const iDelete = document.createElement('div');
  iDelete.innerHTML = "DEL";
  iDelete.onclick = (e) => {
    var modal = document.getElementById('submit_review');

    var li = e.target.parentElement.parentElement.parentElement.parentElement;

    document.getElementById('restaurant_id').value = getParameterByName('id');
    document.getElementById("i_name").value = li.getElementsByClassName(" name")[0].innerHTML;
    document.getElementById("i_rating").value  = li.getElementsByClassName(" rating")[0].innerHTML.split(" ")[1];
    document.getElementById("i_comments").value = li.getElementsByClassName(" comments")[0].innerHTML;

    // are you sure u want to delete this post
    let btn = document.getElementById('b_confirm');
    btn.value = "Delete";
    btn.onclick = (e) => {

      let temp_review = {}; 
      temp_review.status = 'delete';
      temp_review.action = `http://localhost:1337/reviews/${li.getElementsByClassName(' rvid')[0].value}`;
      temp_review.id = li.getElementsByClassName(' rvid')[0].value;
      temp_review.restaurant_id = getParameterByName('id'); 
      temp_review.method = 'DELETE';
      temp_review.name =  document.getElementById("i_name").value;
      temp_review.rating = document.getElementById("i_rating").value;
      temp_review.comments = document.getElementById("i_comments").value;

      updateUI(temp_review);
      modal.style.display = "none";  
    };
    modal.style.display = "block";
  };
  itemsContainer.appendChild(iDelete);

  menu.appendChild(btnmenu);
  menu.appendChild(itemsContainer);

  rh.appendChild(menu);
  li.append(rh);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  rating.className += " rating";
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.className += " comments";
  comments.innerHTML = `${review.comments}`;
  li.appendChild(comments);
  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

updateUI = (review) => {
  console.log('called some times');
  //console.log(review);
  if (review.status == 'new') {
    DBHelper.saveReview(review); 
  } 

  if (review.status == 'update' || review.status == 'delete') {
    // this deleting the old review
    // but this data when comming form local change

    // delete old entery
    DBHelper.deleteReview(review);
    // adding the new modified entry
    DBHelper.saveReview(review);  
  } 
  // DBHelper.saveReview(review);    
  document.getElementById('reviews-container').removeChild(document.getElementById('reviews-container').getElementsByTagName('h2')[0]);
  document.getElementById('reviews-list').innerHTML = '';
  fetchReviewsLocally((error, reviews) => {
  }); 
}

updateUI2 = () => {  
  document.getElementById('reviews-container').removeChild(document.getElementById('reviews-container').getElementsByTagName('h2')[0]);
  document.getElementById('reviews-list').innerHTML = '';
  fetchReviewsLocally((error, reviews) => {
  }); 
}


