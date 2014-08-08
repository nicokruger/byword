byword
======

An MVC framework for node that adds support for adding general use middleware as well as dependency injection. Note that byword does not support any database and you can thus add your own.

```js
var app = require('express')(),
    byword = require('byword')(app);

byword.init();

app.listen(3000);
```

### Installation

```bash
$ npm install byword jade
```

### Features
  * Route handling builder.
  * Adding custom middleware.
  * Dependency injection.
  * Custom plugin support. (mongodb and authentication plugins are underway)
  
### Philosophy

The byword philosophy is to provide a means to easily add functionality to controllers
in an MVC setting, either by registering custom middleware or having dependencies injected.

The goals are to write DRY code, support code reuse and allow for rapid web development.

Quick Overview
==============

### Directory structure

Byword makes use of two directories: a 'controllers' and 'views' directory in the root of your project. They are strictly not necessary.

### Built with

Byword is built using expressjs and dependable so knowing how these libraries work or refering to their documentation is necessary.

### Short controller example

```js
module.exports = function() {
  this.get('/respond').respond();

  this.get('/redirect').redirect('/somewhere-over-the-rainbow');
  this.get('/somewhere-over-the-rainbow').respond();

  this.get('/render').attr('title', 'welcome').render('index');

  this.get('/json').attr('key1', 'val1').attr({
    key2: 'val2',
    key3: 'val3'
  }).json();
  
  this.post('/user').do(function(req, res, next) {
    /* add user saving code */
  }).redirect('/users/userOverview');
  
  this.get('/users/userOverview').render('users/userOverviewPage');
  
  this.delete('/users/:id').do(function(req, res, next) {
    /* add delete user code */
  }).end(function(req, res) {
    res.json({msg: 'User has been deleted.'});
  });
  
  /* note that the end method could have been replaced with
    .attr('msg', 'User has been deleted.').json(); */
}
```
Every controller has a context (_this_) that has builder methods for http methods (get, post, put, delete).

* GET '/respond' responds with a 200 status code.
* GET '/redirect' redirects the user to '/somewhere-over-the-rainbow'.
* GET '/render' renders a page found at '[root of project]\views\index.jade' that has access to the title attribute.
* GET '/json' responds with a json object that has the following keys ['key1', 'key2', 'key3'].
* POST '/user' has a custom middleware function that saves a new user and redirects the client to '/users/userOverview'.
* DELETE '/users/:id' deletes a user with the specified _id_ and responds with json.
Note that this.[get|post|put|delete] can have any middleware that follows in any order. One does have to make sure that the last middleware added to this chain gives a response.

Long Example
============

### Server _app.js_
```js
var app = require('express')(),
    byword = require('byword')(app);

byword.use('persister', 'middleware\persister')
  .register('myEmailer', 'services\emailer')
  .register('emailerSettings', {
    address: 'user@company.com'
  })
  .init();

app.listen(3000);
```

### Custom Middleware _middleware\persister.js_
```js
module.exports = function() {
  return function() {
    return function(req, res, next) {
      req.setValue(key, smileSize + ' smile');
      next();
    };
  }
};
```

### Dependency _services\emailer.js_
```js
var emailLib = require('someEmailLib');

module.exports = function(emailerSettings) {
  
}

### Controller _controllers\myController.js_
```js
var UserModel = require('./models/UserModel'); /* the details of userModel is arbitrary */
module.exports = function(myEmailer) {
  this.post('/user').persister(UserModel).do(req, res, next) {
    myEmailer.send(user.
  })
}
```

Documentation
=============

Have a look at the tests as well as they double for documentation.

### Controller definition structure
```js
module.exports = function(.../* dependencies as arguments */) {
  this.[get|post|put|delete]('/somePath')
    .[attr|respond|render|json|redirect|do|end|custom_middleware]();
}
```

### Middleware structure
```js
module.exports = function(.../* dependencies as arguments */) {
  return function(value) { // middleware method signature
    return function(req, res [, next]) { //middleware function to use
      next();
    };
  }
}
```

### Dependeny structure
```js
module.exports = function(.../* dependencies as arguments */) {
  return function() {
  }; // can also return a literal value
}
```

### Server init structure
```js
byword.[use|useDir|register|registerDir|resolve|resolveDir|plugin|init]
```

### The request object

Final Words
===========

At the core byword only adds structure with a few helper methods, how you choose to use it is up to you.

Please report any bugs or suggestions here.
