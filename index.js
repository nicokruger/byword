var path = require('path'),
    fsWalk = require('fs-walk'),
    bodyParser = require('body-parser'),
    dependable = require('dependable'),
    controllersInitializer = require('./lib/controllersInitializer'),
    viewsInitializer = require('./lib/viewsInitializer'),
    _ = require('underscore');

module.exports = function(app, rootPath) {
    var container = dependable.container(),
        appRoot = path.resolve(path.join(__dirname, rootPath || '../..')),

        dependencies = [],
        dependenciesDir = [],
        plugins = {},
        middlewareAddons = {};


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
        /**
         * (1) Register all dependencies.
         * (2) Resolve all plugin dependencies and call their 'onResolved' method if it exists.
         * (3) Resolve all other dependencies.
         * (4) Resolve all middleware.
         */
        init: function(config) {
            var controllersRoot = path.resolve(appRoot + '/controllers'),
                viewsRoot = path.resolve(appRoot + '/views');

            _(plugins).each(function(plugin) {
                // (1) Register all plugin dependencies, user dependencies should already be registered prior to init.
                if (!_.isUndefined(plugin.dependencies)) {
                    _(plugin.dependencies).each(function(dependency, key) {
                        container.register(key, dependency);
                    });
                }

                // (2) Resolve all plugin dependencies and call their 'onResolved' method if it exists.
                if (!_.isUndefined(plugin.resolves)) {
                    _(plugin.resolves).each(function(fn) {
                        var resolved = container.resolve(fn);

                        plugin.onResolve && plugin.onResolve(resolved);
                    });
                }

                // Just add the middleware, they get resolved during controllerInitialization.
                if (!_.isUndefined(plugin.middleware)) {
                    _(plugin.middleware).each(function(middleware, key) {
                        middlewareAddons[key] = middleware;
                    });
                }
            });

            // (3) Resolve all other dependencies.

            _(dependencies).each(function(dep) {
                container.resolve(dep);
            });

            _(dependenciesDir).each(function(depDir) {
                fsWalk.filesSync(path.resolve(appRoot + '/' + depDir), function (basedir, filename) {
                    container.resolve(require(path.join(basedir, filename)));
                });
            });

            viewsInitializer(viewsRoot, app, config && config.viewEngine);

            // (4) Resolve all middleware during controller initialization.
            controllersInitializer(controllersRoot, app, middlewareAddons, container);
        },
        plugin: function(plugin) {
            if (_.isUndefined(plugin))
                throw new Error('Trying to load an undefined plugin.');

            plugins[plugin.id] = plugin;


            return this;
        },
        mid: function(name, middleware) {
            middlewareAddons[name] = middleware;

            return this;
        },
        midDir: function(middlewarePath) {
            dependenciesDir.push(middlewarePath);
            fsWalk.filesSync(path.resolve(appRoot + '/' + middlewarePath), function (basedir, filename) {
                middlewareAddons[path.basename(filename, '.js')] = require(path.join(basedir, filename));
            });

            return this;
        },
        dep: function() {
            container.register.apply(null, arguments);

            return this;
        },
        depDir: function(relativeDir) {
            container.load.call(null, path.join(appRoot, relativeDir));

            return this;
        },
        res: function(value) {
            dependencies.push(value);

            return this;
        },
        /**
         * Resolves all modules in a directory.
         * @param relativeDir should be a path relative to the root of a project.
         * @returns this for chaining syntactic sugar.
         */
        resDir: function(relativeDir) {
            dependenciesDir.push(relativeDir);

            return this;
        },
        get: function() {
            container.get.apply(null, arguments);

            return this;
        }
    };
};
