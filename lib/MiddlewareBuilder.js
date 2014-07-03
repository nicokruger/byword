var _ = require('underscore');

module.exports = MiddlewareBuilder;

function MiddlewareBuilder(app, method, requestPath) {
    this._middleware = [];

    this._app = app;
    this._method = method;
    this._requestPath = requestPath;
}

// Middleware build functions

MiddlewareBuilder.prototype.do = function(middleware) {
    this._middleware.push(middleware);

    return this;
};


MiddlewareBuilder.prototype.attr = function(keyOrObject, value) {
    this._middleware.push(function(req, res, next) {
        if (typeof keyOrObject === 'object') {
            _.extend(req._dict, keyOrObject);
        } else {
            req.setValue(keyOrObject, value);
        }

        next();
    });

    return this;
};

// Helper function to easily register/build the route & middleware

MiddlewareBuilder.prototype.build = function() {
    this._app[this._method](this._requestPath, this._middleware);
};

// Middleware product producers

MiddlewareBuilder.prototype.end = function(middleware) {
    this._middleware.push(middleware);

    this.build();
};

MiddlewareBuilder.prototype.respond = function() {
    this._middleware.push(function(req, res) {
        res.send(200);
    });

    this.build();
};

MiddlewareBuilder.prototype.redirect = function(url) {
    this._middleware.push(function(req, res) {
        res.redirect(url);
    });

    this.build();
};

MiddlewareBuilder.prototype.render = function(view, value) {
    this._middleware.push(function(req, res) {
        res.render(view, value ? req._dict[value] : req._dict);
    });

    this.build();
};

MiddlewareBuilder.prototype.json = function(value) {
    this._middleware.push(function(req, res) {
        res.json(value ? req._dict[value] : req._dict);
    });

    this.build();
};
