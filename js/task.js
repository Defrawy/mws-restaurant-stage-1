/* 
   This and other work files are based on Udacity Mobile Web Developer Nano degree program  
   many thanks to the whole internet especially StackOverflow which contained solutions to many of my problems. 
   I've customized those techniques to work on this project.
 */

importScripts('idb.js', 'dbhelper.js');

// submit = (data, document) => {
//   console.log('the submit function is running...');
//   let resturant_id = document.createElement('input');
//   let reveiw_id = document.createElement('input');
//   let name = document.createElement('input');
//   let rate = document.createElement('input');
//   let comments = document.createElement('input');

//   resturant_id.value = document.getElementById('resturant_id').value;
//   review_id.vaue = document.getElementById('review_id').value;
//   name.value = document.getElementById('i_name').value;
//   rate.value = document.getElementById('i_rating').value;
//   comments.value = document.getElementById('i_comments').value;


//   let form  = document.createElement('form');
//   form.appendChild(resturant_id);
//   form.appendChild(review_id);
//   form.appendChild(name);
//   form.appendChild(rate);
//   form.appendChild(comments);
//   form.action = action;
//   form.method = method;

//   form.submit();

// }


self.onmessage = function (msg) {
    
	if (msg.data.status == 'new') {
    DBHelper.saveReview(msg.data);  
  } 

  if (msg.data.status == 'update' || msg.data.status == 'delete') {
    DBHelper.deleteReview(msg.data);
    DBHelper.saveReview(msg.data);  
    // I can delete and re-enter the record or update it.
    // delete and re-insert with the correct status
  }   
	
	// 3- trigger display comments again
  self.postMessage('ui_update');
	
}
