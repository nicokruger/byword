module.exports = function(winkSize) {
    return function(someKey) {
        return function(req, res, next) {
            req.setValue(someKey, winkSize + ' wink');
            next();
        };
    }
};