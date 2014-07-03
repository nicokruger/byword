module.exports = function(app) {
    app.get('/doFirstJob', function(req, res) {
        res.json('firstJobResult');
    });
};