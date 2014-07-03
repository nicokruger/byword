module.exports = function() {
    return function(val1, val2) {
        return function(req, res, next) {
            req.setValue('sum', val1 + val2);
            next();
        };
    }
};
