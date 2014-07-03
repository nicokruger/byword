module.exports = function(multiplyService, app) {
    app.get('/expressApp', function(req, res) {
        res.json('3xpr355')
    });

    this.get('/addition').additionMiddleware(3, 3).json('sum');
    this.get('/multiply').end(function(req, res) {
        res.json(multiplyService(5, 5));
    });
    this.get('/expression').addSmile('smile').addWink('wink').json();
};