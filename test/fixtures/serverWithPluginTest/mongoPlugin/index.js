module.exports = function(config) {
    return {
        middleware: {
            findAll: function(model) {
                return function(req, res, next) {
                    req.setValue(model.modelName + 'FindAll', ['user1', 'user2']);
                    next();
                };
            },
            findById: function(model) {
                return function(req, res, next) {
                    req.setValue(model.modelName + 'FindById', 'user' + req.params[model.modelName]);
                    next();
                };
            }
        },
        dependencies: {
            db: function() {
                return {
                    'users': {
                        modelName: 'users'
                    }
                };
            }
        }
    };
};
