# Mobile Web Specialist Certification Course
---
#### _Third Stage Course Material Project - Restaurant Reviews_

## Project Overview: Stage 3

Stage 3 is the final phase of **Restaurant Reviews**. The project started with static pages that had many issues and throughout the stages, it transformed into a dynamic responsive site. They are two pages index and restaurant are the entry points of the site. The index page displays available restaurants that retrieved from a web server. 

Accessing a specific restaurant redirects the user to restaurant details (restaurant page). The restaurant page has most of the functionality. It allows the user to add a new review, edit existing one, or delete it. Mark a restaurant as a favorite by clicking on the start icon on the top left corner of the image. The site uses offline first strategy by utilizing caches and indexeddb to save data locally. The javascript code mainly used to update caches and db regularly without interrupting the user experience. 

### Specification

- Users are able to mark a restaurant as a favorite, this toggle is visible in the application. A form is added to allow users to add their own reviews for a restaurant. Form submission works properly and adds a new review to the database.

- The client application works offline. JSON responses are cached using the IndexedDB API. Any data previously accessed while connected is reachable while offline. User is able to add a review to a restaurant while offline and the review is sent to the server when connectivity is re-established.

- The application maintains a responsive design on mobile, tablet and desktop viewports. All new features are responsive, including the form to add a review and the control for marking a restaurant as a favorite.

### Installation

1. Fork and clone the [server repository](https://github.com/udacity/mws-restaurant-stage-3). It is required to experience the restaurant reviews websit. Follow the [README](https://github.com/udacity/mws-restaurant-stage-3) instructions to run the server

2. After running the server, now, in this folder, start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer. 

3. In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

4. Visit the site: `http://localhost:8000`, and look around for a bit to see what the current experience looks like.

5. Enjoy your experience and let me what do you think?



### Note about ES6

Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future proofing JavaScript code. As much as possible, try to maintain use of ES6 in any additional JavaScript you write. 



