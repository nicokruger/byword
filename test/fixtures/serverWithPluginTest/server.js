var express = require('express');

module.exports = function(root, done) {
    var app = express(),
        byword = require('../../../index')(app, root);

    byword.plugin(require('./mongoPlugin')())
        .init();

    return app.listen(3000, '127.0.0.1', done);
};
