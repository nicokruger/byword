var express = require('express');

module.exports = function(root, done) {
    var app = express(),
        byword = require('../../../index')(app, root);

    byword.use('additionMiddleware', require('./additionMiddleware'))
        .useDir('./middleware')
        .register('multiplyService', require('./multiplyService'))
        .register('multiplyValue', 10)
        .registerDir('./services')
        .resolve(require('./myOwnController'))
        .resolveDir('./scheduled')
        .init();

    return app.listen(3000, '127.0.0.1', done);
};
