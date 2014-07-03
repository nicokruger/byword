var fs = require('fs');

module.exports = function(viewsRoot, app, viewEngine) {
    if (!fs.existsSync(viewsRoot)) {
        console.warn('Views folder not found at "' + viewsRoot + '"');
        return;
    }

    app.set('views', viewsRoot);
    app.set('view engine', viewEngine || 'jade');
    app.locals.basedir = viewsRoot;
};