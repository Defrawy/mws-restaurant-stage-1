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


