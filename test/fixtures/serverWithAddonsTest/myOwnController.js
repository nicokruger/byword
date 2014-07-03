module.exports = function(app, smileSize, winkSize) {
    app.get('/customResolved', function(req, res) {
        res.json({
            smileSize: smileSize,
            winkSize: winkSize
        });
    });
};