var MiddlewareBuilder = require('./MiddlewareBuilder.js'),
    path = require('path'),
    _ = require('underscore');

module.exports = ControllerContext;
module.exports.setMiddlewareAddons = function(middlewareAddons) {
    _.each(middlewareAddons, function(mw) {
        MiddlewareBuilder.prototype[mw.name] = function() {
            this._middleware.push(mw.middleware.apply(this, arguments));
            return this;
        }
    });
};

function ControllerContext(app) {
    this._app = app;
    this._basePath = '';
}

ControllerContext.prototype.get = function(requestPath) {
    return new MiddlewareBuilder(this._app, 'get', calculateRoutePath(this._basePath, requestPath));
};

ControllerContext.prototype.post = function(requestPath) {
    return new MiddlewareBuilder(this._app, 'post', calculateRoutePath(this._basePath, requestPath));
};

ControllerContext.prototype.put = function(requestPath) {
    return new MiddlewareBuilder(this._app, 'put', calculateRoutePath(this._basePath, requestPath));
};

ControllerContext.prototype.delete = function(requestPath) {
    return new MiddlewareBuilder(this._app, 'delete', calculateRoutePath(this._basePath, requestPath));
};

ControllerContext.prototype.all = function(requestPath) {
    return new MiddlewareBuilder(this._app, 'all', calculateRoutePath(this._basePath, requestPath));
};

ControllerContext.prototype.setBasePath = function(value) {
    this._basePath = value;
};

function stripTrailingSlash(str) {
    if(str.substr(-1) == '/') {
        return str.substr(0, str.length - 1);
    }

    return str;
}

function calculateRoutePath(basePath, requestPath) {
    var pathToRegister = requestPath || '';

    if (basePath) {
        pathToRegister = path.join(basePath, pathToRegister);
    }

    return stripTrailingSlash(pathToRegister);
}
