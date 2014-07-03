module.exports = function (multiplyValue) {
    return function (val1, val2) {
        return val1 * val2 * multiplyValue;
    }
};