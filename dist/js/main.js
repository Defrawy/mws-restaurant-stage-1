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







