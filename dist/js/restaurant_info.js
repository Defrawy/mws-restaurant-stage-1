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


