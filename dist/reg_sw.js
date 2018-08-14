/* 
   This and other work files are based on Udacity Mobile Web Developer Nano degree program  
   many thanks to the whole internet especially StackOverflow which contained solutions to many of my problems. 
   I've customized those techniques to work on this project.
 */

/**
 * Registering server worker.
 */
regSW = () => {
  
  if (!navigator.serviceWorker) return; 

  // var main = this; // print this main

  navigator.serviceWorker.register('/sw.js', {scope:'/'}).then(function(reg) {
    if (!navigator.serviceWorker.controller) {
      return;
    }

    if (reg.waiting) {
      console.log('ready to update');
      // trigger ui update
      return;
    }

    if (reg.installing) {
      console.log('installing');
      // wait untile finish installing
      return;
    }

    reg.addEventListener('updatefound', function() {
      console.log('state changed');
    });
  });

  // Ensure refresh is only called once.
  // This works around a bug in "force update on reload".
  var refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}
regSW();