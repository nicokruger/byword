module.exports = function(smileSize) {
    return function(key) {
        return function(req, res, next) {
            req.setValue(key, smileSize + ' smile');
            next();
        };
    }
};