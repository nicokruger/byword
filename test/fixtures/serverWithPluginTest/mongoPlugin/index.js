module.exports = function() {
    var db = {};

    return {
        id: 'mongo',
        dependencies: {
            justForKicks1: 'Arb1',
            justForKicks2: 'Arb2',

            Schema: function(justForKicks1) {
                return function(name) {
                    this.getName = function() {
                        return name;
                    };

                    this.getArb = function() {
                        return justForKicks1;
                    }
                }
            },
            db: db
        },
        resolves: [
            function(Schema) {
                return new Schema('users');
            }
        ],
        onResolve: function(model) {
            db[model.getName()] = model;
        },
        middleware: {
            findAll: function(justForKicks2) {
                return function(model) {
                    return function(req, res, next) {
                        req.setValue(model.getName() + 'FindAll', ['user1', 'user2', model.getArb(), justForKicks2]);
                        next();
                    };
                };
            },
            findById: function() {
                return function(model) {
                    return function(req, res, next) {
                        req.setValue(model.getName() + 'FindById', 'user' + req.params[model.getName()]);
                        next();
                    };
                };
            }
        }
    };
};
