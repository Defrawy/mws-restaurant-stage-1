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

    return idb.open('restaurant_reviews', 6, function(upgradeDb) {
      var restaurants = upgradeDb.createObjectStore('restaurants', {
        keyPath: 'id'
      });
      var reviews = upgradeDb.createObjectStore('reviews', {
        keyPath: 'id'
      });
      // temp_reviews.createIndex('by-date', 'date');
    });
  }

  // static openDatabaseWorker() {
  //   return idb.open('restaurant_reviews', 6, function(upgradeDb) {
  //     var restaurants = upgradeDb.createObjectStore('restaurants', {
  //       keyPath: 'id'
  //     });
  //     var reviews = upgradeDb.createObjectStore('reviews', {
  //       keyPath: 'id'
  //     });
      
  //     // temp_reviews.createIndex('by-date', 'date');
  //   });
  // }

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
