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

**I highly recommend to have a look at both of these libraries to be able to use byword.**

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
  };
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

All of the middleware methods after the request method returns the request method again, so chain away as seen in the examples.

Note that `this.[get|post|put|delete]('/path')` can have any middleware that follows in any order. One does have to make sure that middleware that responds to a client is the last in the chain.

The middleware that responds to a client is `redirect`, `respond`, `render` and `json`. The rest of the middleware either builds up the response (`attr`) or allows for ad-hoc middleware (`do`) or registers a middleware chain (`end`).

On the `request` object of any middleware function - the first parameter passed through on a connect/express middleware function - there are two methods: `setValue(key, val)` and `getValue(key)` that manages a **dictionary** that is used by the `attr`, `json` and `render` methods.

* `attr([key, value | {}])` - attributes are available to the ending middleware 'json' and 'render' and can be accessed with `request.getValue(key)` in subsequent middleware.
* `do(function(req, res, next) {})` - add a custom middleware function - if you respond to a client in this middleware then instead use `end`.
* `redirect(path)` - responds to a client with an HTTP 302 code with the redirect path.
* `respond()` - responds to a client with an HTTP 200 code.
* `render(path)` - renders the file found in that path and sends it to the client - the path is relative to the views directory in the root of a project.
* `json([key])` - returns the **dictionary** on the `request` object as described above - optionally specify a key on the dictionary to return.
* `end(function(req, res) {})` - ends a middleware chain and registers the chain with express, ensure that you use `end` when you intend to respond to a request in that middleware function.
* `you_middlware()` - add your own middleware by registering it before initializing byword.

---

### Middleware
```js
module.exports = function(.../* dependencies as arguments */) {
  return function(value) { // middleware generator function
    return function(req, res, next) { //middleware function to use
      next();
    };
  };
};
```

There are two types of middleware you will be writing in byword. One that _builds up a response or partially handles a request_ and one that _responds to a client_. The pattern above is for the former, the pattern below is for the latter.

```js
module.exports = function(.../* dependencies as arguments */) {
  return function(value) { // middleware generator function
    // registers the middleware on the path
    this.build(function(req, res) {
      res.json();
    });
  };
};
```

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
};
```

You can also register a dependency with a literal value by calling `byword.dep(key, value)` before initializing byword.

---

### Byword
```js
var app = require('express')(),
    byword = require('byword')(app);

byword.[mid|midDir|dep|depDir|res|resDir|plugin|init]();

app.listen(3000);
```

All of the byword methods return byword itself, so chain away as seen in the examples. The order of these methods do not matter, only remember to call `init` after calling all of them - dependencies are lazily loaded.

* `mid(key, function(req, res[, next]) {})` - adds a middleware function that can be used in your controllers.
* `midDir(path)` - adds middlware functions that can be used in your controllers by using the name of the files from the path as the middleware function names.
* `dep(key, value)` - registers a dependency, where the key must be used in a method signature for injection.
* `dep(path)` - registers dependencies, using the name of the files from the path as the dependency names.
* `res(function(... /* dependencies */))` - calls a function and inject any dependencies into it.
* `res(path)` - calls all functions from the files at the given path - all files should have a `module.exports = function() {}`.
* `plugin()` - still in development.
* `init()` - (1) register all plugin dependencies, user dependencies should already be registered prior to init - (2) resolve all plugin dependencies - (3) resolve all other dependencies and does injections on `res` registerd functions - (4) resolve all middleware dependencies during controller initialization.

Final Words
===========

At the core byword only adds structure with a few helper methods, how you choose to use it is up to you.

Please report any bugs or suggestions [here](https://github.com/daure/byword/issues).
