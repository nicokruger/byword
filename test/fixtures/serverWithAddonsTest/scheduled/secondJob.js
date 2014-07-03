module.exports = function(app) {
    app.get('/doSecondJob', function(req, res) {
        res.json('secondJobResult');
    });
};