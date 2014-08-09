module.exports = function() {
    return function(arb) {
        this.build(function(req, res) {
            res.json(arb + ' string');
        });
    };
};

