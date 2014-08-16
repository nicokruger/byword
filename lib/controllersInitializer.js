var fsWalk = require('fs-walk'),
    fs = require('fs'),
    ControllerContext = require('./ControllerContext'),
    _ = require('underscore');

module.exports = function (controllersRoot, app, middlewareAddons, container) {
    var controllerContext = new ControllerContext(app),
        resolvedMiddlewareAddons = _.map(middlewareAddons, function(middleware, key) {
            return {
                name: key,
                middleware: container.resolve(middleware)
            }
        });

    ControllerContext.setMiddlewareAddons(resolvedMiddlewareAddons);

    if (!fs.existsSync(controllersRoot)) {
        console.error('Controllers folder not found at "' + controllersRoot + '"');
        return;
    }

    fsWalk.filesSync(controllersRoot, function (basedir, filename) {
        if (!filename.match(/\.js$/)) {
            // ignore because it's not a JS file
            return;
        }

        var controller = require(basedir + '/' + filename),
            contextBoundController = controller.bind(controllerContext),
            controllerToString = controller.toString();

        /* "dependable" does toString on resolve; .bind returns a function that does does not have
           the same toString value as the original function and thus can't be injected into.
           Solution is to override toString on the controller to return the original toString of
           the function.*/
        contextBoundController.toString = function() {
            return controllerToString;
        };

        container.resolve(contextBoundController);
    });
};
