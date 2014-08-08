Byword Overview
===============

A web framework for node that support dependency injection and adding middleware.

### Installation

```bash
$ mkdir myProject
$ cd myProject

$ npm init
$ npm install byword express jade --save

$ mkdir controllers
$ mkdir views
```

### Bare Usage

```js
// app.js
var app = require('express')(),
    byword = require('byword')(app);

byword.init();

app.listen(3000);
```

### Features
  * Route handling builder.
  * Adding middleware.
  * Dependency injection.
  * Plugin support. (mongodb and authentication plugins as well as documentation for plugins are underway)
  
### Philosophy

The byword philosophy is to provide a means to easily add functionality to controllers
in an MVC setting, either by registering custom middleware or having dependencies injected.

The goals are to write DRY code, support code reuse and allow for rapid web development.

### Built around

Byword is built using [expressjs](https://github.com/strongloop/express) and [dependable](https://github.com/idottv/dependable), understanding these libraries or refering to their documentation is necessary.

Short Example
=============

The following is an example of a controller, without dependency injection or custom middleware added.

```js
// SomeController.js

module.exports = function() {
  // GET '/respond' responds with a 200 status code.
  this.get('/respond').respond();

  // GET '/redirect' redirects the client to '/somewhere-over-the-rainbow'.
  this.get('/redirect').redirect('/somewhere-over-the-rainbow');
  this.get('/somewhere-over-the-rainbow').respond();

  /* GET '/render' renders a page found at '[Project Root]/views/index.jade' 
     that has access to the title attribute during view rendering. */
  this.get('/render').attr('title', 'welcome').render('index');

  /* GET '/json' responds with a json object with the following keys 
     ['key1', 'key2', 'key3']. */
  this.get('/json')
      .attr('key1', 'val1')
      .attr({
        key2: 'val2',
        key3: 'val3'
      }).json();

  /* POST '/user' has a custom middleware function that saves a new user
     and redirects the client to '/users/usersOverview'. */
  this.post('/user')
      .do(function(req, res, next) {
        // ... user saving code
        next();
      })
      .redirect('/users/userOverview');
  
  this.get('/users/usersOverview').render('users/usersOverviewPage');

  /* DELETE '/users/:id' deletes a user with the specified _id_ and 
     responds with json. */
  this.delete('/users/:id')
      .do(function(req, res, next) {
        // ... user deleting code
        next();
      })
      .end(function(req, res) {
        res.json({msg: 'User has been deleted.'});
      });
};
```

Long Example
============

Scenario: an application that allows for a user to register with a welcome email sent upon registration.

Note: the database usage and mailer is pseudo code, all the glue inbetween is byword.

### Server `app.js`
```js
var app = require('express')(),
    byword = require('byword')(app);

byword.mid('persist', require('./middleware/myPersistor'))
  .dep('mailer', require('./services/mailer'))
  .dep('mailerSettings', {
    user: 'user@company.com',
    pass: 'secret'
  })
  .init();

app.listen(3000);
```

### Middleware `middleware/myPersistor.js`
```js
var myDatabase = require('someDatabaseLib');

module.exports = function() {
  return function(model) {
    return function(req, res, next) {
      myDatabase.save(model, req.body, next);
    };
  }
};
```

### Dependency `services/mailer.js`
```js
var nodemailer = require('nodemailer');

module.exports = function(mailerSettings) {
  nodemailer.setup(mailerSettings);

  return function(email, message) {
    nodemailer.send(email, message);
  };
};
```

### Controller `controllers/myController.js`
```js
var UserModel = require('./models/UserModel');

module.exports = function(mailer) {
  this.post('/user')
      .persist(UserModel)
      .do(function(req, res, next) {
        mailer(req.body.email, 'Welcome to our site!');
        next();
      })
      .end(function(req, res) {
        res.json('Thanks for registering!');
      });
};
```

Note that there are many ways one could have wrote this with byword. Either way this should demonstrate how things are glued together.

Documentation
=============

Byword makes use of two directories: a 'controllers' and 'views' directory in the root of your project.

---

### Controllers
```js
module.exports = function(.../* dependencies as arguments */) {
  this.setBasePath('/some');
  this.[get|post|put|delete]('/expressjs/path') // request method and path
      .[attr|do|redirect|respond|render|json|end|your_middleware](); // middleware
};
```

Note that `this.[get|post|put|delete]('/path')` can have any middleware that follows in any order. One does have to make sure that middleware that responds to a client is the last in the chain.

The middleware that responds to a client is `redirect`, `respond`, `render`, `json` and `end`. The rest of the middleware either builds up the response (`attr`) or allows for ad-hoc middleware (`do`).

On the `request` object of any middleware function - the first parameter passed through on a connect/express middleware function - there are two methods: `setValue(key, val)` and `getValue(val)` that manages a **dictionary** that is used by the `attr`, `json` and `render` methods.

* `attr([key, value | {}])` - attributes are available to the ending middleware 'json' and 'render'.
* `end(function(req, res))` - ends a middleware chain and registers the chain with express.
* `respond()` - responds to a client with an HTTP 200 code.
* `render(path)` - renders the file found in that path and sends it to the client - the path is relative to the views directory in the root of a project.
* `redirect(path)` - responds to a client with an HTTP 302 code with the redirect path.
* `json([key])` - returns the **dictionary** on the `request` object as described above - optionally specify a key on the dictionary to return.
* 

---

### Middleware
```js
module.exports = function(.../* dependencies as arguments */) {
  return function(value) { // middleware generator function
    return function(req, res[, next]) { //middleware function to use
      next();
      /* this.build(); should be used when responding to a client in
         your middleware. */
    };
  }
}
```

There are two types of middleware you will be writing in byword. One that _builds up a response or partially handles a request_ and one that _responds to a client_. If you plan to respond to a client in your middleware then at the end add... how the fck? 

---

### Dependencies
```js
module.exports = function(.../* dependencies as arguments */) {
  return function() {
  };
  /* Optinally return an object, boolean, string, array, etc. 
     Can also have the module.exports export any value, but
     if module.exports is a function then that function will
     be used to inject into. */
}
```

---

### Server
```js
byword.[mid|midDir|dep|depDir|res|resDir|plugin|init]();
```

### The request object

Final Words
===========

At the core byword only adds structure with a few helper methods, how you choose to use it is up to you.

Please report any bugs or suggestions [here](https://github.com/daure/byword/issues).
