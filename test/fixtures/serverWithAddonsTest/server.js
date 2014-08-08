var express = require('express');

module.exports = function(root, done) {
    var app = express(),
        byword = require('../../../index')(app, root);

    byword.mid('additionMiddleware', require('./additionMiddleware'))
        .midDir('./middleware')
        .dep('multiplyService', require('./multiplyService'))
        .dep('multiplyValue', 10)
        .depDir('./services')
        .res(require('./myOwnController'))
        .resDir('./scheduled')
        .init();

    return app.listen(3000, '127.0.0.1', done);
};
