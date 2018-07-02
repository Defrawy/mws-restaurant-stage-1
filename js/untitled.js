

self.onmessage = function (msg) {
    
}

check = () => {
	console.log(document);
	setInterval(() => {
		// get all records that are not save on the server
		if (form) {
			console.log(form);
		}
		check();
	}, 500);
}
check();