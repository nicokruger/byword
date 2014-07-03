var path = require('path'),
    fsWalk = require('fs-walk'),
    bodyParser = require('body-parser'),
    dependable = require('dependable'),
    controllersInitializer = require('./lib/controllersInitializer'),
    viewsInitializer = require('./lib/viewsInitializer'),
    _ = require('underscore');

module.exports = function(app, rootPath) {
    var middlewareAddons = {},
        container = dependable.container(),
        appRoot = path.resolve(path.join(__dirname, rootPath || '../../../..'));

    container.register('app', function() {
        return app;
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(function(req, res, next) {
        req._dict = {};

        req.setValue = function(key, value) {
            req._dict[key] = value;
        };

        req.getValue = function(key) {
            return req._dict[key];
        };

        next();
    });

    return {
        init: function(config) {
            var
                controllersRoot = path.resolve(appRoot + '/controllers'),
                viewsRoot = path.resolve(appRoot + '/views');

            viewsInitializer(viewsRoot, app, config && config.viewEngine);
            controllersInitializer(controllersRoot, app, middlewareAddons, container);
        },
        use: function(name, middleware) {
            middlewareAddons[name] = middleware;

            return this;
        },
        useDir: function(middlewarePath) {
            fsWalk.filesSync(path.resolve(appRoot + '/' + middlewarePath), function (basedir, filename) {
                middlewareAddons[path.basename(filename, '.js')] = require(path.join(basedir, filename));
            });

            return this;
        },
        register: function() {
            container.register.apply(null, arguments);

            return this;
        },
        registerDir: function(relativeDir) {
            container.load.call(null, path.join(appRoot, relativeDir));

            return this;
        },
        resolve: function() {
            container.resolve.apply(null, arguments);

            return this;
        },
        resolveDir: function(relativeDir) {
            fsWalk.filesSync(path.resolve(appRoot + '/' + relativeDir), function (basedir, filename) {
                container.resolve(require(path.join(basedir, filename)));
            });

            return this;
        },
        get: function() {
            container.get.apply(null, arguments);

            return this;
        }
    };
};